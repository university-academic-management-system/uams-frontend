"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Filter,
  Search,
  Camera,
  Download,
  Printer,
  X,
  Loader2,
} from "lucide-react";
import api from "../api/axios";

// --- Interfaces ---
interface Student {
  id: string;
  idNo: string;
  name: string;
  matric: string;
  faculty: string;
  department: string;
  graduationDate: string;
  status: string;
  hasPaidIDCardFee: boolean;
}

interface ApiStudent {
  id: string;
  studentId: string;
  user: { fullName: string; email: string; phone: string | null; id: string };
  Department?: { name: string; Faculty?: { name: string } };
  PaymentTransactions?: Array<{ payment_for: string; status: string }>;
}

export const RolesView: React.FC = () => {
  // --- State Management ---
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- API Logic ---
  const fetchStudents = async (search = "") => {
    try {
      setLoading(true);
      const response = await api.get(`/university-admin/students`, {
        params: { search, limit: 20 },
      });

      const transformed: Student[] = response.data.students.map(
        (s: ApiStudent) => ({
          id: s.id,
          idNo: s.studentId,
          name: s.user?.fullName || "N/A",
          matric: s.studentId,
          faculty: s.Department?.Faculty?.name || "N/A",
          department: s.Department?.name || "N/A",
          graduationDate: "2026-06-15",
          status: "Active",
          hasPaidIDCardFee:
            s.PaymentTransactions?.some(
              (t) => t.payment_for === "id_card_fee" && t.status === "success"
            ) || false,
        })
      );

      setStudents(transformed);
    } catch (err) {
      console.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(searchQuery);
  }, [searchQuery]);

  // --- Camera Logic ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      alert("Camera access denied. Please check your browser permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480);
        setCapturedPhoto(canvasRef.current.toDataURL("image/png"));
        stopCamera();
      }
    }
  };

  const handleIssueCard = (student: Student) => {
    setCurrentStudent(student);
    setCapturedPhoto(null);
    setShowModal(true);
    startCamera();
  };

  const handlePhotoUploadAndAction = async (action: "print" | "download") => {
    if (!currentStudent || !capturedPhoto) return;

    setUploadingPhoto(true);
    setUploadError(null);

    try {
      // Convert base64 to blob for upload
      const response = await fetch(capturedPhoto);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("avatar", blob, `${currentStudent.matric}.png`);

      await api.put(
        `/university-admin/students/avatar?studentId=${currentStudent.matric}`,
        formData
      );

      if (action === "download") {
        const link = document.createElement("a");
        link.href = capturedPhoto;
        link.download = `ID_Card_${currentStudent.matric}.png`;
        link.click();
      } else {
        window.print();
      }
    } catch (err) {
      setUploadError("Failed to save photo to server.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Student ID Issuance
          </h2>
          <p className="text-sm text-slate-500">
            Capture photos and generate official university ID cards.
          </p>
        </div>
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by name or matric..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
            <tr>
              <th className="px-6 py-4">Student Name</th>
              <th className="px-6 py-4">Matric No</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {students.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-bold text-slate-700">
                  {student.name}
                </td>
                <td className="px-6 py-4 text-slate-500">{student.matric}</td>
                <td className="px-6 py-4 text-slate-500">
                  {student.department}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      student.hasPaidIDCardFee
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {student.hasPaidIDCardFee ? "FEE PAID" : "UNPAID"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleIssueCard(student)}
                    disabled={!student.hasPaidIDCardFee}
                    className={`font-bold ${
                      student.hasPaidIDCardFee
                        ? "text-blue-600 hover:underline"
                        : "text-slate-300 cursor-not-allowed"
                    }`}
                  >
                    Issue Card
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Section */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg">
                Capture & Issue: {currentStudent?.name}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  stopCamera();
                }}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-8">
              {/* Camera Area */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden relative border-4 border-slate-100 shadow-inner">
                  {!capturedPhoto ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={capturedPhoto}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {!capturedPhoto ? (
                  <button
                    onClick={captureImage}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700"
                  >
                    <Camera size={18} /> Capture Photo
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCapturedPhoto(null);
                      startCamera();
                    }}
                    className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200"
                  >
                    Retake Photo
                  </button>
                )}
              </div>

              {/* ID Preview Section */}
              {capturedPhoto && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    ID Card Preview
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Front View */}
                    <div className="relative aspect-[400/250] rounded-xl border border-slate-200 overflow-hidden shadow-lg group">
                      <img
                        src="/idcard-front.png"
                        className="w-full h-full"
                        alt="Front Template"
                      />
                      {/* Dynamic Photo Overlay */}
                      <img
                        src={capturedPhoto}
                        className="absolute top-[38%] left-[6.5%] w-[23%] h-[43%] object-cover border border-white"
                        alt="Student"
                      />
                      {/* Dynamic Text Overlays */}
                      <div className="absolute left-[33%] top-[40%] text-[8px] font-bold text-black uppercase space-y-1">
                        <p className="text-[10px] leading-tight max-w-[180px]">
                          {currentStudent?.name}
                        </p>
                        <p className="pt-2">{currentStudent?.matric}</p>
                        <p className="leading-none">
                          {currentStudent?.department}
                        </p>
                      </div>
                    </div>
                    {/* Back View */}
                    <div className="aspect-[400/250] rounded-xl border border-slate-200 overflow-hidden shadow-lg">
                      <img
                        src="/idcard-back.png"
                        className="w-full h-full"
                        alt="Back Template"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t flex gap-3">
              <button
                disabled={!capturedPhoto || uploadingPhoto}
                onClick={() => handlePhotoUploadAndAction("print")}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50"
              >
                {uploadingPhoto ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Printer size={18} />
                )}{" "}
                Print Card
              </button>
              <button
                disabled={!capturedPhoto || uploadingPhoto}
                onClick={() => handlePhotoUploadAndAction("download")}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
              >
                <Download size={18} /> Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden" width={640} height={480} />
    </div>
  );
};

