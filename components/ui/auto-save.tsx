"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

interface AutoSaveProps {
  data: Record<string, any>;
  step: number;
  applicationId?: string;
  onSave?: (success: boolean) => void;
  interval?: number;
  className?: string;
}

export function AutoSave({ 
  data, 
  step, 
  applicationId, 
  onSave,
  interval = 30000, // 30 seconds
  className = "" 
}: AutoSaveProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const saveToStorage = useCallback(async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      // Save to localStorage
      const saveData = {
        data,
        step,
        applicationId,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("evisa_application_draft", JSON.stringify(saveData));
      
      // In production, this would save to backend API
      if (applicationId) {
        // await api.post(`/applicant/applications/${applicationId}/draft`, saveData);
      }

      setLastSaved(new Date());
      setSaveStatus("success");
      onSave?.(true);
      
      // Show subtle success notification
      toast.success("Application auto-saved", {
        icon: <CheckCircle size={16} />,
        duration: 2000,
      });
    } catch (error) {
      console.error("Auto-save failed:", error);
      setSaveStatus("error");
      onSave?.(false);
      
      toast.error("Auto-save failed", {
        icon: <AlertCircle size={16} />,
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  }, [data, step, applicationId, onSave]);

  // Auto-save on interval
  useEffect(() => {
    const intervalId = setInterval(saveToStorage, interval);
    return () => clearInterval(intervalId);
  }, [saveToStorage, interval]);

  // Save on data changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(saveToStorage, 2000); // 2 seconds after change
    return () => clearTimeout(timeoutId);
  }, [data, saveToStorage]);

  // Save on page unload
  useEffect(() => {
    const handleUnload = () => {
      saveToStorage();
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [saveToStorage]);

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    return `${Math.floor(seconds / 3600)} hours ago`;
  };

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      {isSaving ? (
        <>
          <div className="animate-spin rounded-full border-2 border-blue-500 border-t-transparent h-3 w-3" />
          <span className="text-gray-500">Saving...</span>
        </>
      ) : (
        <>
          <Save 
            size={14} 
            className={`${
              saveStatus === "success" ? "text-green-500" : 
              saveStatus === "error" ? "text-red-500" : 
              "text-gray-400"
            }`} 
          />
          {lastSaved && (
            <span className="text-gray-500">
              Saved {formatLastSaved(lastSaved)}
            </span>
          )}
        </>
      )}
    </div>
  );
}

// Hook to restore saved application data
export function useSavedApplication() {
  const [savedData, setSavedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("evisa_application_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only restore if saved within last 7 days
        const savedDate = new Date(parsed.timestamp);
        const now = new Date();
        const daysDiff = (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysDiff <= 7) {
          setSavedData(parsed);
        } else {
          // Clear old saved data
          localStorage.removeItem("evisa_application_draft");
        }
      }
    } catch (error) {
      console.error("Failed to load saved application:", error);
      localStorage.removeItem("evisa_application_draft");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSavedData = useCallback(() => {
    localStorage.removeItem("evisa_application_draft");
    setSavedData(null);
  }, []);

  return {
    savedData,
    isLoading,
    clearSavedData,
    hasSavedData: !!savedData,
  };
}
