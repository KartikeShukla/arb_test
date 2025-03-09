import { createClient } from "../../supabase/client";

export type DocumentFile = {
  id?: string;
  name: string;
  caseId: string;
  fileType: string;
  uploadedBy: string;
  fileSize: number;
  file: File;
};

export type DocumentMetadata = {
  id: string;
  name: string;
  caseId: string;
  fileType: string;
  uploadedBy: string;
  uploadDate: string;
  fileSize: number;
  storagePath: string;
  version: string;
  status: string;
};

export async function uploadDocument(
  documentFile: DocumentFile,
): Promise<{ success: boolean; error?: string; document?: DocumentMetadata }> {
  try {
    const supabase = createClient();

    // 1. Check if bucket exists, if not create it
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error("Error checking buckets:", bucketsError);
      return { success: false, error: "Error checking storage buckets" };
    }

    const documentsBucketExists = buckets.some(
      (bucket) => bucket.name === "documents",
    );
    if (!documentsBucketExists) {
      console.log("Documents bucket doesn't exist, creating it...");
      const { error: createBucketError } = await supabase.storage.createBucket(
        "documents",
        {
          public: false,
          fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
        },
      );

      if (createBucketError) {
        console.error("Error creating documents bucket:", createBucketError);
        return { success: false, error: "Could not create storage bucket" };
      }
    }

    // 2. Upload file to storage
    const fileExt = documentFile.file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${documentFile.caseId}/${fileName}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from("documents")
      .upload(filePath, documentFile.file);

    if (storageError) {
      console.error("Error uploading to storage:", storageError);
      return { success: false, error: storageError.message };
    }

    // 2. Insert metadata into database
    const { data: dbData, error: dbError } = await supabase
      .from("documents")
      .insert({
        name: documentFile.name,
        case_id: documentFile.caseId,
        file_type: documentFile.fileType,
        uploaded_by: documentFile.uploadedBy,
        file_size: documentFile.fileSize,
        storage_path: filePath,
        status: "active",
        version: "1.0",
        upload_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error("Error inserting document metadata:", dbError);
      // Try to clean up the uploaded file
      await supabase.storage.from("documents").remove([filePath]);
      return { success: false, error: dbError.message };
    }

    return {
      success: true,
      document: {
        id: dbData.id,
        name: dbData.name,
        caseId: dbData.case_id,
        fileType: dbData.file_type,
        uploadedBy: dbData.uploaded_by,
        uploadDate: dbData.upload_date,
        fileSize: dbData.file_size,
        storagePath: dbData.storage_path,
        version: dbData.version,
        status: dbData.status,
      },
    };
  } catch (error) {
    console.error("Unexpected error during document upload:", error);
    return {
      success: false,
      error: "An unexpected error occurred during upload",
    };
  }
}

export async function getDocumentUrl(
  storagePath: string,
): Promise<{ url: string | null; error?: string }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(storagePath, 60); // URL valid for 60 seconds

    if (error) {
      console.error("Error creating signed URL:", error);
      return { url: null, error: error.message };
    }

    return { url: data.signedUrl };
  } catch (error) {
    console.error("Unexpected error getting document URL:", error);
    return { url: null, error: "An unexpected error occurred" };
  }
}

export async function deleteDocument(
  id: string,
  storagePath: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    // 1. Delete from storage
    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([storagePath]);

    if (storageError) {
      console.error("Error deleting from storage:", storageError);
      return { success: false, error: storageError.message };
    }

    // 2. Delete metadata from database
    const { error: dbError } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    if (dbError) {
      console.error("Error deleting document metadata:", dbError);
      return { success: false, error: dbError.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error during document deletion:", error);
    return {
      success: false,
      error: "An unexpected error occurred during deletion",
    };
  }
}

export function getFileIcon(fileType: string) {
  const type = fileType.toLowerCase();

  if (type.includes("pdf")) {
    return "pdf";
  } else if (type.includes("doc") || type.includes("word")) {
    return "word";
  } else if (
    type.includes("xls") ||
    type.includes("sheet") ||
    type.includes("csv")
  ) {
    return "excel";
  } else if (type.includes("ppt") || type.includes("presentation")) {
    return "powerpoint";
  } else if (
    type.includes("jpg") ||
    type.includes("jpeg") ||
    type.includes("png") ||
    type.includes("gif") ||
    type.includes("image")
  ) {
    return "image";
  } else {
    return "file";
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return bytes + " B";
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + " KB";
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  }
}