// "use client";

// import type React from "react";
// import { useState, useRef, useEffect } from "react";
// import {
//   Plus,
//   Filter,
//   Search,
//   Camera,
//   Download,
//   Printer,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   Loader2,
// } from "lucide-react";
// import api from "../api/axios"; // Adjust the import path as needed

// interface Student {
//   id: string;
//   idNo: string;
//   name: string;
//   matric: string;
//   faculty: string;
//   department: string;
//   graduationDate: string;
//   status: "Pending" | "Issued" | "Active";
//   photoUrl?: string;
//   level?: string;
//   email?: string;
//   phone?: string;
//   userId?: string;
//   hasPaidIDCardFee?: boolean;
//   PaymentTransactions?: Array<{
//     id: string;
//     reference: string;
//     amount: string;
//     currency: string;
//     payment_for: string;
//     status: string;
//     payment_date: string | null;
//     paid_at: string;
//     payment_method: string;
//     gateway: string;
//   }>;
//   paymentSummary?: {
//     totalSuccessful: string;
//     totalPending: string;
//     totalPaidAmount: string;
//     lastPaymentDate: string | null;
//     hasSuccessfulPayments: boolean;
//     hasPendingPayments: boolean;
//     allPayments: Array<{
//       id: string;
//       reference: string;
//       amount: string;
//       currency: string;
//       payment_for: string;
//       status: string;
//       payment_date: string | null;
//       paid_at: string;
//       payment_method: string;
//       gateway: string;
//     }>;
//   };
// }

// interface ApiStudent {
//   id: string
//   studentId: string
//   level: string
//   isActive: boolean
//   user: {
//     fullName: string
//     email: string
//     phone: string | null
//     avatar: string | null
//     id: string
//   }
//   Department?: {
//     id: string;
//     name: string;
//     code: string;
//     Faculty?: {
//       id: string;
//       name: string;
//       code: string;
//     };
//   };
//   Program?: {
//     id: string;
//     name: string;
//     code: string;
//   };
//   PaymentTransactions?: Array<{
//     id: string;
//     reference: string;
//     amount: string;
//     currency: string;
//     payment_for: string;
//     status: string;
//     payment_date: string | null;
//     paid_at: string;
//     payment_method: string;
//     gateway: string;
//   }>;
//   paymentSummary?: {
//     totalSuccessful: string;
//     totalPending: string;
//     totalPaidAmount: string;
//     lastPaymentDate: string | null;
//     hasSuccessfulPayments: boolean;
//     hasPendingPayments: boolean;
//     allPayments: Array<{
//       id: string;
//       reference: string;
//       amount: string;
//       currency: string;
//       payment_for: string;
//       status: string;
//       payment_date: string | null;
//       paid_at: string;
//       payment_method: string;
//       gateway: string;
//     }>;
//   };
// }

// interface PaginationInfo {
//   currentPage: number;
//   totalPages: number;
//   totalItems: number;
//   itemsPerPage: number;
// }

// export const RolesView: React.FC = () => {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
//     new Set()
//   );
//   const [showModal, setShowModal] = useState(false);
//   const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
//   const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
//   const [cameraActive, setCameraActive] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [pagination, setPagination] = useState<PaginationInfo>({
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0,
//     itemsPerPage: 10,
//   });
//   const [uploadingPhoto, setUploadingPhoto] = useState(false);
//   const [uploadSuccess, setUploadSuccess] = useState(false);
//   const [uploadError, setUploadError] = useState<string | null>(null);

//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   // Fetch students from API
//   const fetchStudents = async (page: number = 1, search: string = "") => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: pagination.itemsPerPage.toString(),
//       });

//       if (search) {
//         params.append("search", search);
//       }

//       const response = await api.get(`/university-admin/students?${params}`)

//       // console.log("fetched students", response)

//       // Transform API response to match component interface
//       const transformedStudents: Student[] = response.data.students.map((apiStudent: ApiStudent) => {
//         // Check if student has paid ID card fee
//         const hasPaidIDCardFee = apiStudent.PaymentTransactions?.some(
//           transaction => transaction.payment_for === "id_card_fee" && transaction.status === "success"
//         ) || false

//         // Get department and faculty names from the nested structure
//         const departmentName = apiStudent.Department?.name || "Not Assigned"
//         const facultyName = apiStudent.Department?.Faculty?.name || "Not Assigned"

//         return {
//           id: apiStudent.id,
//           idNo: apiStudent.studentId,
//           name: apiStudent.user?.fullName || "N/A",
//           matric: apiStudent.studentId,
//           faculty: facultyName,
//           department: departmentName,
//           graduationDate: "2026-06-15", // You might want to get this from the API or calculate it
//           status: hasPaidIDCardFee ? "Pending" : "Active", // Update status based on payment
//           level: apiStudent.level,
//           email: apiStudent.user?.email || "",
//           phone: apiStudent.user?.phone || "",
//           userId: apiStudent.user?.id || "",
//           hasPaidIDCardFee,
//           PaymentTransactions: apiStudent.PaymentTransactions,
//           paymentSummary: apiStudent.paymentSummary
//         }
//       );

