
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  getLevels,
  getSemesters,
  getSessions,
  getStudentProfile,
  getRegistrations,
  addCourseToCart,
  confirmCourseRegistration,
  removeCourseFromCart,
  getDepartmentCourses,
  validateCartCourses,
  getCourseCart,
  CartItem,
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
  <div className="bg-white rounded-[24px] lg:rounded-[32px] p-6 lg:p-12 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
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
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [carryOver, setCarryOver] = useState<string>('');
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isRemovingCourse, setIsRemovingCourse] = useState(false);
  const [cartMessage, setCartMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerMessage, setRegisterMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validateMessage, setValidateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [departmentCourses, setDepartmentCourses] = useState<DepartmentCourse[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [cartCourses, setCartCourses] = useState<CartItem[]>([]);

  // Fetch department courses and cart on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingCourses(true);
      const [courses, cartItems] = await Promise.all([
        getDepartmentCourses(),
        getCourseCart(),
      ]);
      setDepartmentCourses(courses);
      setCartCourses(cartItems);
      setIsLoadingCourses(false);
    };
    fetchData();
  }, []);

  // Set defaults from student profile when available
  useEffect(() => {
    if (studentProfile) {
      // Use the level field from profile (e.g., "500")
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

  // Auto-dismiss messages after 7 seconds
  useEffect(() => {
    if (cartMessage) {
      const timer = setTimeout(() => setCartMessage(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [cartMessage]);

  useEffect(() => {
    if (validateMessage) {
      const timer = setTimeout(() => setValidateMessage(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [validateMessage]);

  useEffect(() => {
    if (registerMessage) {
      const timer = setTimeout(() => setRegisterMessage(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [registerMessage]);


  const registeredCourses = registrationData?.courses || [];

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* Registration Form */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-[24px] lg:rounded-[32px] p-6 lg:p-10 border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-lg lg:text-xl font-bold text-[#1e293b] mb-6">Course Registration</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-500 text-sm">Loading...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Level Select */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2 sm:gap-4">
                <label className="text-[13px] font-bold text-[#1e293b]">Current Level</label>
                <div className="sm:col-span-2 relative">
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
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                </div>
              </div>

              {/* Semester Select */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2 sm:gap-4">
                <label className="text-[13px] font-bold text-[#1e293b]">Semester</label>
                <div className="sm:col-span-2 relative">
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
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                </div>
              </div>
              {/* Divider */}
              <div className="border-t border-gray-100 my-2"></div>

              {/* Add Course */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2 sm:gap-4">
                <label className="text-[13px] font-bold text-[#1e293b]">Add Course</label>
                <div className="sm:col-span-2 relative">
                  <select 
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[13px] text-gray-800 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-100"
                    disabled={isLoadingCourses}
                  >
                    <option value="">{isLoadingCourses ? 'Loading courses...' : 'Select a course'}</option>
                    {departmentCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.title} ({course.creditUnits} units)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                </div>
              </div>

              {/* Carry Over */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2 sm:gap-4">
                <label className="text-[13px] font-bold text-[#1e293b]">Carry Over</label>
                <div className="sm:col-span-2 relative">
                  <select 
                    value={carryOver}
                    onChange={(e) => setCarryOver(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[13px] text-gray-800 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-100"
                  >
                    <option value="">Yes/No</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                </div>
              </div>

              {/* Add Course / Remove Course Buttons */}
              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={async () => {
                    if (!selectedCourse) {
                      setCartMessage({ type: 'error', text: 'Please select a course' });
                      return;
                    }
                    setIsAddingCourse(true);
                    setCartMessage(null);
                    const result = await addCourseToCart(selectedCourse);
                    setCartMessage({ type: result.success ? 'success' : 'error', text: result.message });
                    if (result.success) {
                      // Refetch cart to get the updated list
                      const updatedCart = await getCourseCart();
                      setCartCourses(updatedCart);
                      setSelectedCourse('');
                    }
                    setIsAddingCourse(false);
                  }}
                  disabled={isAddingCourse}
                  className="px-5 py-2 bg-white border border-gray-200 rounded-lg text-[12px] font-bold text-[#1e293b] hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {isAddingCourse ? 'Adding...' : 'Add Course'}
                </button>
                <button 
                  onClick={async () => {
                    if (!selectedCourse) {
                      setCartMessage({ type: 'error', text: 'Please select a course to remove' });
                      return;
                    }
                    setIsRemovingCourse(true);
                    setCartMessage(null);
                    const result = await removeCourseFromCart(selectedCourse);
                    setCartMessage({ type: result.success ? 'success' : 'error', text: result.message });
                    if (result.success) {
                      // Refetch cart to get the updated list
                      const updatedCart = await getCourseCart();
                      setCartCourses(updatedCart);
                      setSelectedCourse('');
                    }
                    setIsRemovingCourse(false);
                  }}
                  disabled={isRemovingCourse}
                  className="px-5 py-2 bg-gray-100 border border-gray-200 rounded-lg text-[12px] font-bold text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {isRemovingCourse ? 'Removing...' : 'Remove Course'}
                </button>
              </div>

              {/* Cart Message */}
              {cartMessage && (
                <div className={`mt-3 p-3 rounded-lg text-[12px] font-medium ${cartMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {cartMessage.text}
                </div>
              )}
            </div>
          )}

          {/* Main Action Buttons */}
          <div className="flex flex-col space-y-3 pt-6 mt-4 border-t border-gray-100">
            <div className="flex space-x-3">
              <button 
                onClick={async () => {
                  setIsValidating(true);
                  setValidateMessage(null);
                  const result = await validateCartCourses();
                  setValidateMessage({ type: result.success ? 'success' : 'error', text: result.message });
                  setIsValidating(false);
                }}
                disabled={isValidating}
                className="px-6 py-3 bg-gray-100 border border-gray-200 text-gray-500 rounded-lg text-[12px] font-bold hover:bg-gray-50 transition-colors"
              >
                {isValidating ? 'Validating...' : 'Validate Courses'}
              </button>
              <button 
                onClick={async () => {
                  if (!selectedSemester) {
                    setRegisterMessage({ type: 'error', text: 'Please select a semester' });
                    return;
                  }
                  setIsRegistering(true);
                  setRegisterMessage(null);
                  const result = await confirmCourseRegistration(selectedSemester);
                  setRegisterMessage({ type: result.success ? 'success' : 'error', text: result.message });
                  setIsRegistering(false);
                }}
                disabled={isRegistering}
                className="px-6 py-3 bg-[#22c55e] text-white rounded-lg text-[12px] font-bold hover:bg-green-600 transition-colors shadow-sm disabled:opacity-50"
              >
                {isRegistering ? 'Registering...' : 'Register Courses'}
              </button>
              <button 
                onClick={() => {
                  if (!selectedSemester) {
                    setRegisterMessage({ type: 'error', text: 'Please select a semester' });
                    return;
                  }
                  navigate(`/payments/new?type=registration&semesterId=${selectedSemester}`);
                }}
                className="px-6 py-3 bg-[#0052EA] text-white rounded-lg text-[12px] font-bold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Pay Now
              </button>
            </div>
            {validateMessage && (
              <div className={`p-3 rounded-lg text-[12px] font-medium ${validateMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {validateMessage.text}
              </div>
            )}
            {registerMessage && (
              <div className={`p-3 rounded-lg text-[12px] font-medium ${registerMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {registerMessage.text}
              </div>
            )}
          </div>
        </div>

        {/* Courses Previewer Table */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-[24px] lg:rounded-[32px] p-6 lg:p-8 border border-gray-100 shadow-sm flex flex-col min-h-[400px]">
          <h2 className="text-base font-bold text-[#1e293b] mb-6">Courses Previewer</h2>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-4 py-3 w-8">
                    <input type="checkbox" className={checkboxClasses} />
                  </th>
                  <th className="px-4 py-3 font-bold text-gray-400 uppercase text-[10px]">Code</th>
                  <th className="px-4 py-3 font-bold text-gray-400 uppercase text-[10px]">Course Title</th>
                  <th className="px-4 py-3 font-bold text-gray-400 uppercase text-[10px] text-right">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400 mx-auto" />
                    </td>
                  </tr>
                ) : cartCourses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400 text-sm">
                      No courses in cart. Select a course and click "Add Course".
                    </td>
                  </tr>
                ) : (
                  cartCourses.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <input type="checkbox" className={checkboxClasses} defaultChecked />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-500 text-[11px]">{item.course.code}</td>
                      <td className="px-4 py-3 font-medium text-[#1e293b] text-[11px]">{item.course.title}</td>
                      <td className="px-4 py-3 font-bold text-gray-500 text-[11px] text-right">{item.course.creditUnits}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Table: Registered Courses */}
      <div className="bg-white rounded-[24px] lg:rounded-[32px] p-6 lg:p-8 border border-gray-100 shadow-sm">
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
              className="w-full bg-[#f8fafc] border border-gray-100 text-[10px] font-bold rounded-lg pl-3 pr-8 py-2 text-gray-500 uppercase appearance-none cursor-pointer"
            >
              <option value="">Select Session</option>
              {sessions?.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.name} {session.isActive ? '(Current)' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
          </div>
        </div>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-4 py-3 w-8">
                  <input type="checkbox" className={checkboxClasses} />
                </th>
                <th className="px-4 py-3 font-bold text-gray-400 uppercase text-[10px]">Code</th>
                <th className="px-4 py-3 font-bold text-gray-400 uppercase text-[10px]">Course Title</th>
                <th className="px-4 py-3 font-bold text-gray-400 uppercase text-[10px]">Type</th>
                <th className="px-4 py-3 font-bold text-gray-400 uppercase text-[10px]">Unit</th>
                <th className="px-4 py-3 font-bold text-gray-400 uppercase text-[10px]">Lecturer(s)</th>
                <th className="px-4 py-3 font-bold text-gray-400 uppercase text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
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
                    <td className="px-4 py-4">
                      <input type="checkbox" className={checkboxClasses} />
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-400 text-[11px]">{course.code}</td>
                    <td className="px-4 py-4 font-bold text-[#1e293b] text-[11px]">{course.title}</td>
                    <td className="px-4 py-4 text-gray-500 font-medium text-[11px]">{course.type}</td>
                    <td className="px-4 py-4 text-gray-500 font-bold text-[11px]">{course.creditUnits}</td>
                    <td className="px-4 py-4 text-gray-500 font-medium text-[11px]">{course.lecturer}</td>
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

  const activeSubTab = (() => {
    if (location.pathname.includes('/registration/transcript')) return 'transcript';
    if (location.pathname.includes('/registration/other')) return 'other';
    return 'courses';
  })();

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-8 lg:space-y-10">
      <div className="flex justify-center overflow-x-auto -mx-4 px-4 py-2">
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

      <div className="min-h-[600px]">
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
        {activeSubTab === 'other' && <div className="text-center py-20 text-gray-300 font-bold">Other services coming soon.</div>}
      </div>
    </div>
  );
};

export default Registration;
