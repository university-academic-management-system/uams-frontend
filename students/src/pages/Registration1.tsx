
import React, { useState } from 'react';
import { Search, ChevronDown, CreditCard, Landmark, Repeat, Hash, HelpCircle } from 'lucide-react';

const checkboxClasses = "appearance-none w-4 h-4 bg-white border border-gray-300 rounded checked:bg-blue-600 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer transition-all bg-center bg-no-repeat checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22white%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M16.707%205.293a1%201%200%20010%201.414l-8%208a1%201%200%2001-1.414%200l-4-4a1%201%200%20011.414-1.414L8%2012.586l7.293-7.293a1%201%200%20011.414%200z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')]";

const StripeLogo = () => (
  <div className="flex flex-col space-y-1 w-10">
    <div className="h-2 w-full bg-[#0ea5e9] rounded-full"></div>
    <div className="h-2 w-full bg-[#0ea5e9] rounded-full"></div>
    <div className="h-2 w-[90%] bg-[#0ea5e9] rounded-full"></div>
    <div className="h-2 w-[55%] bg-[#0ea5e9] rounded-full"></div>
  </div>
);

const FormRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="grid grid-cols-12 items-center gap-4">
    <label className="col-span-12 sm:col-span-3 text-[13px] font-bold text-[#1e293b]">{label}</label>
    <div className="col-span-12 sm:col-span-9 relative">
      {children}
    </div>
  </div>
);

const PaymentView = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="bg-white rounded-[24px] lg:rounded-[32px] p-6 lg:p-14 border border-gray-100 shadow-sm animate-in zoom-in-95 duration-300 max-w-5xl mx-auto">
      <div className="mb-10 lg:mb-14">
        <h2 className="text-2xl font-black text-[#1e293b]">Make Payment</h2>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">Purpose</p>
          <p className="text-[15px] font-black text-[#1e293b]">Course Registration</p>
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">Transaction ID:</p>
          <p className="text-[15px] font-black text-[#1e293b]">06c1774d-46ad....90ae</p>
        </div>
        <div className="space-y-1 text-right md:text-right">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">Amount:</p>
          <p className="text-3xl font-black text-[#3b82f6]">NGN 5000</p>
        </div>
      </div>

      <div className="grid grid-cols-12 border border-gray-50 rounded-[20px] overflow-hidden min-h-[500px] shadow-sm">
        {/* Payment Methods Sidebar */}
        <div className="col-span-12 md:col-span-4 bg-[#f8f9fb] p-8 border-r border-gray-50">
          <h3 className="text-[13px] font-black text-gray-400 mb-10 tracking-wider">PAY WITH</h3>
          <nav className="space-y-1">
            <button className="w-full flex items-center justify-between group p-4 rounded-xl bg-white/50 border border-transparent hover:border-blue-100 transition-all">
              <div className="flex items-center space-x-3 text-[#22c55e]">
                <CreditCard size={18} strokeWidth={2.5} />
                <span className="text-[14px] font-black">Card</span>
              </div>
              <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-[6px] border-l-[#22c55e]"></div>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 text-gray-400 font-bold hover:text-gray-600 transition-colors">
              <Repeat size={18} strokeWidth={2.5} />
              <span className="text-[14px]">Transfer</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 text-gray-400 font-bold hover:text-gray-600 transition-colors">
              <Landmark size={18} strokeWidth={2.5} />
              <span className="text-[14px]">Bank</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 text-gray-400 font-bold hover:text-gray-600 transition-colors">
              <Hash size={18} strokeWidth={2.5} />
              <span className="text-[14px]">USSD</span>
            </button>
          </nav>
        </div>

        {/* Card Entry Form */}
        <div className="col-span-12 md:col-span-8 bg-white p-8 lg:p-12 flex flex-col">
          <div className="flex justify-between items-center mb-12">
            <StripeLogo />
            <p className="text-[12px] font-bold text-gray-400">Pay <span className="text-[#22c55e]">NGN 5000</span></p>
          </div>

          <div className="text-center mb-10">
            <h4 className="text-[15px] font-black text-gray-600">Enter your card details to pay</h4>
          </div>

          <div className="space-y-8 flex-1">
            <div className="border-b border-gray-100 pb-3">
              <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest block mb-1">Card Number</label>
              <input 
                type="text" 
                placeholder="0000 0000 0000 0000" 
                className="w-full text-lg font-bold text-[#1e293b] focus:outline-none placeholder:text-gray-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="border-b border-gray-100 pb-3">
                <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest block mb-1">Card Expiry</label>
                <input 
                  type="text" 
                  placeholder="MM / YY" 
                  className="w-full text-lg font-bold text-[#1e293b] focus:outline-none placeholder:text-gray-200"
                />
              </div>
              <div className="border-b border-gray-100 pb-3 relative">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">CVV</label>
                  <button className="text-[10px] font-black text-gray-300 hover:text-blue-500">HELP</button>
                </div>
                <input 
                  type="text" 
                  placeholder="123" 
                  className="w-full text-lg font-bold text-[#1e293b] focus:outline-none placeholder:text-gray-200"
                />
              </div>
            </div>
          </div>

          <div className="mt-12">
            <button 
              onClick={onBack}
              className="w-full bg-[#76c893] hover:bg-[#68b383] text-white py-5 rounded-2xl text-[16px] font-black shadow-lg shadow-green-100 transition-all transform active:scale-[0.98]"
            >
              Pay NGN 5000
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button onClick={onBack} className="text-[12px] font-bold text-gray-400 hover:text-gray-600">Cancel Payment</button>
      </div>
    </div>
  );
};