//       setStudents(transformedStudents);

//       // Update pagination info from response if available
//       if (response.data.pagination) {
//         setPagination((prev) => ({
//           ...prev,
//           currentPage: response.data.pagination.currentPage || page,
//           totalPages: response.data.pagination.totalPages || 1,
//           totalItems: response.data.pagination.totalItems || 0,
//         }));
//       }
//     } catch (err: any) {
//       console.error("Error fetching students:", err);
//       setError(err.response?.data?.message || "Failed to load students");
//       setStudents([]); // Clear students on error
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial fetch
//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   // Search handler with debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchQuery !== "") {
//         fetchStudents(1, searchQuery);
//       } else {
//         fetchStudents(1);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   // Fetch student photo
//   const fetchStudentPhoto = async (
//     studentId: string
//   ): Promise<string | null> => {
//     try {
//       const response = await api.get(
//         `/university-admin/students/avatar?studentId=${studentId}`,
//         {
//           responseType: "blob", // Important for image data
//         }
//       );

//       if (response.data) {
//         // Create object URL from blob
//         const imageUrl = URL.createObjectURL(response.data);
//         return imageUrl;
//       }
//       return null;
//     } catch (err) {
//       console.error("Error fetching student photo:", err);
//       return null;
//     }
//   };

//   // Upload photo to backend
//   const uploadPhotoToBackend = async (
//     studentId: string,
//     photoData: string
//   ): Promise<boolean> => {
//     try {
//       setUploadingPhoto(true);
//       setUploadError(null);
//       setUploadSuccess(false);

//       // Convert base64 to blob
//       const base64Response = await fetch(photoData);
//       const blob = await base64Response.blob();

//       // Create FormData object
//       const formData = new FormData();
//       formData.append("avatar", blob, `student_${studentId}.png`);

//       // Make PUT request to update avatar
//       const uploadResponse = await api.put(
//         `/university-admin/students/avatar?studentId=${studentId}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       setUploadSuccess(true);
//       console.log("Photo uploaded successfully:", uploadResponse.data);
//       return true;
//     } catch (err: any) {
//       console.error("Error uploading photo:", err);
//       setUploadError(err.response?.data?.message || "Failed to upload photo");
//       return false;
//     } finally {
//       setUploadingPhoto(false);
//     }
//   };

//   // Handle photo upload and then perform action (print or download)
//   const handlePhotoUploadAndAction = async (
//     studentId: string,
//     photoData: string,
//     action: "print" | "download"
//   ) => {
//     // First upload the photo
//     const uploadSuccess = await uploadPhotoToBackend(studentId, photoData);

//     if (!uploadSuccess) {
//       alert("Failed to upload photo. Please try again.");
//       return;
//     }

//     // Then perform the requested action
//     if (action === "print") {
//       handlePrintID();
//     } else if (action === "download") {
//       handleDownloadID();
//     }
//   };

//   // Update student photo when modal opens
//   useEffect(() => {
//     if (showModal && currentStudent) {
//       // Pre-fetch photo if available
//       fetchStudentPhoto(currentStudent.matric).then((photoUrl) => {
//         if (photoUrl) {
//           // You can set this as the initial captured photo
//           // Or use it as a fallback if no photo is captured
//         }
//       });
//     }
//   }, [showModal, currentStudent]);

//   useEffect(() => {
//     if (showModal && !capturedPhoto) {
//       startCamera();
//       setCameraActive(true);
//     } else {
//       stopCamera();
//       setCameraActive(false);
//     }

//     return () => {
//       stopCamera();
//     };
//   }, [showModal, capturedPhoto]);

//   const toggleStudentSelection = (studentId: string) => {
//     setSelectedStudents((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(studentId)) {
//         newSet.delete(studentId);
//       } else {
//         newSet.add(studentId);
//       }
//       return newSet;
//     });
//   };

//   const toggleAllSelection = () => {
//     if (selectedStudents.size === students.length) {
//       setSelectedStudents(new Set());
//     } else {
//       // Only select students who have paid ID card fee
//       const eligibleStudentIds = students
//         .filter((student) => student.hasPaidIDCardFee)
//         .map((student) => student.id);
//       setSelectedStudents(new Set(eligibleStudentIds));
//     }
//   };

//   const canIssueCard = (student: Student) => {
//     // Student can get ID card if they have paid the ID card fee
//     return student.hasPaidIDCardFee === true;
//   };

//   const handleIssueCard = async (student: Student) => {
//     if (!canIssueCard(student)) return;

//     setCurrentStudent(student);
//     setCapturedPhoto(null);
//     setUploadSuccess(false);
//     setUploadError(null);

//     // Try to load existing photo from API
//     try {
//       const photoUrl = await fetchStudentPhoto(student.matric);
//       if (photoUrl) {
//         setCapturedPhoto(photoUrl);
//       }
//     } catch (err) {
//       console.log("No existing photo found, will capture new one");
//     }

//     setShowModal(true);
//   };

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       fetchStudents(newPage, searchQuery);
//     }
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: "user",
//           width: { ideal: 640 },
//           height: { ideal: 480 },
//         },
//       });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//     } catch (err) {
//       console.error("[v0] Error accessing camera:", err);
//     }
//   };

