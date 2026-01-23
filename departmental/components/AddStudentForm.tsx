import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface AddStudentFormProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

export const AddStudentForm: React.FC<AddStudentFormProps> = ({ onClose, onSubmit, initialData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    regNo: initialData?.regNo || "",
    matNo: initialData?.matNo || "",
    firstName: initialData?.surname || "", // Mapping surname to firstName for now if form expects firstName/otherName
    otherName: initialData?.otherNames || "",
    sex: initialData?.sex || "",
    admissionMode: initialData?.admissionMode || "",
    entryQualification: initialData?.entryQualification || "",
    facultyName: initialData?.faculty || "", // Map faculty
    degreeCourse: initialData?.department || "", // Map department 
    departmentName: initialData?.department || "", 
    degreeAwarded: initialData?.role === "Bachelors" ? "B.Sc" : initialData?.role || "",
    programDuration: initialData?.programDuration || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-[#1273D4] mb-8">
            {initialData ? "Edit Student" : "Add Student"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField
                label="Reg No."
                name="regNo"
                placeholder="202440965974BA"
                value={formData.regNo}
                onChange={handleChange}
              />
              <FormField
                label="Mat No."
                name="matNo"
                placeholder="U2024/5570001"
                value={formData.matNo}
                onChange={handleChange}
              />
              <FormField
                label="First Name"
                name="firstName"
                placeholder="DEEZIA"
                value={formData.firstName}
                onChange={handleChange}
              />
              <FormField
                label="Other Name"
                name="otherName"
                placeholder="GOODLUCK BLEEBEST"
                value={formData.otherName}
                onChange={handleChange}
              />
              <FormField
                label="Sex"
                name="sex"
                placeholder="Male"
                value={formData.sex}
                onChange={handleChange}
              />
              <FormField
                label="Admission Mode"
                name="admissionMode"
                placeholder="UTME"
                value={formData.admissionMode}
                onChange={handleChange}
              />
              <FormField
                label="Entry Qualification"
                name="entryQualification"
                placeholder="O-LEVEL"
                value={formData.entryQualification}
                onChange={handleChange}
              />
              <FormField
                label="Faculty Name"
                name="facultyName"
                placeholder="COMPUTING"
                value={formData.facultyName}
                onChange={handleChange}
              />
              <FormField
                label="Degree Course"
                name="degreeCourse"
                placeholder="COMPUTER SCIENCE"
                value={formData.degreeCourse}
                onChange={handleChange}
              />
              <FormField
                label="Department Name"
                name="departmentName"
                placeholder="COMPUTER SCIENCE"
                value={formData.departmentName}
                onChange={handleChange}
              />
              <FormField
                label="Degree Awarded"
                name="degreeAwarded"
                placeholder="B.SC"
                value={formData.degreeAwarded}
                onChange={handleChange}
              />
              <FormField
                label="Program Duration"
                name="programDuration"
                placeholder="4"
                value={formData.programDuration}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-4 mt-12 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-lg bg-[#1273D4] text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                {initialData ? "Save Changes" : "Add Student"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  name, 
  placeholder, 
  value, 
  onChange 
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-700 block">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-[#1273D4]/20 focus:border-[#1273D4] outline-none transition-all"
    />
  </div>
);
