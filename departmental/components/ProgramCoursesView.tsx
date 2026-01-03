
import React, { useState } from 'react';
import { Search, Filter, Plus, BookOpen, Layers, Calendar, Trash2, Edit3, ShieldAlert, MoreHorizontal, ChevronDown, X } from 'lucide-react';
import { Program, Course, ProgramType } from '../types';

const INITIAL_PROGRAMS: Program[] = [
  { id: '1', code: 'BSc', name: 'Bachelors in Computer Science', type: 'Undergraduate', year: '2024', duration: '4 Years', status: 'Active' },
  { id: '2', code: 'PGD', name: 'Post Graduate Diploma', type: 'Post Graduate', year: '2023', duration: '1 Year', status: 'Completed' },
  { id: '3', code: 'BSc', name: 'Bachelors in Computer Science', type: 'Undergraduate', year: '2024', duration: '4 Years', status: 'Active' },
  { id: '4', code: 'BSc', name: 'Bachelors in Computer Science', type: 'Undergraduate', year: '2024', duration: '4 Years', status: 'Active' },
  { id: '5', code: 'BSc', name: 'Bachelors in Computer Science', type: 'Undergraduate', year: '2024', duration: '4 Years', status: 'Active' },
  { id: '6', code: 'BSc', name: 'Bachelors in Computer Science', type: 'Undergraduate', year: '2024', duration: '4 Years', status: 'Active' },
];

const INITIAL_COURSES: Course[] = [
  { id: 'c1', code: 'CSC201.1', title: 'Computer Science Introduction', units: 3, type: 'Department', lecturers: ['Dr. Edward Nduka'], level: '200', semester: '1st', prerequisites: [], fee: 5000, availableFor: ['Undergraduate'], status: 'Active' },
  { id: 'c2', code: 'CSC201.1', title: 'Computer Science Introduction', units: 3, type: 'Department', lecturers: ['Dr. Edward Nduka'], level: '200', semester: '1st', prerequisites: [], fee: 5000, availableFor: ['Undergraduate'], status: 'Active' },
  { id: 'c3', code: 'GES201.1', title: 'General Studies', units: 2, type: 'General', lecturers: ['Dr. Azubuike Okocha'], level: '200', semester: '1st', prerequisites: [], fee: 3000, availableFor: ['Undergraduate'], status: 'Active' },
  { id: 'c4', code: 'MTH210.1', title: 'Advanced Calculus', units: 3, type: 'Faculty', lecturers: ['Dr. Edward Nduka'], level: '200', semester: '2nd', prerequisites: [], fee: 5000, availableFor: ['Undergraduate'], status: 'Active' },
];

export const ProgramCoursesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'programs' | 'courses' | 'structure'>('programs');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Program & Courses</h2>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <TabButton active={activeTab === 'programs'} onClick={() => setActiveTab('programs')} icon={<Layers size={16}/>} label="Programs" />
          <TabButton active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} icon={<BookOpen size={16}/>} label="Course Catalog" />
          <TabButton active={activeTab === 'structure'} onClick={() => setActiveTab('structure')} icon={<Calendar size={16}/>} label="Setup & Sessions" />
        </div>
      </div>

      {activeTab === 'programs' && <ProgramsTab programs={INITIAL_PROGRAMS} />}
      {activeTab === 'courses' && <CoursesTab courses={INITIAL_COURSES} />}
      {activeTab === 'structure' && <StructureTab />}
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
  >
    {icon} {label}
  </button>
);

