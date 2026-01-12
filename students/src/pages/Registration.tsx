
import React, { useState, useEffect } from 'react';
import { ChevronDown, Loader2, CreditCard, Printer, Download, ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStoredUser } from '../services/authService';
import {
  getLevels,
  getSemesters,
  getSessions,
  getStudentProfile,
  getRegistrations,
  getDepartmentCourses,
  addCourseToCart,
  getCourseCart,
  removeCourseFromCart,
  bulkRegisterCourses,
  initRegistrationFeePayment,
} from '../services/registrationService';
import type {
  Level,
  Semester,
  Session,
  StudentProfile,
  RegistrationData,
  RegisteredCourse,
  DepartmentCourse,
} from '../services/types';

const checkboxClasses = "appearance-none w-4 h-4 bg-white border border-gray-300 rounded checked:bg-blue-600 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer transition-all bg-center bg-no-repeat checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22white%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M16.707%205.293a1%201%200%20010%201.414l-8%208a1%201%200%2001-1.414%200l-4-4a1%201%200%20011.414-1.414L8%2012.586l7.293-7.293a1%201%200%20011.414%200z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')]";

const InputField = ({ label, placeholder, type = "text", isSelect = false }: { label: string, placeholder: string, type?: string, isSelect?: boolean }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-[13px] font-medium text-gray-500">{label}</label>
    <div className="relative">
      {isSelect ? (
        <>
          <select className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[13px] text-gray-400 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-100">
            <option value="">{placeholder}</option>
            <option value="digital">Digital Delivery (Email)</option>
            <option value="courier">Courier Service</option>
            <option value="pickup">Physical Pickup</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
        </>
      ) : (
        <input 
          type={type} 
          placeholder={placeholder} 
          className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[13px] text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-blue-100 placeholder:text-gray-300" 
        />
      )}
    </div>
  </div>
);

const TranscriptRegView = () => (
  <div className="bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-12 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h2 className="text-xl font-bold text-[#1e293b] mb-8 lg:mb-10">Transcript Registration</h2>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
      <InputField label="Name of receiving institution or organization" placeholder="University of Port..." />
      <InputField label="Mode of Transcript Delivery" placeholder="Select mode of delivery" isSelect />
      <InputField label="Recipient address" placeholder="Enter address" />
      <InputField label="Recipient address" placeholder="Enter address" />
      
      <div className="lg:col-span-2">
        <InputField label="Contact email/phone of recipient (if requested)" placeholder="Input contact information" />
      </div>
    </div>

    <div className="mt-8 text-[12px] text-gray-400 leading-relaxed font-medium">
      <p>
        Applicants are required to pay the prescribed transcript processing fee through the university's online portal. 
        The fee varies depending on the destination and mode of delivery and may range between <span className="font-bold text-gray-600">₦5,000</span> and <span className="font-bold text-gray-600">₦30,000</span>. 
        <span className="font-bold text-gray-600"> Additional courier or postage charges may apply for hard-copy deliveries.</span>
      </p>
      <p className="mt-2">
        All payments must be made online, and a payment receipt will be generated automatically upon successful transaction.
      </p>
    </div>

    <div className="mt-10 lg:mt-12 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
      <button className="bg-[#22c55e] hover:bg-green-600 text-white px-8 py-3 rounded-lg text-[13px] font-bold transition-all shadow-md shadow-green-100">
        Proceed to make payment
      </button>
      <button className="bg-white border border-gray-200 text-gray-500 px-8 py-3 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-all">
        Cancel
      </button>
    </div>
  </div>
);

interface CoursesRegViewProps {
  levels: Level[];
  semesters: Semester[];
  sessions: Session[];
  registrationData: RegistrationData | null;
  studentProfile: StudentProfile | null;
  isLoading: boolean;
}

const FormRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="grid grid-cols-12 items-center gap-4">
    <label className="col-span-12 sm:col-span-3 text-[13px] font-bold text-[#1e293b]">{label}</label>
    <div className="col-span-12 sm:col-span-9 relative">
      {children}
    </div>
  </div>
);

