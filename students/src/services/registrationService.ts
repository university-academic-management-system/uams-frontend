import apiClient from './api';
import type {
  ApiResponse,
  Level,
  Semester,
  Session,
  StudentProfile,
  Course,
  RegistrationData,
  RegisterCoursesRequest,
  RegisteredCourse,
  DeliveryMode,
  TranscriptRequest,
  TranscriptRequestResponse,
  AddCourseToCartRequest,
  DepartmentCourse,
  DepartmentCoursesResponse,
} from './types';

// ============================================
// Academic Endpoints
// ============================================

/**
 * Get available academic levels (100, 200, 300, etc.)
 */
export const getLevels = async (): Promise<Level[]> => {
  try {
    const response = await apiClient.get<Level[]>('/accademics/levels');
    return response.data ?? [];
  } catch (error) {
    console.error('Failed to fetch levels:', error);
    return [];
  }
};

/**
 * Get available semesters
 */
export const getSemesters = async (): Promise<Semester[]> => {
  try {
    const response = await apiClient.get<Semester[]>('/accademics/semesters');
    return response.data ?? [];
  } catch (error) {
    console.error('Failed to fetch semesters:', error);
    return [];
  }
};

/**
 * Get available academic sessions
 */
export const getSessions = async (): Promise<Session[]> => {
  try {
    const response = await apiClient.get<Session[]>('/accademics/sessions');
    return response.data ?? [];
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    return [];
  }
};

// ============================================
// Student Endpoints
// ============================================

/**
 * Get current student's profile
 */
export const getStudentProfile = async (): Promise<StudentProfile | null> => {
  try {
    const response = await apiClient.get<ApiResponse<StudentProfile>>('/students/profile');
    return response.data?.data ?? null;
  } catch (error) {
    console.error('Failed to fetch student profile:', error);
    return null;
  }
};

/**
 * Student registration item from GET /students/registrations
 */
export interface StudentRegistration {
  id: string;
  universityId: string;
  sessionId: string;
  studentId: string;
  semesterId: string;
  courseId: string;
  status: string;
  totalCredits: number;
  createdAt: string;
  updatedAt: string;
  Course: {
    code: string;
    title: string;
    creditUnits: number;
  };
  Semester: {
    name: string;
  };
  Session: {
    name: string;
  };
}

interface StudentRegistrationsResponse {
  status: string;
  registrations: StudentRegistration[];
}

/**
 * Get student's registered courses
 * Returns courses formatted for the UI with lecturer defaulting to "Not Assigned"
 * and status "confirmed" mapped to "Registered"
 */
export const getRegistrations = async (): Promise<RegistrationData | null> => {
  try {
    const response = await apiClient.get<StudentRegistrationsResponse>('/students/registrations');
    
    if (response.data?.status === 'success' && response.data.registrations) {
      // Transform API response to RegistrationData format
      const registrations = response.data.registrations;
      
      // Map status: "confirmed" -> "registered"
      const formatStatus = (status: string): 'registered' | 'pending' | 'dropped' => {
        if (status === 'confirmed') return 'registered';
        if (status === 'pending') return 'pending';
        return 'dropped';
      };
      
      const courses: RegisteredCourse[] = registrations.map(reg => ({
        id: reg.id,
        courseId: reg.courseId,
        code: reg.Course.code,
        title: reg.Course.title,
        creditUnits: reg.Course.creditUnits,
        type: 'Departmental', // Default type since API doesn't return this
        lecturer: 'Not Assigned', // API doesn't return lecturer info
        status: formatStatus(reg.status),
        registeredAt: reg.createdAt,
        sessionId: reg.sessionId, // Include sessionId for filtering
      }));

      // Calculate total units
      const totalUnits = courses.reduce((sum, c) => sum + c.creditUnits, 0);
      
      return {
        session: registrations[0]?.Session?.name || '',
        semester: registrations[0]?.Semester?.name || '',
        totalUnits,
        maxAllowedUnits: 24, // Default max units
        registrationStatus: 'open',
        courses,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch registrations:', error);
    return null;
  }
};

/**
 * Get courses available for the student's department
 */
export const getDepartmentCourses = async (): Promise<DepartmentCourse[]> => {
  try {
    const response = await apiClient.get<DepartmentCoursesResponse>('/courses/my-department');
    return response.data?.courses ?? [];
  } catch (error) {
    console.error('Failed to fetch department courses:', error);
    return [];
  }
};

// ============================================
// Course Cart Endpoints
// ============================================

// Cart Item type from GET /course-cart/
export interface CartItem {
  id: string;
  universityId: string;
  studentId: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  course: {
    id: string;
    code: string;
    title: string;
    creditUnits: number;
  };
}

/**
 * Get all courses in the cart
 */
export const getCourseCart = async (): Promise<CartItem[]> => {
  try {
    const response = await apiClient.get<CartItem[]>('/course-cart/');
    return response.data ?? [];
  } catch (error) {
    console.error('Failed to fetch course cart:', error);
    return [];
  }
};

/**
 * Add course(s) to the registration cart
 * @param courseIds - Single course ID or array of course IDs to add
 */
export const addCourseToCart = async (courseIds: string | string[]): Promise<{ success: boolean; message: string }> => {
  try {
    // Normalize to array
    const ids = Array.isArray(courseIds) ? courseIds : [courseIds];
    const response = await apiClient.post('/course-cart/add', { courseId: ids });
    return { success: true, message: response.data?.message || 'Course(s) added to cart' };
  } catch (error: any) {
    console.error('Failed to add course(s) to cart:', error);
    // Extract error from response - API returns { error: '...' }
    const message = error.response?.data?.error || error.response?.data?.message || 'Failed to add course(s) to cart';
    return { success: false, message };
  }
};

/**
 * Remove a course from the registration cart
 * @param courseId - The ID of the course to remove
 */
export const removeCourseFromCart = async (courseId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete(`/course-cart/remove`, {data: {courseId}});
    return { success: true, message: response.data?.message || 'Course removed from cart' };
  } catch (error: any) {
    console.error('Failed to remove course from cart:', error);
    const message = error.response?.data?.message || 'Failed to remove course from cart';
    return { success: false, message };
  }
}

/**
 * Bulk register courses for a semester
 * @param data - Registration data including payment reference, level, session, credits, and amount
 */
export const bulkRegisterCourses = async (data: {
  paymentReference: string;
  levelId: string;
  sessionId: string;
  totalCredits: number;
  totalAmount: number;
}): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const response = await apiClient.post('/course-registration/confirm', data);
    return { 
      success: true, 
      message: response.data?.message || 'Courses registered successfully',
      data: response.data 
    };
  } catch (error: any) {
    console.error('Failed to register courses:', error);
    console.error('Error response:', error.response?.data);
    const message = error.response?.data?.error || error.response?.data?.message || 'Failed to register courses';
    return { success: false, message };
  }
}

