import React, { useState } from 'react';
import { User, Eye, EyeOff, Loader2, AlertCircle, Phone } from 'lucide-react';
import AuthBackground from '../components/AuthBackground';
import AuthCard from '../components/AuthCard';
import authService from '../../../services/authService';
import { getAssetPath } from '../../../utils/assetPath';

interface ActivateAccountStepProps {
  onNext: () => void;
  onForgotPassword: () => void;
}

const ActivateAccountStep: React.FC<ActivateAccountStepProps> = ({ onNext, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [studentInfo, setStudentInfo] = useState<any>(null);

  React.useEffect(() => {
    const user = authService.getStoredUser();
    if (user) {
      setStudentInfo(user);
      if (user.email) setEmail(user.email);
       // Attempt to pre-fill phone if available, often it might not be in the initial verify response
       // depending on the backend response structure.
    }
  }, []);

  const handleActivate = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.activateAccount({ email, phone, password });
      onNext();
    } catch (err: any) {
      setError(err.message || 'Account activation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to split full name
  const getNames = (fullName: string) => {
    const parts = fullName ? fullName.split(' ') : [];
    if (parts.length === 0) return { firstName: '', otherName: '' };
    return {
      firstName: parts[0],
      otherName: parts.slice(1).join(' ')
    };
  };

  const { firstName, otherName } = getNames(studentInfo?.fullName || '');

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative font-['Inter'] py-10">
      <AuthBackground />
      <div className="relative z-10 w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 mx-4">
        <div className="p-8 md:p-12">
            <div className="flex flex-col items-center mb-8">
                {/* Logo placeholder - replace with actual logo if available in assets, assuming consistent with other pages */}
                 <img src={getAssetPath('assets/uphcscLG.png')} alt="University Logo" className="h-16 mb-4 object-contain" /> 
            </div>

          {/* Student Information Section */}
          <div className="mb-10">
            <h2 className="text-[#1d76d2] font-bold text-lg mb-6">Student Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1e293b]">Reg No.</label>
                <div className="w-full bg-gray-200/50 border border-gray-300 rounded-md py-3 px-4 text-sm font-medium text-gray-600 uppercase">
                  {studentInfo?.profile?.studentId || 'N/A'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1e293b]">Mat No.</label>
                 <div className="w-full bg-gray-200/50 border border-gray-300 rounded-md py-3 px-4 text-sm font-medium text-gray-600 uppercase">
                  {studentInfo?.profile?.studentId || 'N/A'}
                </div>
              </div>

               <div className="space-y-2">
                <label className="text-sm font-medium text-[#1e293b]">First Name</label>
                <div className="w-full bg-gray-200/50 border border-gray-300 rounded-md py-3 px-4 text-sm font-medium text-gray-600 uppercase">
                  {firstName || 'N/A'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1e293b]">Other Name</label>
                 <div className="w-full bg-gray-200/50 border border-gray-300 rounded-md py-3 px-4 text-sm font-medium text-gray-600 uppercase">
                  {otherName || 'N/A'}
                </div>
              </div>

               <div className="space-y-2">
                <label className="text-sm font-medium text-[#1e293b]">Sex</label>
                <div className="w-full bg-gray-200/50 border border-gray-300 rounded-md py-3 px-4 text-sm font-medium text-gray-600 uppercase">
                  {studentInfo?.sex || 'N/A'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1e293b]">Admission Mode</label>
                 <div className="w-full bg-gray-200/50 border border-gray-300 rounded-md py-3 px-4 text-sm font-medium text-gray-600 uppercase">
                  {studentInfo?.admissionMode || 'UTME'}
                </div>
              </div>

               <div className="space-y-2">
                <label className="text-sm font-medium text-[#1e293b]">Entry Qualification</label>
                <div className="w-full bg-gray-200/50 border border-gray-300 rounded-md py-3 px-4 text-sm font-medium text-gray-600 uppercase">
                  {studentInfo?.entryQualification || 'Nil'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1e293b]">Faculty Name</label>
                 <div className="w-full bg-gray-200/50 border border-gray-300 rounded-md py-3 px-4 text-sm font-medium text-gray-600 uppercase">
                  COMPUTING
                </div>
              </div>

               <div className="space-y-2">
                <label className="text-sm font-medium text-[#1e293b]">Degree Course</label>
                <div className="w-full bg-gray-200/50 border border-gray-300 rounded-md py-3 px-4 text-sm font-medium text-gray-600 uppercase">
                   COMPUTER SCIENCE
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1e293b]">Department Name</label>
                 <div className="w-full bg-gray-200/50 border border-gray-300 rounded-md py-3 px-4 text-sm font-medium text-gray-600 uppercase">
                  COMPUTER SCIENCE
                </div>
              </div>

               <div className="space-y-2">
                <label className="text-sm font-medium text-[#1e293b]">Degree Awarded</label>
                <div className="w-full bg-gray-200/50 border border-gray-300 rounded-md py-3 px-4 text-sm font-medium text-gray-600 uppercase">
                  B.SC
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1e293b]">Course Duration</label>
                 <div className="w-full bg-gray-200/50 border border-gray-300 rounded-md py-3 px-4 text-sm font-medium text-gray-600 uppercase">
                  4
                </div>
              </div>
            </div>
          </div>
        
          <div className="w-full h-px bg-gray-200 my-8"></div>

          {/* Form Section */}
          <div>
            <h2 className="text-[#1d76d2] font-bold text-lg mb-6">Input the following</h2>
            
             {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={20} className="shrink-0" />
                    <p className="text-[13px] font-bold">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1e293b]">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError('');
                        }}
                        placeholder="Enter email address"
                        className="w-full bg-white border border-gray-300 rounded-md py-3 px-4 text-sm font-medium text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1d76d2] focus:border-transparent transition-all placeholder:text-gray-400"
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1e293b]">Phone Number</label>
                    <input
                        type="tel"
                        value={phone}
                         onChange={(e) => {
                            setPhone(e.target.value);
                            if (error) setError('');
                        }}
                        placeholder="Enter phone number"
                        className="w-full bg-white border border-gray-300 rounded-md py-3 px-4 text-sm font-medium text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1d76d2] focus:border-transparent transition-all placeholder:text-gray-400"
                        disabled={isLoading}
                    />
                </div>

                 <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1e293b]">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                             value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="Enter password"
                            className="w-full bg-white border border-gray-300 rounded-md py-3 px-4 text-sm font-medium text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1d76d2] focus:border-transparent transition-all placeholder:text-gray-400"
                            disabled={isLoading}
                        />
                         <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                            type="button"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1e293b]">Re-enter Password</label>
                     <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                             value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="Re-enter password"
                            className="w-full bg-white border border-gray-300 rounded-md py-3 px-4 text-sm font-medium text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1d76d2] focus:border-transparent transition-all placeholder:text-gray-400"
                           disabled={isLoading}
                           onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
                        />
                         <button
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                            type="button"
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            <button
                onClick={handleActivate}
                disabled={isLoading}
                 className="w-full bg-[#1d76d2] hover:bg-[#1565c0] disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-4 rounded-xl text-[16px] font-black shadow-lg shadow-blue-200/50 transition-all flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Activating...</span>
                    </>
                ) : (
                    'Activate Account'
                )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivateAccountStep;
