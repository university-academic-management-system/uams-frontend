"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Filter,
  Search,
  Camera,
  Printer,
  Download,
  X,
  Loader2,
  Upload,
  Trash,
} from "lucide-react";
import api from "../api/axios";
import { idCardApi } from "../api/idcardapi";
import toast, { Toaster } from "react-hot-toast";

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
  avatar: string;
}

interface ApiStudent {
  id: string;
  studentId: string;
  user: { fullName: string; email: string; phone: string | null; id: string; avatar: string };
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
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toggle selection for a single student
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map((s) => s.id));
    }
  };

  // --- API Logic ---
  const fetchStudents = async (search = "") => {
    try {
      setLoading(true);
      const response = await api.get(`/university-admin/students`, {
        params: { search, limit: 20 },
      });

      const transformed: Student[] = response.data.students.map(
        (s: ApiStudent) => ({
          avatar: s.user?.avatar || "",
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
      console.error("Failed to fetch students", err);
      toast.error("Failed to load students");
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
        const photoData = canvasRef.current.toDataURL("image/jpeg", 0.9);
        setCapturedPhoto(photoData);
        stopCamera();
        toast.success("Photo captured!");
      }
    }
  };

  const handleIssueCard = (student: Student) => {
    setCurrentStudent(student);
    setCapturedPhoto(null);
    setShowModal(true);
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  // --- Upload Image Handler ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large! Max size is 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCapturedPhoto(reader.result as string);
      stopCamera();
      toast.success("Image selected successfully!");
    };
    reader.readAsDataURL(file);
  };

  // --- Upload Photo to Server ---
  const uploadPhotoToServer = async (): Promise<boolean> => {
    if (!currentStudent || !capturedPhoto) return false;

    setUploadingPhoto(true);
    setUploadError(null);

    try {
      const response = await fetch(capturedPhoto);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("avatar", blob, `${currentStudent.matric}.jpg`);

      await api.put(
        `/department-admins/students/avatar?studentId=${currentStudent.matric}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Photo uploaded successfully!");
      return true;
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(
        err.response?.data?.message || "Failed to save photo to server."
      );
      toast.error(`Upload failed: ${uploadError || "Unknown error"}`);
      return false;
    } finally {
      setUploadingPhoto(false);
    }
  };

  // --- Generate ID Card PDF ---
  const generateIDCardPDF = async () => {
    if (!currentStudent || !capturedPhoto) {
      toast.error("No student or photo selected");
      return;
    }

    setGeneratingPDF(true);

    try {
      // First upload the photo to server
      const uploadSuccess = await uploadPhotoToServer();
      if (!uploadSuccess) {
        toast.error("Failed to upload photo. PDF generation aborted.");
        setGeneratingPDF(false);
        return;
      }

      // Dynamically import jsPDF (reduces initial bundle size)
      const { jsPDF } = await import("jspdf");

      // ID Card dimensions in mm (standard ID card size: 85.6 x 54 mm)
      const cardWidth = 85.6;
      const cardHeight = 54;

      // Create PDF document
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [cardWidth, cardHeight],
      });

      // Load template images
      const frontTemplate = new Image();
      frontTemplate.src = "/departmental-admin/idcard-front.png";

      const backTemplate = new Image();
      backTemplate.src = "/departmental-admin/idcard-back.png";

      // Create a promise to wait for template images to load
      await new Promise<void>((resolve) => {
        frontTemplate.onload = () => {
          // Add front template
          doc.addImage(frontTemplate, "PNG", 0, 0, cardWidth, cardHeight);

          // Add student photo (positioned based on template)
          // Coordinates and dimensions calculated from your template
          const photoX = 5.5; // 6.5% of 85.6mm
          const photoY = 20.5; // 38% of 54mm
          const photoWidth = 19.7; // 23% of 85.6mm
          const photoHeight = 23.1; // 43% of 54mm

          doc.addImage(
            capturedPhoto,
            "JPEG",
            photoX,
            photoY,
            photoWidth,
            photoHeight
          );

          // Add student information
          doc.setFontSize(3.5);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 0, 0); // Black text

          // Text starting position
          const textX = 27; // 32% of 85.6mm
          let textY = 23; // 42.5% of 54mm
          const lineHeight = 3.8;

          // Student information lines
          const infoLines = [
            `NAME: ${currentStudent.name}`,
            `MATRIC NO.: ${currentStudent.matric}`,
            `FACULTY: ${currentStudent.faculty}`,
            `DEPT: ${currentStudent.department}`,
            `EXPIRY DATE: ${currentStudent.graduationDate}`,
          ];

          // Add each line of text
          infoLines.forEach((line, index) => {
            // Wrap text if too long
            const maxWidth = cardWidth - textX - 5;
            const lines = doc.splitTextToSize(line, maxWidth);

            if (lines.length > 1) {
              // Handle multi-line text
              lines.forEach((lineText: string, lineIndex: number) => {
                doc.text(
                  lineText,
                  textX,
                  textY + index * lineHeight + lineIndex * 1.5
                );
              });
            } else {
              doc.text(line, textX, textY + index * lineHeight);
            }
          });

          // Add page for back of ID card
          doc.addPage([cardWidth, cardHeight], "landscape");

          // Wait for back template to load
          backTemplate.onload = () => {
            doc.addImage(backTemplate, "PNG", 0, 0, cardWidth, cardHeight);

            // Add disclaimer text on back (if needed)
            doc.setFontSize(2.5);
            doc.setFont("helvetica", "normal");
            // // doc.text(
            // //   "The holder whose name and photograph appear on this I.D. Card is a bonafide student of the University of Port Harcourt",
            // //   5,
            // //   25,
            // //   { maxWidth: cardWidth - 10, align: "center" }
            // );

            // doc.text(
            //   "If found please return to the office of the Chief Security Officer University of Port Harcourt",
            //   5,
            //   35,
            //   { maxWidth: cardWidth - 10, align: "center" }
            // );

            resolve();
          };
        };
      });

      // Save the PDF with student name
      const fileName = `${currentStudent.name.replace(
        /\s+/g,
        "_"
      )}_ID_Card.pdf`;
      doc.save(fileName);

      toast.success("ID Card PDF generated successfully!");

      // Close modal after successful generation
      setTimeout(() => {
        setShowModal(false);
        setCapturedPhoto(null);
        stopCamera();
      }, 1500);
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  // --- Generate Single PDF for Both Sides ---
  const generateSinglePagePDF = async () => {
    if (!currentStudent || !capturedPhoto) return;

    setGeneratingPDF(true);

    try {
      const { jsPDF } = await import("jspdf");

      // Letter size for printing both sides
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "letter",
      });

      // ID Card dimensions scaled up for printing
      const cardWidth = 85.6;
      const cardHeight = 54;
      const scale = 2; // Scale up for better print quality

      const scaledWidth = cardWidth * scale;
      const scaledHeight = cardHeight * scale;

      // Center on page
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const frontX = (pageWidth - scaledWidth) / 2;
      const frontY = 20;

      const backX = frontX;
      const backY = frontY + scaledHeight + 20;

      // Load templates
      const frontTemplate = new Image();
      frontTemplate.src = "/departmental-admin/idcard-front.png";

      const backTemplate = new Image();
      backTemplate.src = "/departmental-admin/idcard-back.png";

      await new Promise<void>((resolve) => {
        frontTemplate.onload = () => {
          // Front of ID card
          doc.addImage(
            frontTemplate,
            "PNG",
            frontX,
            frontY,
            scaledWidth,
            scaledHeight
          );

          // Student photo on front
          const photoX = frontX + 5.5 * scale;
          const photoY = frontY + 20.5 * scale;
          const photoWidth = 19.7 * scale;
          const photoHeight = 23.1 * scale;

          doc.addImage(
            capturedPhoto,
            "JPEG",
            photoX,
            photoY,
            photoWidth,
            photoHeight
          );

          // Student info on front
          doc.setFontSize(3.5 * scale);
          doc.setFont("helvetica", "bold");

          const textX = frontX + 27 * scale;
          let textY = frontY + 23 * scale;
          const lineHeight = 3.8 * scale;

          const infoLines = [
            `NAME: ${currentStudent.name}`,
            `MATRIC NO.: ${currentStudent.matric}`,
            `FACULTY: ${currentStudent.faculty}`,
            `DEPT: ${currentStudent.department}`,
            `EXPIRY DATE: ${currentStudent.graduationDate}`,
          ];

          infoLines.forEach((line, index) => {
            doc.text(line, textX, textY + index * lineHeight);
          });

          // Back of ID card
          backTemplate.onload = () => {
            doc.addImage(
              backTemplate,
              "PNG",
              backX,
              backY,
              scaledWidth,
              scaledHeight
            );

            // Back text
            doc.setFontSize(2.5 * scale);
            doc.setFont("helvetica", "normal");

            const backTextY = backY + 25 * scale;
            // doc.text(
            //   "The holder whose name and photograph appear on this I.D. Card is a bonafide student of the University of Port Harcourt",
            //   backX + 5 * scale,
            //   backTextY,
            //   { maxWidth: scaledWidth - 10 * scale, align: "center" }
            // );

            // doc.text(
            //   "If found please return to the office of the Chief Security Officer University of Port Harcourt",
            //   backX + 5 * scale,
            //   backTextY + 12 * scale,
            //   { maxWidth: scaledWidth - 10 * scale, align: "center" }
            // );

            doc.text(
              "Department Admin's Signature",
              backX + scaledWidth / 2,
              backY + scaledHeight - 10 * scale,
              { align: "center" }
            );

            resolve();
          };
        };
      });

      // Add print instruction
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Print this page, cut along the dotted lines, and laminate to create the ID card.",
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );

      const fileName = `${currentStudent.name.replace(
        /\s+/g,
        "_"
      )}_ID_Card_Print.pdf`;
      doc.save(fileName);

      toast.success("Printable ID Card PDF generated!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setGeneratingPDF(false);
    }
  };

  // --- Bulk Download Handlers ---
  const handleBulkDownloadIDCards = async () => {
    if (selectedIds.length === 0) return;
    try {
        const toastId = toast.loading("Fetching template & downloading ID Cards...");
        
        // 1. Fetch default template ID
        const templateResponse = await idCardApi.getDefaultIDCard();
        const templateId = templateResponse?.template?.id;

        if (!templateId) {
             toast.error("Could not find default ID Card template", { id: toastId });
             return;
        }

        // 2. Trigger download with templateId
        const blob = await idCardApi.bulkDownloadIDCards(selectedIds, templateId);
        
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ID_Cards.zip'); 
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        
        toast.success("Download started", { id: toastId });
        setSelectedIds([]); 
    } catch (error: any) {
        console.error("Failed to download ID Cards:", error);
        toast.error("Failed to download items");
    }
  };

  const handleBulkDownloadBanner = async () => {
    if (selectedIds.length === 0) return;
    try {
        const toastId = toast.loading("Downloading Banner...");
        const blob = await idCardApi.bulkDownloadBanner(selectedIds);
        
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Banners.zip'); // Adjust extension if needed (e.g. .pdf)
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        
        toast.success("Download started", { id: toastId });
        setSelectedIds([]);
    } catch (error: any) {
        console.error("Failed to download Banner:", error);
        toast.error("Failed to download items");
    }
  };

  // --- Handle PDF Generation with Options ---
  const handleGeneratePDF = async () => {
    // Show confirmation toast with options
    toast.custom(
      (t) => (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <h4 className="font-bold mb-2">Generate ID Card PDF</h4>
          <p className="text-sm text-slate-600 mb-4">Choose PDF format:</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                generateIDCardPDF();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Standard ID Card
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                generateSinglePagePDF();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
            >
              Printable Sheet
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <Toaster position="top-right" reverseOrder={false} />

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
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-100 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500/20"
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
              <th className="px-6 py-4 w-12 text-center">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                  checked={selectedIds.length === students.length && students.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-4 w-16"></th> {/* Image Column */}
              <th className="px-6 py-4">Student Name</th>
              <th className="px-6 py-4">Matric No</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-medium">
                      Fetching students…
                    </span>
                  </div>
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  No students found
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  className={`hover:bg-slate-50/50 transition-colors group ${
                    selectedIds.includes(student.id) ? "bg-blue-50/30" : ""
                  }`}
                  onClick={() => toggleSelection(student.id)}
                >
                  <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                      checked={selectedIds.includes(student.id)}
                      onChange={() => toggleSelection(student.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                       <img 
                          src={
                            student.avatar 
                              ? (student.avatar.startsWith('data:') ? student.avatar : `data:image/jpeg;base64,${student.avatar}`)
                              : `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`
                          } 
                          alt={student.name}
                          className="h-full w-full object-cover"
                        />
                    </div>
                  </td>
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
              ))
            )}
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
                      alt="Captured student photo"
                    />
                  )}
                </div>

                {!capturedPhoto ? (
                  <div className="flex gap-3 w-full">
                    {/* Capture Button */}
                    <button
                      onClick={captureImage}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700"
                    >
                      <Camera size={18} /> Capture Photo
                    </button>

                    {/* Upload Button */}
                    <label className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-200">
                      <Upload size={18} />
                      Upload Image (≤ 5MB)
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        ref={fileInputRef}
                      />
                    </label>
                  </div>
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
                        src="/departmental-admin/idcard-front.png"
                        className="w-full h-full"
                        alt="Front Template"
                      />
                      <img
                        src={capturedPhoto}
                        className="absolute top-[38%] left-[6.5%] w-[23%] h-[43%] object-cover border border-white"
                        alt="Student"
                      />
                      <div className="absolute left-[32%] top-[42.5%] w-[45%] text-[7px] font-bold text-black uppercase">
                        <div className="flex flex-col gap-y-[8.5px] leading-none">
                          <div className="flex items-start">
                            <span className="mr-[5px] whitespace-nowrap">
                              NAME:
                            </span>
                            <span className="whitespace-nowrap">
                              {currentStudent?.name}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="mr-[5px] whitespace-nowrap">
                              MATRIC NO.:
                            </span>
                            <span className="whitespace-nowrap">
                              {currentStudent?.matric}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="mr-[5px] whitespace-nowrap">
                              FACULTY:
                            </span>
                            <span className="whitespace-nowrap">
                              {currentStudent?.faculty}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="mr-[5px] whitespace-nowrap">
                              DEPT:
                            </span>
                            <span className="break-words leading-tight">
                              {currentStudent?.department}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="mr-[5px] whitespace-nowrap">
                              EXPIRY DATE:
                            </span>
                            <span className="whitespace-nowrap">
                              {currentStudent?.graduationDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Back View */}
                    <div className="aspect-[400/250] rounded-xl border border-slate-200 overflow-hidden shadow-lg">
                      <img
                        src="/departmental-admin/idcard-back.png"
                        className="w-full h-full"
                        alt="Back Template"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-slate-50 border-t flex gap-4">
              <button
                onClick={handleGeneratePDF}
                disabled={!capturedPhoto || uploadingPhoto || generatingPDF}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-green-100"
              >
                {generatingPDF ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Generating PDF...
                  </>
                ) : uploadingPhoto ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    Generate ID Card PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Bar */}
      {selectedIds.length > 1 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-xl shadow-2xl border border-gray-100 flex items-center gap-6 z-50 animate-in slide-in-from-bottom duration-300">
          <span className="text-sm font-bold text-slate-700">
            {selectedIds.length} items selected
          </span>
          <div className="h-6 w-px bg-slate-200"></div>
          <button 
            onClick={handleBulkDownloadBanner}
            className="flex items-center gap-2 bg-[#1D7AD9] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            Bulk Download Banner
          </button>
          <button 
            onClick={handleBulkDownloadIDCards}
            className="flex items-center gap-2 bg-[#1D7AD9] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            Bulk Download ID-Cards
          </button>
        </div>
      )}

      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden" width={640} height={480} />
    </div>
  );
};