//   const captureImage = () => {
//     if (videoRef.current && canvasRef.current) {
//       const context = canvasRef.current.getContext("2d");
//       if (context) {
//         context.drawImage(
//           videoRef.current,
//           0,
//           0,
//           canvasRef.current.width,
//           canvasRef.current.height
//         );
//         const photoData = canvasRef.current.toDataURL("image/png");
//         setCapturedPhoto(photoData);
//         stopCamera();
//         setCameraActive(false);
//       }
//     }
//   };

//   const stopCamera = () => {
//     if (videoRef.current?.srcObject) {
//       const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
//       tracks.forEach((track) => track.stop());
//     }
//   };

//   // const handlePrintID = () => {
//   //   const printWindow = window.open("", "", "width=1000,height=600")
//   //   if (printWindow && currentStudent && capturedPhoto) {
//   //     printWindow.document.write(`
//   //       <!DOCTYPE html>
//   //       <html>
//   //         <head>
//   //           <style>
//   //             body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
//   //             .card-container { display: flex; gap: 40px; justify-content: center; }
//   //             .card { width: 400px; height: 250px; border: 2px solid #333; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
//   //             .front { background: linear-gradient(135deg, #1D7AD9 0%, #0052A3 100%); color: white; display: flex; flex-direction: column; padding: 20px; }
//   //             .logo { font-size: 14px; font-weight: bold; margin-bottom: 10px; }
//   //             .student-section { display: flex; gap: 15px; flex: 1; }
//   //             .photo { width: 80px; height: 100px; background: white; border-radius: 4px; overflow: hidden; }
//   //             .photo img { width: 100%; height: 100%; object-fit: cover; }
//   //             .details { flex: 1; font-size: 12px; }
//   //             .details div { margin: 4px 0; }
//   //             .label { font-size: 10px; opacity: 0.8; }
//   //             .back { background: white; color: #333; display: flex; flex-direction: column; justify-content: space-between; padding: 20px; border-left: 2px solid #1D7AD9; }
//   //             .back-text { font-size: 11px; line-height: 1.6; text-align: center; margin-bottom: 20px; }
//   //             .signature { border-top: 1px solid #333; padding-top: 10px; font-size: 10px; text-align: center; }
//   //           </style>
//   //         </head>
//   //         <body>
//   //           <div class="card-container">
//   //             <div class="card front">
//   //               <div class="logo">UNIVERSITY OF PORT HARCOURT</div>
//   //               <div class="logo" style="font-size: 12px; margin-bottom: 15px;">${currentStudent.faculty}</div>
//   //               <div class="student-section">
//   //                 <div class="photo"><img src="${capturedPhoto}" /></div>
//   //                 <div class="details">
//   //                   <div><span class="label">NAME</span></div>
//   //                   <div style="font-weight: bold; margin-bottom: 8px;">${currentStudent.name}</div>
//   //                   <div><span class="label">MATRIC NO</span></div>
//   //                   <div>${currentStudent.matric}</div>
//   //                   <div style="margin-top: 8px;"><span class="label">FACULTY</span></div>
//   //                   <div>${currentStudent.faculty}</div>
//   //                   <div style="margin-top: 8px;"><span class="label">DEPARTMENT</span></div>
//   //                   <div>${currentStudent.department}</div>
//   //                   <div style="margin-top: 8px;"><span class="label">EXPIRES</span></div>
//   //                   <div>${new Date(currentStudent.graduationDate).toLocaleDateString()}</div>
//   //                 </div>
//   //               </div>
//   //             </div>
//   //             <div class="card back">
//   //               <div class="back-text">
//   //                 The holder whose name and photograph on this I.D card is a bonafide student of the University of Port Harcourt.
//   //               </div>
//   //               <div class="back-text">
//   //                 If found please return to the office of Chief Security Officer, University of Port Harcourt.
//   //               </div>
//   //               <div class="signature">
//   //                 Department Admin<br>
//   //                 ________________<br>
//   //                 Signature
//   //               </div>
//   //             </div>
//   //           </div>
//   //         </body>
//   //       </html>
//   //     `)
//   //     printWindow.document.close()
//   //     printWindow.print()
//   //   }
//   // }
//   const handlePrintID = () => {
//     const printWindow = window.open("", "", "width=1000,height=600");
//     if (printWindow && currentStudent && capturedPhoto) {
//       // Use the correct paths from your public folder
//       const frontBackground = "/idcard.png"; // Front template
//       const backBackground = "/idcard1.png"; // Back design

//       printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>ID Card - ${currentStudent.name}</title>
//           <style>
//             @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

//             * {
//               margin: 0;
//               padding: 0;
//               box-sizing: border-box;
//             }

//             body {
//               margin: 0;
//               padding: 20px;
//               font-family: 'Poppins', Arial, sans-serif;
//               background: #f5f5f5;
//               display: flex;
//               justify-content: center;
//               align-items: center;
//               min-height: 100vh;
//               -webkit-print-color-adjust: exact !important;
//               print-color-adjust: exact !important;
//             }

//             .card-container {
//               display: flex;
//               gap: 40px;
//               justify-content: center;
//               align-items: center;
//               flex-wrap: wrap;
//             }

//             .card {
//               width: 400px;
//               height: 250px;
//               border-radius: 12px;
//               overflow: hidden;
//               box-shadow: 0 8px 20px rgba(0,0,0,0.15);
//               position: relative;
//             }

//             /* Front Card Styling */
//             .front {
//               background-image: url('${frontBackground}');
//               background-size: 100% 100%;
//               background-position: center;
//               background-repeat: no-repeat;
//               position: relative;
//               color: #333;
//             }

