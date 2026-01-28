
import React, { useState, useEffect } from 'react';
import { Edit, Upload, X, Loader2 } from 'lucide-react';
import { idCardApi } from '../api/idcardapi';
import { toast } from 'react-hot-toast';

export const IDCardSettingsTab: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form fields
    const [formData, setFormData] = useState({
        schoolName: "",
        department: "", // Assuming this is fixed or from context
        backDescription: "",
        faculty: "", // Assuming this is fixed or from context
        backDisclaimer: "",
        schoolAddress: ""
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [signatureFile, setSignatureFile] = useState<File | null>(null);
    
    const logoInputRef = React.useRef<HTMLInputElement>(null);
    const signatureInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'signature') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (type === 'logo') {
                setLogoFile(file);
            } else {
                setSignatureFile(file);
            }
        }
    };

    useEffect(() => {
        fetchIDCardSettings();
    }, []);

    const fetchIDCardSettings = async () => {
        try {
            setIsLoading(true);
            const data = await idCardApi.getDefaultIDCard();
            if (data && data.success && data.template) {
                const template = data.template;
                setFormData({
                    schoolName: template.institutionName || "",
                    department: template.departments?.[0]?.name || "Department of Computer Science",
                    backDescription: template.backDescription || "",
                    faculty: template.faculties?.[0]?.name || "Faculty of Computing",
                    backDisclaimer: template.backDisclaimer || "",
                    schoolAddress: template.institutionAddress || ""
                });
            }
        } catch (error) {
            console.error("Failed to fetch ID card settings:", error);
            toast.error("Failed to load ID card settings");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12 min-h-[400px]">
                <Loader2 size={32} className="animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-[600px] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900">ID Card Settings</h2>
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-bold text-sm transition-colors ${
                        isEditing 
                            ? 'border-red-200 text-red-600 bg-red-50 hover:bg-red-100' 
                            : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    {isEditing ? <X size={16} /> : <Edit size={16} />}
                    {isEditing ? "Cancel" : "Edit"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-5xl">
                {/* School Name */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">School Name</label>
                    {isEditing ? (
                         <input 
                            type="text" 
                            value={formData.schoolName}
                            onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                            className="w-full px-4 py-2 text-slate-800 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                         />
                    ) : (
                        <p className="text-slate-600 font-medium">{formData.schoolName}</p>
                    )}
                </div>

                {/* Faculty */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">Faculty</label>
                    {isEditing ? (
                         <input 
                            type="text" 
                            value={formData.faculty}
                            onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                            className="w-full px-4 py-2 text-slate-800 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                         />
                    ) : (
                        <p className="text-slate-600 font-medium">{formData.faculty}</p>
                    )}
                </div>

                {/* Department */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">Department</label>
                    {isEditing ? (
                         <input 
                            type="text" 
                            value={formData.department}
                            onChange={(e) => setFormData({...formData, department: e.target.value})}
                            className="w-full px-4 py-2 text-slate-800 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                         />
                    ) : (
                        <p className="text-slate-600 font-medium">{formData.department}</p>
                    )}
                </div>

                {/* Upload Logo */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">Upload Logo</label>
                    <div>
                        <input 
                            type="file" 
                            ref={logoInputRef}
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'logo')}
                        />
                        <button 
                            onClick={() => isEditing && logoInputRef.current?.click()}
                            disabled={!isEditing}
                            className={`flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-500 text-sm font-bold transition-colors ${isEditing ? 'hover:bg-slate-100 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                        >
                            <Upload size={16} />
                            {logoFile ? logoFile.name : "Upload Document"}
                        </button>
                    </div>
                </div>

                {/* Back Description */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">Back Description</label>
                    {isEditing ? (
                         <textarea 
                            value={formData.backDescription}
                            onChange={(e) => setFormData({...formData, backDescription: e.target.value})}
                            rows={3}
                            className="w-full px-4 py-2 text-slate-800 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                         />
                    ) : (
                        <p className="text-slate-600 font-medium">{formData.backDescription}</p>
                    )}
                </div>

                {/* Back Disclaimer */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">Back Disclaimer</label>
                    {isEditing ? (
                         <textarea 
                            value={formData.backDisclaimer}
                            onChange={(e) => setFormData({...formData, backDisclaimer: e.target.value})}
                            rows={3}
                            className="w-full px-4 py-2 text-slate-800 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                         />
                    ) : (
                        <p className="text-slate-600 font-medium">{formData.backDisclaimer}</p>
                    )}
                </div>

                {/* School Address */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">School Address</label>
                    {isEditing ? (
                         <textarea 
                            value={formData.schoolAddress}
                            onChange={(e) => setFormData({...formData, schoolAddress: e.target.value})}
                            rows={3}
                            className="w-full px-4 py-2 text-slate-800 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                         />
                    ) : (
                        <p className="text-slate-600 font-medium">{formData.schoolAddress}</p>
                    )}
                </div>

                 {/* Upload HOD Signature */}
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">Upload HOD Signature</label>
                    <div>
                        <input 
                            type="file" 
                            ref={signatureInputRef}
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'signature')}
                        />
                        <button 
                            onClick={() => isEditing && signatureInputRef.current?.click()}
                            disabled={!isEditing}
                            className={`flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-500 text-sm font-bold transition-colors ${isEditing ? 'hover:bg-slate-100 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                        >
                            <Upload size={16} />
                            {signatureFile ? signatureFile.name : "Upload Document"}
                        </button>
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className="mt-12 flex justify-end">
                    <button className="px-8 py-2.5 bg-[#1D7AD9] text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
};
