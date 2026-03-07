"use client";

import React, { useState, useCallback } from "react";
import { Upload, X, FileText, Image, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Document {
  id: string;
  file: File;
  type: string;
  status: "uploading" | "completed" | "error" | "pending";
  error?: string;
}

interface SmartDocumentUploadProps {
  onDocumentsChange: (documents: Document[]) => void;
  requiredDocuments: Array<{
    type: string;
    label: string;
    description: string;
    required: boolean;
  }>;
  className?: string;
}

const DOCUMENT_TYPES = {
  passport: {
    accept: ".pdf,.jpg,.jpeg,.png",
    maxSize: 5 * 1024 * 1024, // 5MB
    icon: <FileText size={16} />,
    color: "text-blue-500"
  },
  photo: {
    accept: ".jpg,.jpeg,.png",
    maxSize: 2 * 1024 * 1024, // 2MB
    icon: <Image size={16} />,
    color: "text-green-500"
  },
  other: {
    accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx",
    maxSize: 10 * 1024 * 1024, // 10MB
    icon: <FileText size={16} />,
    color: "text-gray-500"
  }
};

export function SmartDocumentUpload({ 
  onDocumentsChange, 
  requiredDocuments, 
  className = "" 
}: SmartDocumentUploadProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const getDocumentType = (file: File): string => {
    const fileName = file.name.toLowerCase();
    
    // Auto-detect document type by filename
    if (fileName.includes("passport") || fileName.includes("pass")) {
      return "passport";
    }
    if (fileName.includes("photo") || fileName.includes("picture") || fileName.includes("selfie")) {
      return "photo";
    }
    return "other";
  };

  const validateFile = (file: File, type: string): { valid: boolean; error?: string } => {
    const config = DOCUMENT_TYPES[type as keyof typeof DOCUMENT_TYPES];
    
    if (file.size > config.maxSize) {
      return { 
        valid: false, 
        error: `File size must be less than ${config.maxSize / 1024 / 1024}MB` 
      };
    }
    
    const allowedTypes = config.accept.split(",");
    const fileExtension = "." + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      return { 
        valid: false, 
        error: `File type not allowed. Accepted: ${config.accept}` 
      };
    }
    
    return { valid: true };
  };

  const simulateUpload = useCallback(async (document: Document): Promise<void> => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(prev => ({ ...prev, [document.id]: progress }));
    }
  }, []);

  const handleFiles = useCallback(async (files: FileList) => {
    const newDocuments: Document[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (!file) continue; // Skip null files
      
      const type = getDocumentType(file);
      
      const validation = validateFile(file, type);
      if (!validation.valid) {
        newDocuments.push({
          id: `doc-${Date.now()}-${i}`,
          file,
          type,
          status: "error" as const,
          error: validation.error
        });
        continue;
      }
      
      const document: Document = {
        id: `doc-${Date.now()}-${i}`,
        file,
        type,
        status: "uploading" as const
      };
      
      newDocuments.push(document);
      setDocuments(prev => [...prev, document]);
      
      // Simulate upload
      try {
        await simulateUpload(document);
        setDocuments(prev => 
          prev.map(d => 
            d.id === document.id 
              ? { ...d, status: "completed" as const }
              : d
          )
        );
      } catch (error) {
        setDocuments(prev => 
          prev.map(d => 
            d.id === document.id 
              ? { ...d, status: "error" as const, error: "Upload failed" }
              : d
          )
        );
      }
    }
    
    onDocumentsChange([...documents, ...newDocuments]);
  }, [documents, onDocumentsChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    onDocumentsChange([...documents.filter(d => d.id !== id)]);
  }, [documents, onDocumentsChange]);

  const retryUpload = useCallback((id: string) => {
    const document = documents.find(d => d.id === id);
    if (document && document.status === "error") {
      const newDocument = { ...document, status: "uploading" as const };
      setDocuments(prev => prev.map(d => d.id === id ? newDocument : d));
      
      simulateUpload(newDocument).then(() => {
        setDocuments(prev => 
          prev.map(d => 
            d.id === id 
              ? { ...d, status: "completed" }
              : d
          )
        );
        onDocumentsChange(documents.map(d => 
          d.id === id 
            ? { ...d, status: "completed" }
            : d
        ));
      });
    }
  }, [documents, simulateUpload, onDocumentsChange]);

  const getDocumentStatusIcon = (status: Document["status"]) => {
    switch (status) {
      case "uploading":
        return <div className="animate-spin rounded-full border-2 border-blue-500 border-t-transparent h-4 w-4" />;
      case "completed":
        return <CheckCircle size={16} className="text-green-500" />;
      case "error":
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <Upload size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
          ${documents.length === 0 ? "cursor-pointer" : ""}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => documents.length === 0 && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <Upload size={48} className="text-gray-400" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {documents.length === 0 ? "Drop your documents here" : "Add more documents"}
            </h3>
            <p className="text-sm text-gray-500">
              {documents.length === 0 
                ? "Drag and drop or click to browse" 
                : "Drag and drop, click to browse, or take photos"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Required Documents List */}
      <div className="space-y-3">
        {requiredDocuments.map((reqDoc) => {
          const uploadedDoc = documents.find(d => d.type === reqDoc.type);
          const isCompleted = uploadedDoc?.status === "completed";
          const hasError = uploadedDoc?.status === "error";
          
          return (
            <div
              key={reqDoc.type}
              className={`flex items-center justify-between p-4 border rounded-lg
                ${isCompleted ? "border-green-200 bg-green-50" : 
                 hasError ? "border-red-200 bg-red-50" : 
                 "border-gray-200"}
              `}
            >
              <div className="flex items-center space-x-3">
                {getDocumentStatusIcon(uploadedDoc?.status || "pending")}
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {reqDoc.label}
                    {reqDoc.required && <span className="text-red-500 ml-1">*</span>}
                  </h4>
                  <p className="text-xs text-gray-500">{reqDoc.description}</p>
                </div>
              </div>
              
              {uploadedDoc && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {uploadedDoc.file.name.length > 20 
                      ? uploadedDoc.file.name.substring(0, 20) + "..."
                      : uploadedDoc.file.name
                    }
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeDocument(uploadedDoc.id)}
                  >
                    <X size={14} />
                  </Button>
                  {hasError && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => retryUpload(uploadedDoc.id)}
                    >
                      Retry
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Progress */}
      {Object.entries(uploadProgress).map(([id, progress]) => (
        <div key={id} className="w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Uploading...</span>
            <span className="text-xs text-gray-500">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