//             .front-content {
//               position: relative;
//               z-index: 2;
//               height: 100%;
//               display: flex;
//               flex-direction: column;
//               padding: 20px;
//             }

//             /* University Header */
//             .university-header {
//               text-align: center;
//               margin-bottom: 10px;
//             }

//             .university-name {
//               font-size: 14px;
//               font-weight: 700;
//               color: #003366;
//               letter-spacing: 0.5px;
//               margin: 0;
//               line-height: 1.2;
//               text-transform: uppercase;
//             }

//             .university-department {
//               font-size: 10px;
//               font-weight: 600;
//               color: #1D7AD9;
//               margin: 3px 0 0 0;
//             }

//             .university-address {
//               font-size: 8px;
//               color: #666;
//               margin: 2px 0 0 0;
//               font-weight: 500;
//             }

//             /* Card Title */
//             .card-title {
//               text-align: center;
//               font-size: 10px;
//               font-weight: 600;
//               color: #003366;
//               margin: 5px 0 15px 0;
//               letter-spacing: 1px;
//               text-transform: uppercase;
//               border-bottom: 1px solid rgba(0, 51, 102, 0.1);
//               padding-bottom: 5px;
//             }

//             /* Student Info Section */
//             .student-info {
//               display: flex;
//               gap: 15px;
//               flex: 1;
//             }

//             .photo-section {
//               width: 90px;
//               display: flex;
//               flex-direction: column;
//               align-items: center;
//             }

//             .photo-container {
//               width: 80px;
//               height: 100px;
//               background: white;
//               border-radius: 5px;
//               overflow: hidden;
//               border: 2px solid #1D7AD9;
//               box-shadow: 0 2px 6px rgba(0,0,0,0.15);
//             }

//             .photo-container img {
//               width: 100%;
//               height: 100%;
//               object-fit: cover;
//             }

//             .photo-label {
//               font-size: 8px;
//               color: #666;
//               margin-top: 3px;
//               font-weight: 600;
//               text-align: center;
//             }

//             /* Details Section */
//             .details-section {
//               flex: 1;
//               display: flex;
//               flex-direction: column;
//               justify-content: space-between;
//             }

//             .details-grid {
//               display: grid;
//               grid-template-columns: 1fr;
//               gap: 6px;
//             }

//             .detail-row {
//               display: flex;
//               align-items: center;
//             }

//             .detail-label {
//               font-size: 9px;
//               font-weight: 700;
//               color: #003366;
//               min-width: 85px;
//               display: inline-block;
//             }

//             .detail-value {
//               font-size: 10px;
//               font-weight: 600;
//               color: #222;
//               flex: 1;
//               padding-left: 5px;
//             }

//             /* Signature Section */
//             .signature-section {
//               margin-top: 10px;
//               text-align: center;
//             }

//             .signature-line {
//               width: 150px;
//               height: 1px;
//               background: #333;
//               margin: 0 auto;
//               margin-top: 20px;
//             }

//             .signature-text {
//               font-size: 8px;
//               color: #666;
//               margin-top: 3px;
//             }

//             /* Back Card Styling */
//             .back {
//               background-image: url('${backBackground}');
//               background-size: 100% 100%;
//               background-position: center;
//               background-repeat: no-repeat;
//               position: relative;
//             }

//             .back-content {
//               position: relative;
//               z-index: 2;
//               height: 100%;
//               display: flex;
//               flex-direction: column;
//               padding: 25px;
//             }

//             .back-text-container {
//               flex: 1;
//               display: flex;
//               flex-direction: column;
//               justify-content: center;
//               text-align: center;
//             }

//             .back-text {
//               font-size: 11px;
//               line-height: 1.6;
//               margin-bottom: 15px;
//               color: #333;
//               font-weight: 500;
//             }

//             .return-text {
//               font-size: 11px;
//               line-height: 1.6;
//               color: #333;
//               font-weight: 500;
//             }

//             .signature-area {
//               margin-top: auto;
//               padding-top: 15px;
//               border-top: 1px solid rgba(0, 0, 0, 0.2);
//             }

//             .signature-label {
//               font-size: 9px;
//               font-weight: 700;
//               color: #333;
//               margin: 0;
//               text-align: center;
//             }

//             /* Print-specific styles */
//             @media print {
//               body {
//                 background: none !important;
//                 padding: 0 !important;
//                 margin: 0 !important;
//               }

//               .card-container {
//                 gap: 20px !important;
//                 margin: 0 !important;
//               }

//               .card {
//                 box-shadow: none !important;
//                 border: 1px solid #ddd !important;
//                 page-break-inside: avoid !important;
//               }

//               .no-print {
//                 display: none !important;
//               }
//             }

//             /* Utility Classes */
//             .text-center {
//               text-align: center;
//             }

//             .text-uppercase {
//               text-transform: uppercase;
//             }

//             .font-bold {
//               font-weight: 700;
//             }

//             .mt-2 {
//               margin-top: 8px;
//             }

//             .mt-3 {
//               margin-top: 12px;
//             }

//             .mb-2 {
//               margin-bottom: 8px;
//             }

//             .mb-3 {
//               margin-bottom: 12px;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="card-container">
//             <!-- Front of ID Card -->
//             <div class="card front">
//               <div class="front-content">
//                 <div class="university-header">
//                   <h1 class="university-name text-uppercase">University of Port Harcourt</h1>
//                   <p class="university-department">Department of Computer Science</p>
//                   <p class="university-address">East-West Road, Choba, Port Harcourt, Rivers State</p>
//                 </div>

