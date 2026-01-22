import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Loader2, X, MoreHorizontal, Pencil, Trash, Download } from "lucide-react";
import CourseForm from "./CourseForm";
import { programsCoursesApi } from "../api/programscourseapi";

const CoursesTab: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Toggle selection for a single course
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCourses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCourses.map((c) => c.id));
    }
  };

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = courses.filter(
        (course) =>
          course.title?.toLowerCase().includes(term) ||
          course.code?.toLowerCase().includes(term) ||
          course.level?.name?.toLowerCase().includes(term) ||
          course.semester?.name?.toLowerCase().includes(term)
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, courses]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // ✅ FIX: department is resolved from JWT (NO hardcoded ID)
      const response = await programsCoursesApi.getCoursesByDepartment();

      if (response.status === "success" && response.courses) {
        setCourses(response.courses);
        setFilteredCourses(response.courses);
      }
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      setError(err.response?.data?.message || "Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCourse = async (courseData: any) => {
    try {
      await programsCoursesApi.createCourse(courseData);
      setIsCreating(false);
      fetchCourses();
    } catch (err: any) {
      console.error("Error creating course:", err);
      throw err;
    }
  };

  if (isCreating) {
    return (
      <CourseForm
        onSubmit={handleCreateCourse}
        onCancel={() => setIsCreating(false)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto mt-10">
        <div className="text-red-500 mb-4">
          <X className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-bold text-red-700 mb-2">
          Failed to Load Courses
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchCourses}
          className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
        >
          Retry
        </button>
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
          <h3 className="text-lg font-bold text-slate-800">
            Created Courses ({filteredCourses.length})
          </h3>

          <div className="flex gap-3">
            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Search by title, code, or level"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-slate-200 text-xs py-2 pl-9 pr-3 rounded-xl outline-none w-64 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
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
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                    checked={
                      filteredCourses.length > 0 &&
                      selectedIds.length === filteredCourses.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Course Title</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Semester</th>
                <th className="px-6 py-4">Credit Units</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    {searchTerm
                      ? "No courses match your search"
                      : "No courses found"}
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className={`hover:bg-slate-50/50 transition-colors text-sm text-slate-600 group ${
                      selectedIds.includes(course.id) ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                        checked={selectedIds.includes(course.id)}
                        onChange={() => toggleSelection(course.id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">{course.code}</td>
                    <td className="px-6 py-4">{course.title}</td>
                    <td className="px-6 py-4">{course.level?.name}</td>
                    <td className="px-6 py-4">{course.semester?.name}</td>
                    <td className="px-6 py-4">{course.creditUnits}</td>
                    <td className="px-6 py-4">
                      {course.semester?.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={(e) => toggleDropdown(course.id, e)}
                          className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-300 hover:text-slate-600"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {activeDropdownId === course.id && (
                          <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Edit clicked", course.id);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              >
                                <Pencil size={14} />
                                Edit details
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Delete clicked", course.id);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash size={14} />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Bar */}
      {selectedIds.length > 1 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-xl shadow-2xl border border-gray-100 flex items-center gap-6 z-50 animate-in slide-in-from-bottom duration-300">
          <span className="text-sm font-bold text-slate-700">
            {selectedIds.length} items selected
          </span>
          <div className="h-6 w-px bg-slate-200"></div>
          <button className="flex items-center gap-2 bg-[#1D7AD9] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
            <Download size={16} />
            Bulk Download
          </button>
          <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors">
            <Trash size={16} />
            Bulk Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursesTab;
// import { Plus, Search, Filter, Loader2, X, MoreHorizontal } from "lucide-react";
// // import CourseForm from "./CourseForm";
// import { programsCoursesApi } from "../api/programscourseapi";
// // import { CURRENT_DEPARTMENT_ID } from "../utils/constants";

// const CoursesTab: React.FC = () => {
//   const [isCreating, setIsCreating] = useState(false);
//   const [courses, setCourses] = useState<any[]>([]);
//   const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Fetch courses on component mount
//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   // Filter courses when search term changes
//   useEffect(() => {
//     if (searchTerm.trim() === "") {
//       setFilteredCourses(courses);
//     } else {
//       const term = searchTerm.toLowerCase();
//       const filtered = courses.filter(
//         (course) =>
//           course.title?.toLowerCase().includes(term) ||
//           course.code?.toLowerCase().includes(term) ||
//           course.level?.name?.toLowerCase().includes(term) ||
//           course.semester?.name?.toLowerCase().includes(term)
//       );
//       setFilteredCourses(filtered);
//     }
//   }, [searchTerm, courses]);

//   const fetchCourses = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await programsCoursesApi.getCoursesByDepartment(
//         CURRENT_DEPARTMENT_ID
//       );
//       if (response.status === "success" && response.courses) {
//         setCourses(response.courses);
//         setFilteredCourses(response.courses);
//       }
//     } catch (err: any) {
//       console.error("Error fetching courses:", err);
//       setError(err.response?.data?.message || "Failed to load courses");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCreateCourse = async (courseData: any) => {
//     try {
//       await programsCoursesApi.createCourse(courseData);
//       setIsCreating(false);
//       fetchCourses(); // Refresh the list
//     } catch (err: any) {
//       console.error("Error creating course:", err);
//       throw err;
//     }
//   };

//   if (isCreating) {
//     return (
//       <CourseForm
//         onSubmit={handleCreateCourse}
//         onCancel={() => setIsCreating(false)}
//       />
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
//           <p className="text-slate-500">Loading courses...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto mt-10">
//         <div className="text-red-500 mb-4">
//           <X className="h-12 w-12 mx-auto" />
//         </div>
//         <h3 className="text-lg font-bold text-red-700 mb-2">
//           Failed to Load Courses
//         </h3>
//         <p className="text-red-600 mb-4">{error}</p>
//         <button
//           onClick={fetchCourses}
//           className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-end">
//         <button
//           onClick={() => setIsCreating(true)}
//           className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
//         >
//           <Plus size={18} /> Create Course
//         </button>
//       </div>

//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//         <div className="p-6 flex items-center justify-between">
//           <h3 className="text-lg font-bold text-slate-800">
//             Created Courses ({filteredCourses.length})
//           </h3>
//           <div className="flex gap-3">
//             <div className="relative group">
//               <Search
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                 size={14}
//               />
//               <input
//                 type="text"
//                 placeholder="Search by title, code, or level"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="bg-white border border-slate-200 text-xs py-2 pl-9 pr-3 rounded-xl outline-none w-64 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
//               />
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm("")}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                 >
//                   <X size={14} />
//                 </button>
//               )}
//             </div>
//             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
//               <Filter size={16} className="text-slate-400" />
//               Filter
//             </button>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-slate-50/60 border-y border-gray-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
//                 <th className="px-6 py-4 w-12 text-center">
//                   <input
//                     type="checkbox"
//                     className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10"
//                   />
//                 </th>
//                 <th className="px-6 py-4">Code</th>
//                 <th className="px-6 py-4">Course Title</th>
//                 <th className="px-6 py-4">Level</th>
//                 <th className="px-6 py-4">Semester</th>
//                 <th className="px-6 py-4">Credit Units</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {filteredCourses.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={8}
//                     className="px-6 py-8 text-center text-slate-500"
//                   >
//                     {searchTerm
//                       ? "No courses match your search"
//                       : "No courses found"}
//                   </td>
//                 </tr>
//               ) : (
//                 filteredCourses.map((course) => (
//                   <tr
//                     key={course.id}
//                     className="hover:bg-slate-50/50 transition-colors text-sm text-slate-600 group"
//                   >
//                     <td className="px-6 py-4 text-center">
//                       <input
//                         type="checkbox"
//                         className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10"
//                       />
//                     </td>
//                     <td className="px-6 py-4 font-medium text-slate-500">
//                       {course.code}
//                     </td>
//                     <td className="px-6 py-4 text-slate-500">{course.title}</td>
//                     <td className="px-6 py-4 text-slate-500">
//                       {course.level?.name || "N/A"}
//                     </td>
//                     <td className="px-6 py-4 text-slate-500">
//                       <span
//                         className={`px-2 py-1 rounded text-[10px] font-bold ${
//                           course.semester?.isActive
//                             ? "bg-blue-100 text-blue-600"
//                             : "bg-slate-100 text-slate-400"
//                         }`}
//                       >
//                         {course.semester?.name}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-slate-500">
//                       {course.creditUnits}
//                     </td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-sm ${
//                           course.semester?.isActive
//                             ? "bg-emerald-100 text-emerald-600"
//                             : "bg-rose-100 text-rose-400"
//                         }`}
//                       >
//                         {course.semester?.isActive ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <button className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-300 hover:text-slate-600">
//                         <MoreHorizontal size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CoursesTab;
