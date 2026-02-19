import { useState, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon, File } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploaderProps {
    onFilesSelected: (files: File[]) => void;
    maxFiles?: number;
    acceptedTypes?: string[];
}

export function FileUploader({ onFilesSelected, maxFiles = 3, acceptedTypes = [".pdf", ".txt", ".csv", ".docx", ".png", ".jpg"] }: FileUploaderProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleFiles = (newFiles: File[]) => {
        const validFiles = newFiles.filter(file => {
            const ext = "." + file.name.split(".").pop()?.toLowerCase();
            return acceptedTypes.includes(ext);
        });

        const updatedFiles = [...files, ...validFiles].slice(0, maxFiles);
        setFiles(updatedFiles);
        onFilesSelected(updatedFiles);
    };

    const removeFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onFilesSelected(updatedFiles);
    };

    const getFileIcon = (fileName: string) => {
        if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) return <ImageIcon className="w-5 h-5 text-purple-400" />;
        if (fileName.match(/\.(pdf|txt|doc|docx)$/i)) return <FileText className="w-5 h-5 text-blue-400" />;
        return <File className="w-5 h-5 text-gray-400" />;
    };

    return (
        <div className="w-full space-y-4">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center group
                    ${isDragging
                        ? "border-primary bg-primary/10 scale-[1.02]"
                        : "border-white/10 hover:border-primary/50 hover:bg-white/5"
                    }`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                    className="hidden"
                    multiple
                    accept={acceptedTypes.join(",")}
                />

                <div className="p-4 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Upload className={`w-8 h-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                </div>

                <h3 className="text-lg font-medium mb-1">Upload relevant documents</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                    Drag & drop files or click to browse. Supported formats: PDF, TXT, CSV, Images
                </p>
            </div>

            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                    >
                        {files.map((file, idx) => (
                            <motion.div
                                key={`${file.name}-${idx}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 group"
                            >
                                {getFileIcon(file.name)}
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(idx);
                                    }}
                                    className="p-1.5 rounded-md hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
