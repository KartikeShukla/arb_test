"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getDocumentUrl } from "@/lib/document-utils";
import { Loader2, Download, ExternalLink, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DocumentViewerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: string;
    name: string;
    fileType: string;
    storagePath: string;
  };
}

export function DocumentViewerDialog({
  isOpen,
  onClose,
  document,
}: DocumentViewerDialogProps) {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && document) {
      loadDocument();
    }

    return () => {
      // Clean up URL when dialog closes
      setDocumentUrl(null);
    };
  }, [isOpen, document]);

  const loadDocument = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getDocumentUrl(document.storagePath);

      if (!result.url) {
        setError(result.error || "Failed to load document");
        setIsLoading(false);
        return;
      }

      setDocumentUrl(result.url);
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading document:", err);
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (documentUrl) {
      const link = document.createElement("a");
      link.href = documentUrl;
      link.download = document.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenInNewTab = () => {
    if (documentUrl) {
      window.open(documentUrl, "_blank");
    }
  };

  const renderDocumentPreview = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading document...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (!documentUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <p className="text-muted-foreground">Document not available</p>
        </div>
      );
    }

    const fileType = document.fileType.toLowerCase();

    if (fileType.includes("pdf")) {
      return (
        <iframe
          src={`${documentUrl}#toolbar=0`}
          className="w-full h-[60vh] border rounded-md"
          title={document.name}
        />
      );
    } else if (
      fileType.includes("jpg") ||
      fileType.includes("jpeg") ||
      fileType.includes("png") ||
      fileType.includes("gif")
    ) {
      return (
        <div className="flex items-center justify-center h-[60vh]">
          <img
            src={documentUrl}
            alt={document.name}
            className="max-w-full max-h-[60vh] object-contain"
          />
        </div>
      );
    } else {
      // For other file types, show a message that they need to download
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <p className="text-muted-foreground mb-4">
            This file type cannot be previewed directly.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
            <Button
              onClick={handleOpenInNewTab}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open in New Tab</span>
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{document.name}</DialogTitle>
        </DialogHeader>

        {renderDocumentPreview()}

        <DialogFooter className="sm:justify-end">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex items-center gap-2"
            disabled={!documentUrl || isLoading}
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