// --- ID Card Components ---

interface IDCardProps {
  isWatermarked?: boolean;
  studentProfile?: StudentProfile | null;
  studentPhoto?: string | null;
  isPhotoUploaded?: boolean;
}

const IDCardGraphic = ({ 
  isWatermarked = false, 
  studentProfile,
  studentPhoto,
  isPhotoUploaded = false
}: IDCardProps) => {
  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* FRONT OF CARD */}
      <div className="relative aspect-[1.6/1] rounded-xl border-4 border-[#3b82f6] shadow-xl overflow-hidden">
        <img 
          src={`${import.meta.env.BASE_URL}assets/image 1.png`}
          alt="ID Card Front"
          className="w-full h-full object-cover"
        />

        {/* Student Photo - Placed in the exact position on the card */}
        {studentPhoto && isPhotoUploaded && (
          <div className="absolute top-6 right-6 w-20 h-24 rounded-lg overflow-hidden shadow-md">
            <img 
              src={studentPhoto} 
              alt="Student Photo" 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Watermark Overlay */}
        {isWatermarked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden bg-white/20">
            <div className="text-[60px] font-black text-gray-900/20 -rotate-25 uppercase whitespace-nowrap select-none">
              PREVIEW ONLY
            </div>
          </div>
        )}
      </div>

      {/* BACK OF CARD */}
      <div className="relative aspect-[1.6/1] rounded-xl border-4 border-[#3b82f6] shadow-xl overflow-hidden">
        <img 
          src={`${import.meta.env.BASE_URL}assets/image 2.png`}
          alt="ID Card Back"
          className="w-full h-full object-cover"
        />

        {/* Watermark Overlay */}
        {isWatermarked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden bg-white/20">
            <div className="text-[60px] font-black text-gray-900/20 -rotate-25 uppercase whitespace-nowrap select-none">
              PREVIEW ONLY
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface IDCardViewProps {
  isPaid: boolean;
  isPhotoUploaded?: boolean;
  onBack: () => void;
  studentProfile?: StudentProfile | null;
  studentPhoto?: string | null;
}

const IDCardView = ({ 
  isPaid, 
  isPhotoUploaded = false,
  onBack, 
  studentProfile,
  studentPhoto 
}: IDCardViewProps) => (
  <div className="bg-white rounded-4xl p-8 lg:p-14 border border-gray-100 shadow-sm animate-in zoom-in-95 duration-500 max-w-4xl mx-auto">
    <div className="flex items-center space-x-4 mb-10">
      <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full text-gray-400 transition-colors">
        <ArrowLeft size={22} />
      </button>
      <h2 className="font-['Inter'] text-2xl font-bold text-[#1e293b] tracking-tight">
        {isPaid ? (isPhotoUploaded ? 'ID Card Ready' : 'ID Card - Waiting for Photo') : 'ID Card Preview'}
      </h2>
    </div>

    {/* Photo Status Notification */}
    {isPaid && !isPhotoUploaded && (
      <div className="bg-linear-to-r from-[#fbbf24] to-[#f59e0b] p-4 rounded-xl mb-8 flex items-center space-x-3 shadow-md animate-pulse">
        <div className="text-white text-xl">⏳</div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">Waiting for Photo Upload</p>
          <p className="text-xs text-white/90">Admin will upload your photo soon</p>
        </div>
      </div>
    )}

    {isPaid && isPhotoUploaded && (
      <div className="bg-linear-to-r from-[#4ade80] to-[#22c55e] p-4 rounded-xl mb-8 flex items-center space-x-3 shadow-md">
        <div className="text-white text-xl">✓</div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">Photo Ready</p>
          <p className="text-xs text-white/90">Your ID card is ready to download</p>
        </div>
      </div>
    )}

    {/* ID Card Display */}
    <div className="bg-[#525252] rounded-3xl p-10 mb-12 shadow-inner">
      <IDCardGraphic 
        isWatermarked={!isPaid} 
        studentProfile={studentProfile}
        studentPhoto={studentPhoto}
        isPhotoUploaded={isPhotoUploaded && isPaid}
      />
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
      {isPaid ? (
        <>
          <button 
            onClick={() => window.print()}
            disabled={!isPhotoUploaded}
            className="w-full sm:w-60 flex items-center justify-center space-x-3 bg-[#2ecc71] hover:bg-[#27ae60] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4.5 rounded-2xl text-[15px] font-black shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
          >
            <Printer size={20} strokeWidth={2.5} />
            <span>{isPhotoUploaded ? 'Print ID' : 'Waiting for Photo'}</span>
          </button>
          <button 
            onClick={() => alert('Downloading PDF...')}
            disabled={!isPhotoUploaded}
            className="w-full sm:w-60 flex items-center justify-center space-x-3 bg-[#1d76d2] hover:bg-[#1565c0] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4.5 rounded-2xl text-[15px] font-black shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
          >
            <Download size={20} strokeWidth={2.5} />
            <span>{isPhotoUploaded ? 'Download ID' : 'Waiting for Photo'}</span>
          </button>
        </>
      ) : (
        <div className="bg-[#eff6ff] border border-blue-100 p-5 rounded-2xl flex items-center space-x-4 max-w-md">
          <div className="bg-blue-500 p-2 rounded-full text-white">
            <CreditCard size={18} />
          </div>
          <p className="text-[12px] text-[#1d76d2] font-medium leading-tight">
            This is a watermarked preview. Please <span className="font-black uppercase">apply and pay</span> the application fee to download your official ID card.
          </p>
        </div>
      )}
    </div>
  </div>
);

const OtherServicesView = ({ hasPaid, onAction, navigate }: { hasPaid: boolean, onAction: (action: 'view') => void, navigate: any }) => (
  <div className="bg-white rounded-3xl lg:rounded-4xl p-8 lg:p-14 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
    <h2 className="text-xl font-bold text-[#1e293b] mb-8">ID Card</h2>
    <div className="space-y-6">
      <p className="text-[12px] lg:text-[13px] text-gray-400 leading-relaxed font-medium">
        Applicants are required to pay the prescribed ID card application fee through the university's online portal. The fee varies depending on the card type and may range between <span className="text-gray-600 font-bold">₦5,000</span> and <span className="text-gray-600 font-bold">₦10,000</span>. <span className="text-gray-600 font-bold">The card is valid for a period of 4 years.</span>
      </p>
      <p className="text-[12px] lg:text-[13px] text-gray-400 leading-relaxed font-medium">
        All payments must be made online, and a payment receipt will be generated automatically upon successful transaction. Your ID card will be processed and ready for pickup within 5-7 working days.
      </p>
      
      {/* Payment Status Message */}
      {!hasPaid && (
        <div className="bg-[#fef3c7] border border-[#fcd34d] p-4 rounded-lg">
          <p className="text-[12px] font-bold text-[#92400e]">
            💳 Payment Required: To view your ID card, you must complete payment first.
          </p>
        </div>
      )}
      
      <div className="flex justify-end items-center space-x-4 pt-4">
        <button 
          onClick={() => onAction('view')}
          disabled={!hasPaid}
          className="px-10 py-3 rounded-lg border border-gray-200 text-[#1e293b] text-[13px] font-bold hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
        >
          {hasPaid ? '👁️ View ID Card' : '🔒 Locked - Pay First'}
        </button>
        {!hasPaid && (
          <button 
            onClick={() => navigate('/payments/new?type=registration&purpose=idcard')}
            className="px-10 py-3 rounded-lg bg-[#22c55e] text-white text-[13px] font-bold hover:bg-green-600 transition-all shadow-md shadow-green-50"
          >
            Proceed to apply
          </button>
        )}
      </div>
    </div>
  </div>
);

const CoursesRegView: React.FC<CoursesRegViewProps> = ({
  levels,
  semesters,
  sessions,
  registrationData,
  studentProfile,
  isLoading,
}) => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<string>('');
  
  // New multi-select states
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCoursesInDropdown, setSelectedCoursesInDropdown] = useState<string[]>([]);
  const [previewedCourses, setPreviewedCourses] = useState<DepartmentCourse[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const [departmentCourses, setDepartmentCourses] = useState<DepartmentCourse[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isCartConfirmed, setIsCartConfirmed] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);

  // Fetch department courses on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingCourses(true);
      const courses = await getDepartmentCourses();
      setDepartmentCourses(courses);
      setIsLoadingCourses(false);
    };
    fetchData();
  }, []);

  // Fetch cart on mount to populate previewer
  useEffect(() => {
    const fetchCart = async () => {
      const cartItems = await getCourseCart();
      if (cartItems.length > 0) {
        // Convert cart items to DepartmentCourse format for previewer
        const cartCourses = cartItems.map(item => ({
          id: item.course.id,
          code: item.course.code,
          title: item.course.title,
          creditUnits: item.course.creditUnits,
        })) as any;
        setPreviewedCourses(cartCourses);
        setIsCartConfirmed(true); // Enable buttons if cart already has items
      }
    };
    fetchCart();
  }, []);

  // Set defaults from student profile when available
  useEffect(() => {
    if (studentProfile) {
      setSelectedLevel(studentProfile.level || studentProfile.Level?.code || '');
    }
  }, [studentProfile]);

  // Set current session as default
  useEffect(() => {
    if (sessions?.length > 0 && !selectedSession) {
      const activeSession = sessions.find(s => s.isActive);
      if (activeSession) {
        setSelectedSession(activeSession.id);
      }
    }
  }, [sessions, selectedSession]);

  // Filter courses based on search
  const filteredCourses = departmentCourses.filter(
    course => 
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCourse = (courseCode: string) => {
    setSelectedCoursesInDropdown(prev =>
      prev.includes(courseCode)
        ? prev.filter(code => code !== courseCode)
        : [...prev, courseCode]
    );
  };

  const handleAddCourses = () => {
    const coursesToAdd = departmentCourses.filter(course =>
      selectedCoursesInDropdown.includes(course.id) &&
      !previewedCourses.some(p => p.id === course.id)
    );
    
    setPreviewedCourses(prev => [...prev, ...coursesToAdd]);
    setSelectedCoursesInDropdown([]);
    setShowDropdown(false);
    setSearchQuery('');
  };

  const handleRemoveCourse = async (courseId: string) => {
    // Call API to remove from cart
    const result = await removeCourseFromCart(courseId);
    
    if (result.success) {
      // Remove from previewer on success
      setPreviewedCourses(prev => prev.filter(course => course.id !== courseId));
      
      // If no courses left, disable the buttons
      const remainingCourses = previewedCourses.filter(course => course.id !== courseId);
      if (remainingCourses.length === 0) {
        setIsCartConfirmed(false);
      }
    } else {
      // Show error message if removal failed
      setCartMessage({ type: 'error', text: result.message });
      setTimeout(() => setCartMessage(null), 7000);
    }
  };

  // Handle adding previewed courses to cart via API
  const handleConfirmCourses = async () => {
    if (previewedCourses.length === 0) return;
    
    setIsAddingToCart(true);
    setCartMessage(null);
    
    const courseIds = previewedCourses.map(course => course.id);
    const result = await addCourseToCart(courseIds);
    
    setIsAddingToCart(false);
    
    if (result.success) {
      setCartMessage({ type: 'success', text: result.message });
      setIsCartConfirmed(true);
      // Auto-dismiss success message after 7 seconds
      setTimeout(() => setCartMessage(null), 7000);
    } else {
      // Replace course IDs in error message with course names for better UX
      let errorMessage = result.message;
      
      // Find and replace any course ID with its name/code
      [...previewedCourses, ...departmentCourses].forEach(course => {
        if (errorMessage.includes(course.id)) {
          errorMessage = errorMessage.replace(
            course.id, 
            `"${course.code} - ${course.title}"`
          );
        }
      });
      
      setCartMessage({ type: 'error', text: errorMessage });
      // Clear previewer since API failed - courses weren't added to cart
      setPreviewedCourses([]);
      // Auto-dismiss error message after 7 seconds
      setTimeout(() => setCartMessage(null), 7000);
    }
  };

  const totalUnits = previewedCourses.reduce((sum, course) => sum + course.creditUnits, 0);
  const registeredCourses = registrationData?.courses || [];

  // Handle course registration
  const handleRegisterCourses = async () => {
    // Get levelId and sessionId from stored user profile
    const storedUser = getStoredUser();
    const levelId = storedUser?.profile?.levelId;
    const sessionId = storedUser?.profile?.sessionId;

    if (!levelId || !sessionId) {
      alert('Unable to retrieve your level or session information. Please log in again.');
      return;
    }

    // Get payment reference from localStorage (set after payment)
    const paymentRef = localStorage.getItem('pendingPaymentReference');
    if (!paymentRef) {
      alert('Payment reference not found. Please complete payment first.');
      return;
    }

    setIsRegistering(true);

    const registrationData = {
      paymentReference: paymentRef,
      levelId,
      sessionId,
      totalCredits: totalUnits,
      totalAmount: 5000,
    };

    const result = await bulkRegisterCourses(registrationData);
    setIsRegistering(false);

    if (result.success) {
      alert(`Success! ${result.message}`);
      setShowConfirmation(false);
      // Clear the payment reference after successful registration
      localStorage.removeItem('pendingPaymentReference');
      // Clear cart after successful registration
      setPreviewedCourses([]);
      setIsCartConfirmed(false);
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  // Handle payment initialization
  const handlePayRegistrationFee = async () => {
    const storedUser = getStoredUser();
    const sessionId = storedUser?.profile?.sessionId;

    if (!sessionId) {
      alert('Unable to retrieve your session information. Please log in again.');
      return;
    }

    const callbackUrl = import.meta.env.VITE_CALLBACK_URL|| 'http://localhost:3000/students/registration/courses';
    const amount = 5000;

    console.log('Callback URL from env:', import.meta.env.VITE_CALLBACK_URL);
    console.log('Final callback URL:', callbackUrl);

    const result = await initRegistrationFeePayment(sessionId, amount, callbackUrl);

    if (result.success && result.data) {
      // Store the payment reference for later use
      setPaymentReference(result.data.reference);
      localStorage.setItem('pendingPaymentReference', result.data.reference);
      
      // Redirect to Paystack
      window.location.href = result.data.authorizationUrl;
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  // Confirmation Modal
  if (showConfirmation) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-3xl lg:rounded-4xl w-full max-w-2xl p-6 lg:p-10 shadow-2xl animate-in zoom-in-95 duration-300">
          <h2 className="text-2xl font-black text-[#1e293b] mb-8">Confirm Course Registration</h2>

          {/* Courses List */}
          <div className="bg-[#f8fafc] rounded-[20px] p-6 mb-8 max-h-64 overflow-y-auto">
            <h3 className="text-[14px] font-bold text-[#1e293b] mb-4">Selected Courses ({previewedCourses.length})</h3>
            <div className="space-y-3">
              {previewedCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                  <div>
                    <p className="text-[12px] font-bold text-gray-400">{course.code}</p>
                    <p className="text-[13px] font-bold text-[#1e293b]">{course.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] font-bold text-gray-400">{course.creditUnits} units</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-3 mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-bold text-gray-400">Total Units:</p>
              <p className="text-[14px] font-bold text-[#1e293b]">{totalUnits} units</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowConfirmation(false)}
              className="flex-1 bg-white border border-gray-200 text-[#1e293b] px-6 py-3 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleRegisterCourses}
              disabled={isRegistering}
              className="flex-1 bg-[#22c55e] text-white px-6 py-3 rounded-lg text-[13px] font-bold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isRegistering && <Loader2 className="w-4 h-4 animate-spin" />}
              {isRegistering ? 'Registering...' : 'Confirm & Proceed to Register'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-10 border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Registration Form Column */}
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-[#1e293b]">Course Registration</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-500 text-sm">Loading...</span>
              </div>
            ) : (
              <div className="space-y-5">
                <FormRow label="Current Level">
                  <select 
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold text-gray-600 appearance-none focus:outline-none"
                  >
                    <option value="">Select Level</option>
                    {levels?.map((level) => (
                      <option key={level.id} value={level.code}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                </FormRow>

                <FormRow label="Semester">
                  <select 
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold text-gray-600 appearance-none focus:outline-none"
                  >
                    <option value="">Select Semester</option>
                    {semesters?.map((semester) => (
                      <option key={semester.id} value={semester.id}>
                        {semester.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                </FormRow>

                <FormRow label="Add Course">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder={isLoadingCourses ? "Loading courses..." : "Search Course Name or Code"}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={() => setShowDropdown(true)}
                      disabled={isLoadingCourses}
                      className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold text-[#1e293b] focus:outline-none placeholder:text-gray-300 cursor-pointer disabled:opacity-50" 
                    />
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
                    
                    {/* Dropdown Menu */}
                    {showDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-40 overflow-hidden">
                        {/* Scrollable course list */}
                        <div className="max-h-60 overflow-y-auto">
                          {filteredCourses.length > 0 ? (
                            <div className="p-2">
                              {filteredCourses.map(course => (
                                <label key={course.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                  <input 
                                    type="checkbox" 
                                    className={checkboxClasses}
                                    checked={selectedCoursesInDropdown.includes(course.id)}
                                    onChange={() => handleSelectCourse(course.id)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <div className="ml-3 flex-1">
                                    <p className="text-[12px] font-bold text-[#1e293b]">{course.code}</p>
                                    <p className="text-[11px] text-gray-400 truncate">{course.title}</p>
                                  </div>
                                  <span className="text-[11px] font-bold text-gray-400 ml-2">{course.creditUnits} units</span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <div className="p-6 text-center text-gray-400 text-[12px]">No courses found</div>
                          )}
                        </div>
                        
                        {/* Sticky footer buttons - always visible */}
                        <div className="border-t border-gray-100 p-3 flex justify-between items-center bg-gray-50 rounded-b-xl">
                          <span className="text-[11px] font-bold text-gray-400">
                            {selectedCoursesInDropdown.length} selected
                          </span>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setShowDropdown(false);
                                setSelectedCoursesInDropdown([]);
                                setSearchQuery('');
                              }}
                              className="px-4 py-1.5 text-[11px] font-bold text-gray-400 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={handleAddCourses}
                              disabled={selectedCoursesInDropdown.length === 0}
                              className="px-4 py-1.5 text-[11px] font-bold text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 rounded-lg transition-colors"
                            >
                              Add Selected
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay to close dropdown */}
                    {showDropdown && (
                      <div 
                        className="fixed inset-0 z-30"
                        onClick={() => setShowDropdown(false)}
                      />
                    )}
                  </div>
                </FormRow>

                <FormRow label="Carry Over">
                  <select className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold text-gray-400 appearance-none focus:outline-none">
                    <option>Yes/No</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                </FormRow>
              </div>
            )}

            <div className="flex space-x-3">
              <button 
                onClick={handleConfirmCourses}
                disabled={previewedCourses.length === 0 || isAddingToCart}
                className="bg-[#3b82f6] text-white px-6 py-2.5 rounded-lg text-[11px] font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isAddingToCart && <Loader2 className="w-4 h-4 animate-spin" />}
                {isAddingToCart ? 'Adding...' : 'Confirm Courses'}
              </button>
              <button 
                onClick={handlePayRegistrationFee}
                disabled={!isCartConfirmed}
                className="bg-[#f97316] text-white px-6 py-2.5 rounded-lg text-[11px] font-bold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Pay Registration Fee
              </button>
            </div>

            {/* Cart Message */}
            {cartMessage && (
              <div className={`mt-2 p-3 rounded-lg text-[12px] font-medium ${
                cartMessage.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {cartMessage.text}
              </div>
            )}

            <div className="flex space-x-4 pt-6">
              <button 
                onClick={() => setShowConfirmation(true)}
                disabled={!isCartConfirmed}
                className="bg-[#22c55e] text-white px-10 py-3 rounded-lg text-[12px] font-bold hover:bg-green-600 disabled:bg-gray-300 transition-colors shadow-sm"
              >
                Register Courses
              </button>
              <button className="bg-white border border-gray-200 text-[#1e293b] px-10 py-3 rounded-lg text-xs font-bold hover:bg-gray-50 transition-all min-w-30">Cancel</button>
            </div>
          </div>

          {/* Previewer Column */}
          <div className="bg-[#fcfdfe] rounded-3xl p-6 lg:p-8 border border-gray-100 flex flex-col min-h-100">
            <h2 className="text-sm lg:text-base font-bold text-[#1e293b] mb-2">Courses Previewer</h2>
            <p className="text-[12px] text-gray-400 mb-6">{previewedCourses.length} course(s) selected</p>
            <div className="overflow-x-auto flex-1">
              {previewedCourses.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="px-3 py-3 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Code</th>
                      <th className="px-3 py-3 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Course Title</th>
                      <th className="px-3 py-3 font-bold text-gray-400 uppercase text-[10px] tracking-wider text-right">Unit</th>
                      <th className="px-3 py-3 font-bold text-gray-400 uppercase text-[10px] tracking-wider text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {previewedCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-white transition-colors">
                        <td className="px-3 py-3.5 font-bold text-gray-400 text-[11px]">{course.code}</td>
                        <td className="px-3 py-3.5 font-bold text-[#1e293b] text-xs truncate max-w-45">{course.title}</td>
                        <td className="px-3 py-3.5 font-bold text-gray-400 text-[11px] text-right">{course.creditUnits}</td>
                        <td className="px-3 py-3.5 text-center">
                          <button 
                            onClick={() => handleRemoveCourse(course.id)}
                            className="text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300 text-[12px] font-bold">
                  Select courses to preview
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table: Registered Courses */}
      <div className="bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-10 border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-base lg:text-lg font-bold text-[#1e293b]">Registered Courses</h2>
            {registrationData && (
              <p className="text-xs text-gray-400 mt-1">
                Total Units: {registrationData.totalUnits} / {registrationData.maxAllowedUnits}
              </p>
            )}
          </div>
          <div className="relative w-full sm:w-auto">
            <select 
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full sm:w-auto bg-[#f8fafc] border border-gray-100 text-[10px] font-bold rounded-lg pl-3 pr-10 py-2.5 text-gray-400 uppercase appearance-none cursor-pointer"
            >
              <option value="">Select Session</option>
              {sessions?.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.name} {session.isActive ? '(Current)' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
          </div>
        </div>
        <div className="overflow-x-auto -mx-6 lg:mx-0 px-6 lg:px-0">
          <table className="w-full text-left min-w-225">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-4 py-4 w-12 text-center">
                  <input type="checkbox" className={checkboxClasses} />
                </th>
                <th className="px-4 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Code</th>
                <th className="px-4 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Course Title</th>
                <th className="px-4 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Type</th>
                <th className="px-4 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Unit</th>
                <th className="px-4 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Course Lecturer(s)</th>
                <th className="px-4 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400 mx-auto" />
                  </td>
                </tr>
              ) : registeredCourses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400 text-sm">
                    No registered courses found
                  </td>
                </tr>
              ) : (
                registeredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 text-center">
                      <input type="checkbox" className={checkboxClasses} />
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-400 text-[11px]">{course.code}</td>
                    <td className="px-4 py-4 font-bold text-[#1e293b] text-[11px]">{course.title}</td>
                    <td className="px-4 py-4 text-gray-400 font-medium text-[11px]">{course.type}</td>
                    <td className="px-4 py-4 text-gray-400 font-bold text-[11px]">{course.creditUnits}</td>
                    <td className="px-4 py-4 text-gray-400 font-medium text-[11px]">{course.lecturer}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        course.status === 'registered' 
                          ? 'bg-[#f0fdf4] text-[#22c55e]' 
                          : course.status === 'pending'
                          ? 'bg-yellow-50 text-yellow-600'
                          : 'bg-red-50 text-red-500'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for API data
  const [levels, setLevels] = useState<Level[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for ID Card application in Other tab
  const [isViewingID, setIsViewingID] = useState(false);
  const [hasPaidID, setHasPaidID] = useState(false);
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);
  const [studentPhoto, setStudentPhoto] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [levelsData, semestersData, sessionsData, profileData, registrationsData] = await Promise.all([
          getLevels(),
          getSemesters(),
          getSessions(),
          getStudentProfile(),
          getRegistrations(),
        ]);
        
        // Debug logging
        console.log('Fetched levels:', levelsData);
        console.log('Fetched semesters:', semestersData);
        console.log('Fetched sessions:', sessionsData);
        
        setLevels(levelsData);
        setSemesters(semestersData);
        setSessions(sessionsData);
        setStudentProfile(profileData);
        setRegistrationData(registrationsData);
      } catch (err) {
        console.error('Error fetching registration data:', err);
        setError('Failed to load registration data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check for ID Card payment success from localStorage
  useEffect(() => {
    const paymentSuccess = localStorage.getItem('idCardPaymentSuccess');
    if (paymentSuccess === 'true') {
      setHasPaidID(true);
      // Clear the flag so it doesn't auto-enable on page reload
      localStorage.removeItem('idCardPaymentSuccess');
    }
  }, []);

  const activeSubTab = (() => {
    if (location.pathname.includes('/registration/transcript')) return 'transcript';
    if (location.pathname.includes('/registration/other')) return 'other';
    return 'courses';
  })();

  const handleOtherAction = (action: 'view') => {
    if (action === 'view') {
      setIsViewingID(true);
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-400 mx-auto space-y-4 lg:space-y-6">
      <div className="flex justify-center overflow-x-auto -mx-4 px-4 py-1">
        <div className="bg-white p-1 rounded-[20px] border border-gray-100 flex shadow-sm shrink-0">
          {(['courses', 'transcript', 'other'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => navigate(`/registration/${tab}`)}
              className={`px-8 lg:px-12 py-3 rounded-2xl text-[12px] lg:text-sm font-bold transition-all duration-300 ${
                activeSubTab === tab 
                  ? 'bg-[#3b82f6] text-white shadow-md' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="min-h-150">
        {activeSubTab === 'courses' && (
          <CoursesRegView 
            levels={levels}
            semesters={semesters}
            sessions={sessions}
            registrationData={registrationData}
            studentProfile={studentProfile}
            isLoading={isLoading}
          />
        )}
        {activeSubTab === 'transcript' && <TranscriptRegView />}
        {activeSubTab === 'other' && (
          isViewingID ? (
            <IDCardView 
              isPaid={hasPaidID} 
              isPhotoUploaded={isPhotoUploaded}
              onBack={() => setIsViewingID(false)}
              studentProfile={studentProfile}
              studentPhoto={studentPhoto}
            />
          ) : (
            <OtherServicesView hasPaid={hasPaidID} onAction={handleOtherAction} navigate={navigate} />
          )
        )}
      </div>
    </div>
  );
};

export default Registration;