//                 <h2 class="card-title">Student Department Identity Card</h2>

//                 <div class="student-info">
//                   <div class="photo-section">
//                     <div class="photo-container">
//                       <img src="${capturedPhoto}" alt="${
//         currentStudent.name
//       }" />
//                     </div>
//                     <div class="photo-label">OFFICIAL PHOTO</div>
//                   </div>

//                   <div class="details-section">
//                     <div class="details-grid">
//                       <div class="detail-row">
//                         <span class="detail-label">NAME:</span>
//                         <span class="detail-value font-bold">${
//                           currentStudent.name
//                         }</span>
//                       </div>

//                       <div class="detail-row">
//                         <span class="detail-label">MATRIC NO.:</span>
//                         <span class="detail-value">${
//                           currentStudent.matric
//                         }</span>
//                       </div>

//                       <div class="detail-row">
//                         <span class="detail-label">FACULTY:</span>
//                         <span class="detail-value">${
//                           currentStudent.faculty
//                         }</span>
//                       </div>

//                       <div class="detail-row">
//                         <span class="detail-label">DEPT:</span>
//                         <span class="detail-value">${
//                           currentStudent.department
//                         }</span>
//                       </div>

//                       <div class="detail-row">
//                         <span class="detail-label">EXPIRY DATE:</span>
//                         <span class="detail-value">${new Date(
//                           currentStudent.graduationDate
//                         ).toLocaleDateString("en-GB", {
//                           day: "2-digit",
//                           month: "short",
//                           year: "numeric",
//                         })}</span>
//                       </div>
//                     </div>

//                     <div class="signature-section">
//                       <div class="signature-line"></div>
//                       <div class="signature-text">Authorized Signature & Stamp</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <!-- Back of ID Card -->
//             <div class="card back">
//               <div class="back-content">
//                 <div class="back-text-container">
//                   <p class="back-text">
//                     The holder whose name and photograph appear on this I.D. Card is a bonafide student of the University of Port Harcourt
//                   </p>
//                   <p class="return-text">
//                     If found please return to the office of the Chief Security Officer University of Port Harcourt
//                   </p>
//                 </div>

//                 <div class="signature-area">
//                   <p class="signature-label">Department Admin's Signature</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <script>
//             // Auto-print and close window
//             window.onload = function() {
//               // Small delay to ensure images are loaded
//               setTimeout(function() {
//                 window.focus();
//                 window.print();
//               }, 800);

//               // Close window after printing or if print is cancelled
//               window.onafterprint = function() {
//                 window.close();
//               };

//               // Fallback: close window after 10 seconds if print dialog doesn't open
//               setTimeout(function() {
//                 window.close();
//               }, 10000);
//             };

//             // Handle page load errors
//             window.onerror = function() {
//               setTimeout(function() {
//                 window.print();
//               }, 1000);
//             };
//           </script>
//         </body>
//       </html>
//     `);
//       printWindow.document.close();
//     } else {
//       console.error("Cannot open print window: Missing student data or photo");
//     }
//   };
//   const handleDownloadID = () => {
//     if (capturedPhoto && currentStudent) {
//       const link = document.createElement("a");
//       link.href = capturedPhoto;
//       link.download = `ID_${currentStudent.idNo}.png`;
//       link.click();
//     }
//   };

//   return (
//     <div className="animate-in fade-in duration-500 max-w-[1400px] mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-900">
//             ID Card Issuance
//           </h2>
//           <p className="text-xs text-slate-500 mt-1">
//             Issue ID cards to students by selecting them from the list below
//           </p>
//         </div>
//         <button className="bg-[#1D7AD9] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all w-full sm:w-auto justify-center">
//           <Plus size={18} /> Add New Student
//         </button>
//       </div>

//       {/* Search and Filter */}
//       <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
//         <div className="relative w-full sm:flex-1 group">
//           <input
//             type="text"
//             placeholder="Search by name or ID..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//             className="bg-white border border-slate-200 text-xs py-2.5 pl-4 pr-10 rounded-xl outline-none w-full focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 shadow-sm"
//           />
//           <Search
//             size={16}
//             className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
//           />
//         </div>
//         <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm w-full sm:w-auto">
//           Filter
//           <Filter size={14} className="text-slate-900" />
//         </button>
//       </div>

//       {/* Loading and Error States */}
//       {loading && (
//         <div className="flex justify-center items-center py-10">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           <span className="ml-2 text-sm text-slate-600">
//             Loading students...
//           </span>
//         </div>
//       )}

