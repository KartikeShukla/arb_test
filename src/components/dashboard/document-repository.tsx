"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Eye,
  FileText,
  Filter,
  FolderPlus,
  Search,
  Upload,
} from "lucide-react";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "../ui/loading-spinner";
import { SkeletonTable } from "../ui/skeleton-card";
import { DocumentUploadDialog } from "../document-upload-dialog";
import { DocumentViewerDialog } from "../document-viewer-dialog";
import { createClient } from "../../../supabase/client";
import { formatFileSize } from "@/lib/document-utils";

interface Document {
  id: string;
  name: string;
  caseId: string;
  type: string;
  uploadedBy: string;
  uploadDate: string;
  size: string;
  version: string;
  storagePath?: string;
  fileType?: string;
}

interface DocumentRepositoryProps {
  userRole: "admin" | "arbitrator" | "legal";
  initialDocuments: Document[];
}

export default function DocumentRepository({
  userRole,
  initialDocuments,
}: DocumentRepositoryProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    // Load documents from Supabase
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("upload_date", { ascending: false });

      if (error) {
        console.error("Error loading documents:", error);
        // Fall back to initial documents if there's an error
        setDocuments(initialDocuments);
      } else if (data && data.length > 0) {
        // Transform the data to match our Document interface
        const formattedDocs = data.map((doc) => ({
          id: doc.id,
          name: doc.name,
          caseId: doc.case_id,
          type: doc.file_type.split("/")[1]?.toUpperCase() || "Document",
          uploadedBy: doc.uploaded_by,
          uploadDate: new Date(doc.upload_date).toLocaleDateString(),
          size: formatFileSize(doc.file_size),
          version: doc.version || "1.0",
          storagePath: doc.storage_path,
          fileType: doc.file_type,
        }));
        setDocuments(formattedDocs);
      } else {
        // If no documents in the database, use the initial ones
        setDocuments(initialDocuments);
      }
    } catch (err) {
      console.error("Unexpected error loading documents:", err);
      setDocuments(initialDocuments);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = () => {
    // Reload documents after a successful upload
    loadDocuments();
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedDocument(null);
  };

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case "Statement of Claim":
      case "Statement of Defense":
      case "Procedural Order":
      case "Award":
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Document Repository</CardTitle>
              <CardDescription>
                Access and manage case documents
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <FolderPlus className="h-4 w-4" />
                <span>New Folder</span>
              </Button>
              <DocumentUploadDialog
                caseId="ARB-2023-042"
                trigger={
                  <Button className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </Button>
                }
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents by name, case ID, or type..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size={40} />
              <p className="mt-4 text-sm text-muted-foreground">
                Loading documents...
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getDocumentTypeIcon(doc.type)}
                            <span className="font-medium">{doc.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{doc.caseId}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{doc.uploadedBy}</TableCell>
                        <TableCell>{doc.uploadDate}</TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell>{doc.version}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDocument(doc)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-4 text-muted-foreground"
                      >
                        No documents found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Viewer Dialog */}
      {selectedDocument && (
        <DocumentViewerDialog
          isOpen={isViewerOpen}
          onClose={handleCloseViewer}
          document={{
            id: selectedDocument.id,
            name: selectedDocument.name,
            fileType: selectedDocument.fileType || "application/octet-stream",
            storagePath: selectedDocument.storagePath || "",
          }}
        />
      )}
    </div>
  );
}
