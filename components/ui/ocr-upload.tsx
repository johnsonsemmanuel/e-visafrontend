"use client";

import { useState } from "react";
import { Upload, Loader2, CheckCircle, AlertCircle, Scan } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { t } from "@/lib/i18n";

interface OcrUploadProps {
  onDataExtracted: (data: Record<string, string>) => void;
}

export function OcrUpload({ onDataExtracted }: OcrUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a JPG, PNG, or PDF file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setExtracting(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/applicant/ocr/extract-passport', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const { data, confidence: conf } = response.data;
        setConfidence(conf);
        
        // Auto-fill form with extracted data
        onDataExtracted(data);
        
        toast.success(
          `${t('ocr.success')} (${t('ocr.confidence')}: ${conf}%)\n${t('ocr.verify')}`,
          { duration: 5000, icon: "✅" }
        );
      } else {
        toast.error(t('ocr.failed'));
      }
    } catch (error: any) {
      console.error('OCR extraction failed:', error);
      toast.error(error.response?.data?.message || t('ocr.failed'));
    } finally {
      setUploading(false);
      setExtracting(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <Scan size={24} className="text-blue-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              {t('ocr.extract_data')}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload your passport bio-data page and we'll automatically extract your information to save you time.
            </p>

            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg cursor-pointer transition-colors">
              {extracting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {t('ocr.extracting')}
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload Passport Photo
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,application/pdf"
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {confidence !== null && (
              <div className="mt-3 flex items-center gap-2">
                {confidence >= 80 ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <AlertCircle size={16} className="text-yellow-600" />
                )}
                <span className="text-sm text-gray-700">
                  {t('ocr.confidence')}: <span className="font-semibold">{confidence}%</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