/**
 * Initialize payment for course registration
 * @param semesterId - The ID of the semester
 * @param amount - Payment amount
 * @param callbackUrl - URL to redirect after payment
 */
export const initCourseRegistrationPayment = async (
  semesterId: string,
  amount: number,
  callbackUrl: string
): Promise<{ 
  success: boolean; 
  message: string; 
  authorizationUrl?: string;
  reference?: string;
  transactionId?: string;
}> => {
  try {
    const response = await apiClient.post('/course-registration/payment/init', {
      semesterId,
      amount,
      callbackUrl,
    });
    return { 
      success: true, 
      message: 'Payment initialized successfully',
      authorizationUrl: response.data?.data?.authorizationUrl,
      reference: response.data?.data?.reference,
      transactionId: response.data?.data?.transactionId,
    };
  } catch (error: any) {
    console.error('Failed to initialize payment:', error);
    const message = error.response?.data?.message || 'Failed to initialize payment';
    return { success: false, message };
  }
};


// ============================================
// Course Endpoints
// ============================================

/**
 * Get available courses for registration
 * @param level - Academic level (100, 200, etc.)
 * @param semester - Semester (first, second)
 * @param session - Optional academic session
 * @param search - Optional search query
 */
export const getAvailableCourses = async (
  level: number,
  semester: string,
  session?: string,
  search?: string
): Promise<Course[]> => {
  const params = new URLSearchParams();
  params.append('level', level.toString());
  params.append('semester', semester);
  if (session) params.append('session', session);
  if (search) params.append('search', search);
  
  const response = await apiClient.get<ApiResponse<Course[]>>(
    `/courses/available?${params.toString()}`
  );
  return response.data.data;
};

/**
 * Register for courses
 * @param data - Course registration data
 */
export const registerCourses = async (
  data: RegisterCoursesRequest
): Promise<{ registeredCourses: RegisteredCourse[]; totalUnitsRegistered: number }> => {
  const response = await apiClient.post<ApiResponse<{
    registeredCourses: RegisteredCourse[];
    totalUnitsRegistered: number;
    remainingUnits: number;
  }>>('/students/registrations', data);
  return response.data.data;
};

/**
 * Drop/unregister a course
 * @param registrationId - The registration ID to drop
 */
export const dropCourse = async (registrationId: string): Promise<void> => {
  await apiClient.delete(`/students/registrations/${registrationId}`);
};

// ============================================
// Transcript Endpoints
// ============================================

/**
 * Get available transcript delivery modes
 */
export const getDeliveryModes = async (): Promise<DeliveryMode[]> => {
  const response = await apiClient.get<ApiResponse<DeliveryMode[]>>('/transcripts/delivery-modes');
  return response.data.data;
};

/**
 * Submit a transcript request
 * @param data - Transcript request data
 */
export const submitTranscriptRequest = async (
  data: TranscriptRequest
): Promise<TranscriptRequestResponse> => {
  const response = await apiClient.post<ApiResponse<TranscriptRequestResponse>>(
    '/transcripts/requests',
    data
  );
  return response.data.data;
};

/**
 * Calculate transcript fee
 * @param deliveryMode - Delivery mode ID
 * @param destinationType - Local or international
 * @param copies - Number of copies
 */
export const calculateTranscriptFee = async (
  deliveryMode: string,
  destinationType: 'local' | 'international',
  copies: number = 1
): Promise<{ totalFee: number; baseFee: number }> => {
  const params = new URLSearchParams({
    deliveryMode,
    destinationType,
    copies: copies.toString(),
  });
  
  const response = await apiClient.get<ApiResponse<{
    baseFee: number;
    internationalFee: number;
    copiesFee: number;
    totalFee: number;
    currency: string;
  }>>(`/transcripts/calculate-fee?${params.toString()}`);
  
  return response.data.data;
};

// Export all functions as a service object for convenience
const registrationService = {
  // Academic
  getLevels,
  getSemesters,
  getSessions,
  // Student
  getStudentProfile,
  getRegistrations,
  // Courses
  getAvailableCourses,
  registerCourses,
  dropCourse,
  // Transcripts
  getDeliveryModes,
  submitTranscriptRequest,
  calculateTranscriptFee,
};

export default registrationService;
