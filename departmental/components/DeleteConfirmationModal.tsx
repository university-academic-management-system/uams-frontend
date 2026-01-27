
import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => Promise<void>;
    title: string;
    description: string;
    itemCount: number;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    itemCount
}) => {
    const [reason, setReason] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        if (!reason.trim()) return;
        
        try {
            setIsDeleting(true);
            await onConfirm(reason);
            // Modal closed by parent on success
        } catch (error) {
            console.error("Delete failed", error);
            // Error handling usually in parent
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                            <p className="text-sm text-slate-500">
                                You are about to delete <span className="font-bold text-slate-900">{itemCount}</span> items.
                            </p>
                        </div>
                    </div>
                    
                    <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                        {description}
                    </p>

                    <div className="space-y-2 mb-6">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                            Reason for deletion <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. Students graduated and left the university"
                            className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none min-h-[100px] resize-none transition-all placeholder:text-slate-400"
                            autoFocus
                        />
                    </div>

                    <div className="flex items-center gap-3 justify-end">
                        <button 
                            onClick={onClose}
                            disabled={isDeleting}
                            className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleConfirm}
                            disabled={!reason.trim() || isDeleting}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : null}
                            {isDeleting ? "Deleting..." : "Delete Permanently"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
