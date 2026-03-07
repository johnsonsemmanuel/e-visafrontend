"use client";

import { useState } from "react";
import { X, Download, ZoomIn, ZoomOut, RotateCw, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "./button";

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: number;
    document_type: string;
    original_filename: string;
    stored_path: string;
    mime_type: string;
  } | null;
  baseUrl?: string;
}

export function DocumentPreview({ isOpen, onClose, document, baseUrl = "" }: DocumentPreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen || !document) return null;

  const isImage = document.mime_type?.startsWith("image/");
  const isPdf = document.mime_type === "application/pdf";
  const previewUrl = `${baseUrl}/storage/${document.stored_path}`;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            {isImage ? (
              <ImageIcon size={20} className="text-info" />
            ) : (
              <FileText size={20} className="text-warning" />
            )}
            <div>
              <h3 className="font-semibold text-text-primary capitalize">
                {document.document_type.replace(/_/g, " ")}
              </h3>
              <p className="text-xs text-text-muted">{document.original_filename}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isImage && (
              <>
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-lg hover:bg-surface transition-colors"
                  title="Zoom out"
                >
                  <ZoomOut size={18} className="text-text-secondary" />
                </button>
                <span className="text-sm text-text-muted w-12 text-center">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-lg hover:bg-surface transition-colors"
                  title="Zoom in"
                >
                  <ZoomIn size={18} className="text-text-secondary" />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-2 rounded-lg hover:bg-surface transition-colors"
                  title="Rotate"
                >
                  <RotateCw size={18} className="text-text-secondary" />
                </button>
                <div className="w-px h-6 bg-border mx-2" />
              </>
            )}
            <a
              href={previewUrl}
              download={document.original_filename}
              className="p-2 rounded-lg hover:bg-surface transition-colors"
              title="Download"
            >
              <Download size={18} className="text-text-secondary" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface transition-colors"
              title="Close"
            >
              <X size={18} className="text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 bg-surface/50 flex items-center justify-center min-h-[400px]">
          {isImage ? (
            <div
              className="transition-transform duration-200"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={document.document_type}
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
              />
            </div>
          ) : isPdf ? (
            <iframe
              src={previewUrl}
              className="w-full h-[60vh] rounded-lg border border-border"
              title={document.document_type}
            />
          ) : (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-text-muted mb-4" />
              <p className="text-text-secondary mb-4">
                Preview not available for this file type
              </p>
              <a href={previewUrl} download={document.original_filename}>
                <Button leftIcon={<Download size={16} />}>Download File</Button>
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-text-muted">
            Type: {document.mime_type}
          </p>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
