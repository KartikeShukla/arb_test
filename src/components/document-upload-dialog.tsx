"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { uploadDocument, DocumentFile } from "@/lib/document-utils";
import { createClient } from "../../supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DocumentUploadDialogProps {
  caseId: string;
  onUploadCompletePath?: string;
  trigger?: React.ReactNode;
}

export function DocumentUploadDialog({
  caseId,
  onUploadCompletePath,
  trigger,
}: DocumentUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Auto-populate document name with file name (without extension)
      const fileName = selectedFile.name.split(".")[0];
      setDocumentName(fileName);

      setError(null);
    }
  };

  const handleUpload = async () => {
    setError(null);

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    if (!documentName.trim()) {
      setError("Please enter a document name");
      return;
    }

    setIsUploading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to upload documents");
        setIsUploading(false);
        return;
      }

      const documentFile: DocumentFile = {
        name: documentName,
        caseId: caseId,
        fileType: file.type,
        uploadedBy: user.id, // Make sure this is the authenticated user's ID
        fileSize: file.size,
        file: file,
      };

      console.log("Uploading document with user ID:", user.id);

      const result = await uploadDocument(documentFile);

      if (!result.success) {
        setError(result.error || "Failed to upload document");
        setIsUploading(false);
        return;
      }

      // Reset form and close dialog
      setFile(null);
      setDocumentName("");
      setIsUploading(false);
      setOpen(false);

      // Navigate to the specified path or reload documents
      if (onUploadCompletePath) {
        window.location.href = onUploadCompletePath;
      } else {
        // Refresh the current page to show updated documents
        window.location.reload();
      }
    } catch (err) {
      console.error("Error uploading document:", err);
      setError("An unexpected error occurred");
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document to case #{caseId}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="document-name">Document Name</Label>
            <Input
              id="document-name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Enter document name"
              disabled={isUploading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="file">File</Label>
            {!file ? (
              <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <Input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                  disabled={isUploading}
                />
                <label
                  htmlFor="file"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to select or drag and drop
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, JPEG, PNG
                  </span>
                </label>
              </div>
            ) : (
              <div className="flex items-center gap-2 border rounded-md p-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || !documentName.trim() || isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
