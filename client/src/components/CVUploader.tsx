import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";

interface CVUploaderProps {
  onComplete?: (uploadURL: string) => void;
  buttonClassName?: string;
  currentCV?: string;
}

/**
 * A simple CV file upload component using a native file input.
 * 
 * Features:
 * - Renders as a customizable button
 * - Supports PDF, DOC, DOCX files (max 10MB)
 * - Handles file upload to object storage
 */
export function CVUploader({
  onComplete,
  buttonClassName,
  currentCV,
}: CVUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a PDF, DOC, or DOCX file.');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10485760) {
      alert('File size must be less than 10MB.');
      return;
    }

    try {
      // Get upload URL
      const response = await fetch('/api/cv/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadURL } = await response.json();

      // Upload file
      const uploadResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      onComplete?.(uploadURL);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload CV. Please try again.');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      
      <Button 
        type="button"
        variant={currentCV ? "outline" : "default"} 
        onClick={() => fileInputRef.current?.click()} 
        className={`${buttonClassName} ${currentCV ? 'text-[#FF6B35] border-[#FF6B35]' : 'bg-[#FF6B35] hover:bg-[#FF6B35]'}`}
        data-testid="button-upload-cv"
      >
        {currentCV ? (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Update CV
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload CV
          </>
        )}
      </Button>
    </div>
  );
}