//       {error && !loading && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
//           <p className="font-semibold">Error loading students</p>
//           <p className="text-sm">{error}</p>
//           <button
//             onClick={() => fetchStudents(1, searchQuery)}
//             className="mt-2 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded"
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       {/* Students Table */}
//       {!loading && !error && (
//         <>
//           <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm mb-6">
//             <div className="overflow-x-auto scrollbar-hide">
//               <table className="w-full text-left min-w-[800px]">
//                 <thead>
//                   <tr className="bg-slate-50/50 text-slate-500 font-bold text-[10px] uppercase tracking-wider border-b border-slate-100">
//                     <th className="px-6 py-5 w-12 text-center">
//                       <input
//                         type="checkbox"
//                         checked={
//                           selectedStudents.size > 0 &&
//                           selectedStudents.size ===
//                             students.filter((s) => s.hasPaidIDCardFee).length
//                         }
//                         onChange={toggleAllSelection}
//                         className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10"
//                       />
//                     </th>
//                     <th className="px-6 py-5">ID No</th>
//                     <th className="px-6 py-5">Name</th>
//                     <th className="px-6 py-5">Matric</th>
//                     <th className="px-6 py-5">Faculty</th>
//                     <th className="px-6 py-5">Department</th>
//                     <th className="px-6 py-5 text-center">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-50">
//                   {students.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={7}
//                         className="px-6 py-10 text-center text-sm text-slate-500"
//                       >
//                         {searchQuery
//                           ? "No students found matching your search"
//                           : "No students found"}
//                       </td>
//                     </tr>
//                   ) : (
//                     students.map((student) => (
//                       <tr
//                         key={student.id}
//                         className="hover:bg-slate-50/30 transition-colors"
//                       >
//                         <td className="px-6 py-5 text-center">
//                           <input
//                             type="checkbox"
//                             checked={selectedStudents.has(student.id)}
//                             onChange={() => toggleStudentSelection(student.id)}
//                             className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10"
//                             disabled={!canIssueCard(student)}
//                           />
//                         </td>
//                         <td className="px-6 py-5 text-[11px] text-slate-400 font-medium">
//                           {student.idNo}
//                         </td>
//                         <td className="px-6 py-5 text-xs font-bold text-slate-700">
//                           {student.name}
//                           {student.hasPaidIDCardFee && (
//                             <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
//                               Paid
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-6 py-5 text-xs text-slate-500">
//                           {student.matric}
//                         </td>
//                         <td className="px-6 py-5 text-xs text-slate-500">
//                           {student.faculty}
//                         </td>
//                         <td className="px-6 py-5 text-xs text-slate-500">
//                           {student.department}
//                         </td>
//                         <td className="px-6 py-5 text-center">
//                           <button
//                             onClick={() => handleIssueCard(student)}
//                             disabled={!canIssueCard(student)}
//                             className={`text-xs font-bold transition-colors ${
//                               canIssueCard(student)
//                                 ? "text-blue-600 hover:text-blue-700 cursor-pointer"
//                                 : "text-slate-300 cursor-not-allowed"
//                             }`}
//                           >
//                             {canIssueCard(student)
//                               ? "Issue Card"
//                               : "Payment Required"}
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Pagination */}
//           {pagination.totalPages > 1 && (
//             <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4 rounded-b-2xl">
//               <div className="flex items-center gap-2 text-sm text-slate-600">
//                 <span>Total:</span>
//                 <span className="font-semibold">
//                   {pagination.totalItems} students
//                 </span>
//               </div>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => handlePageChange(1)}
//                   disabled={pagination.currentPage === 1}
//                   className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
//                 >
//                   <ChevronsLeft size={16} className="text-slate-600" />
//                 </button>
//                 <button
//                   onClick={() => handlePageChange(pagination.currentPage - 1)}
//                   disabled={pagination.currentPage === 1}
//                   className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
//                 >
//                   <ChevronLeft size={16} className="text-slate-600" />
//                 </button>

//                 <div className="flex items-center gap-1 mx-2">
//                   <span className="text-sm text-slate-600">
//                     Page {pagination.currentPage} of {pagination.totalPages}
//                   </span>
//                 </div>

//                 <button
//                   onClick={() => handlePageChange(pagination.currentPage + 1)}
//                   disabled={pagination.currentPage === pagination.totalPages}
//                   className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
//                 >
//                   <ChevronRight size={16} className="text-slate-600" />
//                 </button>
//                 <button
//                   onClick={() => handlePageChange(pagination.totalPages)}
//                   disabled={pagination.currentPage === pagination.totalPages}
//                   className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
//                 >
//                   <ChevronsRight size={16} className="text-slate-600" />
//                 </button>
//               </div>

//               <div className="text-sm text-slate-500">
//                 Showing {students.length} of {pagination.totalItems}
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
//             {/* Modal Header */}
//             <div className="flex justify-between items-center p-6 border-b border-slate-100">
//               <h3 className="text-lg font-bold text-slate-900">
//                 Capture and Preview ID Card - {currentStudent?.name}
//               </h3>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
//               >
//                 <X size={20} className="text-slate-600" />
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6 flex flex-col gap-8">
//               {/* Camera Capture Section */}
//               <div className="flex flex-col items-center gap-4">
//                 <h4 className="text-sm font-semibold text-slate-900">
//                   Capture Photo
//                 </h4>
//                 <div className="w-full bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center relative">
//                   {!capturedPhoto ? (
//                     <>
//                       <video
//                         ref={videoRef}
//                         autoPlay
//                         playsInline
//                         muted
//                         className="w-full h-full object-cover"
//                       />
//                       {!cameraActive && (
//                         <div className="absolute flex flex-col items-center gap-4">
//                           <Camera size={64} className="text-slate-300" />
//                           <p className="text-white text-sm">
//                             Initializing camera...
//                           </p>
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <img
//                       src={capturedPhoto || "/placeholder.svg"}
//                       alt="Captured"
//                       className="w-full h-full object-cover"
//                     />
//                   )}
//                 </div>
//                 <canvas
//                   ref={canvasRef}
//                   width={640}
//                   height={480}
//                   className="hidden"
//                 />

//                 {!capturedPhoto && (
//                   <button
//                     onClick={captureImage}
//                     className="bg-[#1D7AD9] text-white px-8 py-3 rounded-lg flex items-center gap-2 font-bold hover:bg-blue-700 transition-all w-full justify-center shadow-lg shadow-blue-500/20"
//                   >
//                     <Camera size={18} /> Capture Image
//                   </button>
//                 )}