const ProgramsTab: React.FC<{ programs: Program[] }> = ({ programs }) => {
  const [isCreating, setIsCreating] = useState(false);

  if (isCreating) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-slate-800 mb-10">Create Program</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-6">
          <div className="space-y-6">
            <FormFieldHorizontal label="Program" placeholder="Masters in Computer Science" />
            <FormFieldHorizontal 
              label="Type" 
              type="select" 
              placeholder="Post Graduate (PGD)" 
              options={['Undergraduate', 'Post Graduate (PGD)', 'Masters', 'PhD']} 
            />
            <FormFieldHorizontal 
              label="Semesters" 
              type="select" 
              placeholder="2" 
              options={['1', '2', '3', '4', '8']} 
            />
            <FormFieldHorizontal 
              label="Duration" 
              type="select" 
              placeholder="18 Months" 
              options={['1 Year', '18 Months', '2 Years', '4 Years']} 
            />
          </div>
          <div className="space-y-6">
            <FormFieldHorizontal label="Code" placeholder="MSc" />
            <FormFieldHorizontal label="Year" placeholder="2024" />
            <FormFieldHorizontal label="Description" type="textarea" />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-12">
          <button 
            onClick={() => setIsCreating(false)}
            className="px-10 py-2.5 rounded-md text-sm font-medium border border-slate-400 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => setIsCreating(false)}
            className="px-10 py-2.5 rounded-md text-sm font-bold bg-[#00B01D] text-white hover:bg-green-700 transition-colors shadow-sm"
          >
            Create Program
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
        >
          <Plus size={18} /> Create Program
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Created Programs</h3>
          <div className="flex gap-3">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search by name, semester, or code" 
                className="bg-white border border-slate-200 text-xs py-2 pl-4 pr-3 rounded-xl outline-none w-64 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400" 
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter size={16} className="text-slate-400" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/60 border-y border-gray-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="px-6 py-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10" />
                </th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Program</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Year</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {programs.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors text-sm text-slate-600 group">
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10" />
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-500">{p.code}</td>
                  <td className="px-6 py-4 text-slate-500">{p.name}</td>
                  <td className="px-6 py-4 text-slate-500">{p.type}</td>
                  <td className="px-6 py-4 text-slate-500">{p.year}</td>
                  <td className="px-6 py-4 text-slate-500">{p.duration}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-sm ${
                      p.status === 'Active' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : p.status === 'Completed' ? 'bg-rose-100 text-rose-400' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-300">
                      <MoreHorizontal size={18} />
                    </button>
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

const CoursesTab: React.FC<{ courses: Course[] }> = ({ courses }) => {
  const [isCreating, setIsCreating] = useState(false);

  if (isCreating) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-slate-800 mb-10">Create Course</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-6">
          <div className="space-y-6">
            <FormFieldHorizontal label="Course Title" placeholder="Advanced Engineering Mathematics" />
            <FormFieldHorizontal label="Level" type="select" placeholder="Select Level" options={['100', '200', '300', '400', '500']} />
            <FormFieldHorizontal label="Semester" type="select" placeholder="Select Semester" options={['1st Semester', '2nd Semester']} />
            <FormFieldHorizontal label="Credit Unit" type="select" placeholder="3" options={['1', '2', '3', '4', '6']} />
          </div>
          <div className="space-y-6">
            <FormFieldHorizontal label="Course Code" placeholder="MTH 210" />
            <FormFieldHorizontal label="Lead Lecturer" placeholder="Dr. Edward Nduka" />
            <div className="flex items-start gap-12 group">
              <label className="text-sm font-bold text-slate-600 w-28 pt-2 shrink-0">Other Lecturers</label>
              <div className="flex-1 max-w-sm">
                <div className="w-full bg-white border border-slate-200 rounded-lg p-3 min-h-[110px] flex flex-wrap gap-2 content-start">
                   <LecturerTag name="Dr. Daniel Eze" />
                   <LecturerTag name="Josephine Eze" />
                   <LecturerTag name="Kingdom Akpan" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-12">
          <button 
            onClick={() => setIsCreating(false)}
            className="px-10 py-2.5 rounded-md text-sm font-medium border border-slate-400 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => setIsCreating(false)}
            className="px-10 py-2.5 rounded-md text-sm font-bold bg-[#00B01D] text-white hover:bg-green-700 transition-colors shadow-sm"
          >
            Create Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
        >
          <Plus size={18} /> Create Course
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Created Courses</h3>
          <div className="flex gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search by name, semester, or code" 
                className="bg-white border border-slate-200 text-xs py-2 pl-9 pr-3 rounded-xl outline-none w-64 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400" 
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter size={16} className="text-slate-400" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/60 border-y border-gray-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="px-6 py-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10" />
                </th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Course Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Unit</th>
                <th className="px-6 py-4">Course Lecturer(s)</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {courses.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors text-sm text-slate-600 group">
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10" />
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-500">{c.code}</td>
                  <td className="px-6 py-4 text-slate-500">{c.title}</td>
                  <td className="px-6 py-4 text-slate-500">{c.type}</td>
                  <td className="px-6 py-4 text-slate-500">{c.units}</td>
                  <td className="px-6 py-4 text-slate-500">{c.lecturers.join(', ')}</td>
                  <td className="px-6 py-4">
                    <button className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-300">
                      <MoreHorizontal size={18} />
                    </button>
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

const LecturerTag: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex items-center gap-2 bg-[#E9EDF5] text-[#818E9B] px-3 py-1 rounded text-xs font-medium">
    {name}
    <X size={12} className="cursor-pointer hover:text-rose-500 transition-colors" />
  </div>
);

const FormFieldHorizontal: React.FC<{
  label: string;
  placeholder?: string;
  type?: 'text' | 'select' | 'textarea';
  options?: string[];
}> = ({ label, placeholder, type = 'text', options = [] }) => (
  <div className="flex items-start gap-12 group">
    <label className="text-sm font-bold text-slate-600 w-28 pt-2 shrink-0">{label}</label>
    <div className="flex-1 max-w-sm">
      {type === 'text' && (
        <input 
          type="text" 
          placeholder={placeholder}
          className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
        />
      )}
      {type === 'select' && (
        <div className="relative group/select">
          <select className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-400 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all appearance-none cursor-pointer">
            <option value="" disabled selected>{placeholder}</option>
            {options.map(opt => <option key={opt}>{opt}</option>)}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronDown size={14} />
          </div>
        </div>
      )}
      {type === 'textarea' && (
        <textarea 
          className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/10 outline-none h-28 resize-none transition-all"
        />
      )}
    </div>
  </div>
);

const StructureTab: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Calendar size={18} className="text-blue-600" /> Session Management
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <div>
            <p className="text-sm font-bold text-blue-900">2024/2025 Session</p>
            <p className="text-[11px] text-blue-600">Active Current Session</p>
          </div>
          <button className="text-xs font-bold bg-white text-blue-600 px-3 py-1 rounded-lg border border-blue-100">Manage</button>
        </div>
        <button className="w-full py-3 border-2 border-dashed border-slate-100 text-slate-400 text-sm font-bold rounded-xl hover:border-blue-200 hover:text-blue-500 transition-all">
          + Start New Academic Session
        </button>
      </div>
    </div>
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <ShieldAlert size={18} className="text-orange-500" /> Semester Timeline
      </h3>
      <div className="space-y-3">
        <FormFieldVertical label="Current Semester" type="select" options={['1st Semester', '2nd Semester']} />
        <div className="grid grid-cols-2 gap-4">
          <FormFieldVertical label="Start Date" placeholder="YYYY-MM-DD" />
          <FormFieldVertical label="End Date" placeholder="YYYY-MM-DD" />
        </div>
        <button className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-xl mt-2">Update Timeline</button>
      </div>
    </div>
  </div>
);

const FormFieldVertical: React.FC<{ label: string; placeholder?: string; type?: 'text' | 'select'; options?: string[] }> = ({ 
  label, placeholder, type = 'text', options = [] 
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400">{label}</label>
    {type === 'text' ? (
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
      />
    ) : (
      <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer">
        {options.map(opt => <option key={opt}>{opt}</option>)}
      </select>
    )}
  </div>
);