const TranscriptRegView = () => (
  <div className="bg-white rounded-[24px] lg:rounded-[32px] p-6 lg:p-12 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h2 className="text-xl font-bold text-[#1e293b] mb-8 lg:mb-10">Transcript Registration</h2>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
      <div className="flex flex-col space-y-2">
        <label className="text-[13px] font-medium text-gray-500">Name of receiving institution or organization</label>
        <input type="text" placeholder="University of Port..." className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[13px] text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-blue-100" />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-[13px] font-medium text-gray-500">Mode of Transcript Delivery</label>
        <div className="relative">
          <select className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[13px] text-gray-400 appearance-none focus:outline-none">
            <option>Select mode of delivery</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-[13px] font-medium text-gray-500">Recipient address</label>
        <input type="text" placeholder="Enter address" className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[13px] text-[#1e293b] focus:outline-none" />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-[13px] font-medium text-gray-500">Recipient address</label>
        <input type="text" placeholder="Enter address" className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[13px] text-[#1e293b] focus:outline-none" />
      </div>
      <div className="lg:col-span-2 flex flex-col space-y-2">
        <label className="text-[13px] font-medium text-gray-500">Contact email/phone of recipient (if requested)</label>
        <input type="text" placeholder="Input contact information" className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[13px] text-[#1e293b] focus:outline-none" />
      </div>
    </div>

    <div className="mt-8 text-[12px] text-gray-400 leading-relaxed font-medium">
      <p>Applicants are required to pay the prescribed transcript processing fee through the university's online portal. The fee varies depending on the destination and mode of delivery and may range between <span className="font-bold text-gray-600">₦5,000</span> and <span className="font-bold text-gray-600">₦30,000</span>. <span className="font-bold text-gray-600">Additional courier or postage charges may apply for hard-copy deliveries.</span></p>
      <p className="mt-2">All payments must be made online, and a payment receipt will be generated automatically upon successful transaction.</p>
    </div>

    <div className="mt-10 lg:mt-12 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
      <button className="bg-[#22c55e] hover:bg-green-600 text-white px-8 py-3 rounded-lg text-[13px] font-bold transition-all shadow-md shadow-green-100">Proceed to make payment</button>
      <button className="bg-white border border-gray-200 text-gray-500 px-8 py-3 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-all">Cancel</button>
    </div>
  </div>
);

const CoursesRegView = ({ onShowPayment }: { onShowPayment: () => void }) => {
  // All available courses
  const allAvailableCourses = [
    { code: 'CSC101.1', title: 'Computer Science Introduction', unit: 3 },
    { code: 'CSC102.1', title: 'Programming Fundamentals', unit: 3 },
    { code: 'CSC103.1', title: 'Data Structures', unit: 3 },
    { code: 'CSC104.1', title: 'Algorithms', unit: 4 },
    { code: 'GES100.1', title: 'Communication in English Language', unit: 2 },
    { code: 'GES101.1', title: 'Human Philosophy', unit: 3 },
    { code: 'GES102.1', title: 'African History', unit: 2 },
    { code: 'MTH110.1', title: 'Algebra and Trigonometry', unit: 3 },
    { code: 'MTH120.1', title: 'Calculus', unit: 4 },
    { code: 'MTH210.1', title: 'Advanced Calculus', unit: 4 },
    { code: 'PHY101.1', title: 'Physics I', unit: 3 },
    { code: 'PHY102.1', title: 'Physics II', unit: 3 },
    { code: 'CHM101.1', title: 'General Chemistry', unit: 3 },
    { code: 'BIO101.1', title: 'General Biology', unit: 3 },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCoursesInDropdown, setSelectedCoursesInDropdown] = useState<string[]>([]);
  const [previewedCourses, setPreviewedCourses] = useState<typeof allAvailableCourses>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const filteredCourses = allAvailableCourses.filter(
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
    const coursesToAdd = allAvailableCourses.filter(course =>
      selectedCoursesInDropdown.includes(course.code) &&
      !previewedCourses.some(p => p.code === course.code)
    );
    
    setPreviewedCourses(prev => [...prev, ...coursesToAdd]);
    setSelectedCoursesInDropdown([]);
    setShowDropdown(false);
    setSearchQuery('');
  };

  const handleRemoveCourse = (courseCode: string) => {
    setPreviewedCourses(prev => prev.filter(course => course.code !== courseCode));
  };

  const totalUnits = previewedCourses.reduce((sum, course) => sum + course.unit, 0);
  const totalAmount = totalUnits * 1000; // NGN 1000 per unit

  // Confirmation Modal
  if (showConfirmation) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-[24px] lg:rounded-[32px] w-full max-w-2xl p-6 lg:p-10 shadow-2xl animate-in zoom-in-95 duration-300">
          <h2 className="text-2xl font-black text-[#1e293b] mb-8">Confirm Course Registration</h2>

          {/* Courses List */}
          <div className="bg-[#f8fafc] rounded-[20px] p-6 mb-8 max-h-64 overflow-y-auto">
            <h3 className="text-[14px] font-bold text-[#1e293b] mb-4">Selected Courses ({previewedCourses.length})</h3>
            <div className="space-y-3">
              {previewedCourses.map((course) => (
                <div key={course.code} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                  <div>
                    <p className="text-[12px] font-bold text-gray-400">{course.code}</p>
                    <p className="text-[13px] font-bold text-[#1e293b]">{course.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] font-bold text-gray-400">{course.unit} units</p>
                    <p className="text-[13px] font-bold text-[#3b82f6]">NGN {course.unit * 1000}</p>
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
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-bold text-gray-400">Cost per Unit:</p>
              <p className="text-[14px] font-bold text-[#1e293b]">NGN 1,000</p>
            </div>
            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
              <p className="text-[15px] font-black text-[#1e293b]">Total Amount:</p>
              <p className="text-2xl font-black text-[#3b82f6]">NGN {totalAmount.toLocaleString()}</p>
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
              onClick={() => {
                setShowConfirmation(false);
                onShowPayment();
              }}
              className="flex-1 bg-[#22c55e] text-white px-6 py-3 rounded-lg text-[13px] font-bold hover:bg-green-600 transition-all shadow-md"
            >
              Confirm & Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-500">
      <div className="bg-white rounded-[24px] lg:rounded-[32px] p-6 lg:p-10 border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Registration Form Column */}
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-[#1e293b]">Course Registration</h2>
            
            <div className="space-y-5">
              <FormRow label="Current Level">
                <select className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold text-gray-400 appearance-none focus:outline-none">
                  <option>200 Level</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
              </FormRow>

              <FormRow label="Semester">
                <select className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold text-gray-400 appearance-none focus:outline-none">
                  <option>Select Semester</option>
                  <option>First Semester</option>
                  <option>Second Semester</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
              </FormRow>

              <FormRow label="Add Course">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search Course Name or Code" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={() => setShowDropdown(true)}
                    className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold text-[#1e293b] focus:outline-none placeholder:text-gray-300 cursor-pointer" 
                  />
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
                  
                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-40 max-h-64 overflow-y-auto">
                      {filteredCourses.length > 0 ? (
                        <div className="p-2">
                          {filteredCourses.map(course => (
                            <label key={course.code} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                              <input 
                                type="checkbox" 
                                className={checkboxClasses}
                                checked={selectedCoursesInDropdown.includes(course.code)}
                                onChange={() => handleSelectCourse(course.code)}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="ml-3 flex-1">
                                <p className="text-[12px] font-bold text-[#1e293b]">{course.code}</p>
                                <p className="text-[11px] text-gray-400 truncate">{course.title}</p>
                              </div>
                              <span className="text-[11px] font-bold text-gray-400 ml-2">{course.unit} units</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center text-gray-400 text-[12px]">No courses found</div>
                      )}
                      
                      {filteredCourses.length > 0 && (
                        <div className="border-t border-gray-100 p-3 flex justify-end gap-2 bg-gray-50">
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
                      )}
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

            <div className="flex space-x-3">
              <button 
                onClick={() => setShowDropdown(true)}
                className="bg-[#3b82f6] text-white px-6 py-2.5 rounded-lg text-[11px] font-bold hover:bg-blue-700 transition-colors"
              >
                Confirm Courses
              </button>
              <button 
                onClick={() => setPreviewedCourses([])}
                className="bg-[#f1f5f9] text-[#64748b] px-6 py-2.5 rounded-lg text-[11px] font-bold hover:bg-gray-200 transition-colors"
              >
                Remove All
              </button>
            </div>

            <div className="flex space-x-4 pt-6">
              <button 
                onClick={() => setShowConfirmation(true)}
                disabled={previewedCourses.length === 0}
                className="bg-[#22c55e] text-white px-10 py-3 rounded-lg text-[12px] font-bold hover:bg-green-600 disabled:bg-gray-300 transition-colors shadow-sm"
              >
                Register Courses
              </button>
              <button className="bg-white border border-gray-200 text-[#1e293b] px-10 py-3 rounded-lg text-[12px] font-bold hover:bg-gray-50 transition-all min-w-[120px]">Cancel</button>
            </div>
          </div>

          {/* Previewer Column */}
          <div className="bg-[#fcfdfe] rounded-[24px] p-6 lg:p-8 border border-gray-100 flex flex-col min-h-[400px]">
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
                      <tr key={course.code} className="hover:bg-white transition-colors">
                        <td className="px-3 py-3.5 font-bold text-gray-400 text-[11px]">{course.code}</td>
                        <td className="px-3 py-3.5 font-bold text-[#1e293b] text-[11px] truncate max-w-[180px]">{course.title}</td>
                        <td className="px-3 py-3.5 font-bold text-gray-400 text-[11px] text-right">{course.unit}</td>
                        <td className="px-3 py-3.5 text-center">
                          <button 
                            onClick={() => handleRemoveCourse(course.code)}
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

      {/* Registered Courses Table Section */}
      <div className="bg-white rounded-[24px] lg:rounded-[32px] p-6 lg:p-10 border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-base lg:text-lg font-bold text-[#1e293b]">Registered Courses</h2>
          <div className="relative w-full sm:w-auto">
            <select className="w-full sm:w-auto bg-[#f8fafc] border border-gray-100 text-[10px] font-bold rounded-lg pl-3 pr-10 py-2.5 text-gray-400 uppercase appearance-none cursor-pointer">
              <option>This Session</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
          </div>
        </div>
        <div className="overflow-x-auto -mx-6 lg:mx-0 px-6 lg:px-0">
          <table className="w-full text-left min-w-[900px]">
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
              {[...Array(7)].map((_, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 text-center">
                    <input type="checkbox" className={checkboxClasses} />
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-400 text-[11px]">CSC201.1</td>
                  <td className="px-4 py-4 font-bold text-[#1e293b] text-[11px]">Computer Science Introduction</td>
                  <td className="px-4 py-4 text-gray-400 font-medium text-[11px]">Department</td>
                  <td className="px-4 py-4 text-gray-400 font-bold text-[11px]">3</td>
                  <td className="px-4 py-4 text-gray-400 font-medium text-[11px]">Dr. Edward Nduka</td>
                  <td className="px-4 py-4">
                    <span className="px-3 py-1 bg-[#f0fdf4] text-[#22c55e] rounded-full text-[9px] font-bold uppercase tracking-wider">Registered</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Registration: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'transcript' | 'other'>('courses');
  const [isPaymentStep, setIsPaymentStep] = useState(false);

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-8 lg:space-y-10">
      {!isPaymentStep && (
        <div className="flex justify-center overflow-x-auto -mx-4 px-4 py-2">
          <div className="bg-white p-1 rounded-[20px] border border-gray-100 flex shadow-sm shrink-0">
            {(['courses', 'transcript', 'other'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
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
      )}

      <div className="min-h-[600px]">
        {isPaymentStep ? (
          <PaymentView onBack={() => setIsPaymentStep(false)} />
        ) : (
          <>
            {activeSubTab === 'courses' && <CoursesRegView onShowPayment={() => setIsPaymentStep(true)} />}
            {activeSubTab === 'transcript' && <TranscriptRegView />}
            {activeSubTab === 'other' && <div className="text-center py-20 text-gray-300 font-bold">Other services coming soon.</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default Registration;