//                 {capturedPhoto && (
//                   <button
//                     onClick={() => {
//                       setCapturedPhoto(null);
//                       startCamera();
//                       setCameraActive(true);
//                     }}
//                     className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
//                   >
//                     Retake Photo
//                   </button>
//                 )}
//               </div>

//               {/* Upload Status Messages */}
//               {uploadingPhoto && (
//                 <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                   <span>Uploading photo to server...</span>
//                 </div>
//               )}

//               {uploadSuccess && (
//                 <div className="text-center text-sm text-green-600 bg-green-50 py-2 rounded-lg">
//                   ✓ Photo uploaded successfully!
//                 </div>
//               )}

//               {uploadError && (
//                 <div className="text-center text-sm text-red-600 bg-red-50 py-2 rounded-lg">
//                   {uploadError}
//                 </div>
//               )}

//               {/* ID Card Preview Section */}
//               {capturedPhoto && (
//                 <div className="flex flex-col gap-4">
//                   <h4 className="text-sm font-semibold text-slate-900">
//                     ID Card Preview
//                   </h4>
//                   <div className="grid grid-cols-2 gap-6">
//                     {/* Front of Card */}
//                     <div className="flex flex-col items-center">
//                       <p className="text-xs font-semibold text-slate-600 mb-3">
//                         Front
//                       </p>
//                       <div className="w-full bg-gradient-to-br from-[#1D7AD9] to-[#0052A3] rounded-lg p-4 aspect-video flex flex-col justify-between text-white relative overflow-hidden">
//                         <div className="relative z-10">
//                           <p className="text-xs font-bold mb-1">
//                             UNIVERSITY OF PORT HARCOURT
//                           </p>
//                           <p className="text-[10px] opacity-90">
//                             {currentStudent?.faculty}
//                           </p>
//                           <p className="text-[9px] opacity-75">
//                             Port Harcourt, Nigeria
//                           </p>
//                         </div>

//                         <div className="flex gap-3 relative z-10">
//                           <div className="w-16 h-20 bg-white rounded overflow-hidden flex-shrink-0">
//                             <img
//                               src={capturedPhoto || "/placeholder.svg"}
//                               alt="Student"
//                               className="w-full h-full object-cover"
//                             />
//                           </div>
//                           <div className="flex-1 flex flex-col justify-between text-[9px]">
//                             <div>
//                               <p className="font-bold text-xs">
//                                 {currentStudent?.name}
//                               </p>
//                               <p className="opacity-90">
//                                 ID: {currentStudent?.idNo}
//                               </p>
//                               <p className="opacity-90">
//                                 Matric: {currentStudent?.matric}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="opacity-75">
//                                 Faculty: {currentStudent?.faculty}
//                               </p>
//                               <p className="opacity-75">
//                                 Dept: {currentStudent?.department}
//                               </p>
//                               <p className="opacity-75">
//                                 Expires:{" "}
//                                 {new Date(
//                                   currentStudent?.graduationDate || ""
//                                 ).toLocaleDateString()}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Back of Card */}
//                     <div className="flex flex-col items-center">
//                       <p className="text-xs font-semibold text-slate-600 mb-3">
//                         Back
//                       </p>
//                       <div className="w-full bg-white border-2 border-[#1D7AD9] rounded-lg p-4 aspect-video flex flex-col justify-between text-center overflow-hidden">
//                         <div className="flex-1 flex flex-col justify-center gap-3">
//                           <p className="text-[9px] leading-relaxed text-slate-700 font-medium">
//                             The holder whose name and photograph on this I.D
//                             card is a bonafide student of the university of port
//                             harcourt.
//                           </p>
//                           <p className="text-[9px] leading-relaxed text-slate-700 font-medium">
//                             If found please return to the office of Chief
//                             Security Officer university of port harcourt.
//                           </p>
//                         </div>
//                         <div className="border-t border-slate-300 pt-2">
//                           <p className="text-[8px] text-slate-600 font-semibold">
//                             Department Admin
//                           </p>
//                           <p className="text-[8px] text-slate-500 mt-1">
//                             ________________
//                           </p>
//                           <p className="text-[8px] text-slate-500">Signature</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Action Buttons */}
//             {capturedPhoto && currentStudent && (
//               <div className="flex gap-3 p-6 border-t border-slate-100 bg-slate-50">
//                 <button
//                   onClick={() =>
//                     handlePhotoUploadAndAction(
//                       currentStudent.matric,
//                       capturedPhoto,
//                       "print"
//                     )
//                   }
//                   disabled={uploadingPhoto}
//                   className="bg-green-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold hover:bg-green-700 transition-all flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {uploadingPhoto ? (
//                     <>
//                       <Loader2 size={18} className="animate-spin" />{" "}
//                       Uploading...
//                     </>
//                   ) : (
//                     <>
//                       <Printer size={18} /> Print ID
//                     </>
//                   )}
//                 </button>
//                 <button
//                   onClick={() =>
//                     handlePhotoUploadAndAction(
//                       currentStudent.matric,
//                       capturedPhoto,
//                       "download"
//                     )
//                   }
//                   disabled={uploadingPhoto}
//                   className="bg-blue-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold hover:bg-blue-700 transition-all flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {uploadingPhoto ? (
//                     <>
//                       <Loader2 size={18} className="animate-spin" />{" "}
//                       Uploading...
//                     </>
//                   ) : (
//                     <>
//                       <Download size={18} /> Download ID
//                     </>
//                   )}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
