import { useState, useEffect, useRef } from "react"
import { X, Upload, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase, mockSupabaseOps, isDevelopment } from "@/config/supabase"
import { toast } from "@/components/ui/use-toast"

interface CaseFormModalProps {
  isOpen: boolean
  onClose: () => void
}

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Allowed file types
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'text/plain'
];

export function CaseFormModal({ isOpen, onClose }: CaseFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: ""
  })
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [fileError, setFileError] = useState("")
  const [submissionTime, setSubmissionTime] = useState<Date | null>(null)
  
  const modalRef = useRef<HTMLDivElement>(null)
  const initialFocusRef = useRef<HTMLInputElement>(null)

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      
      // Focus the first input when modal opens
      setTimeout(() => {
        initialFocusRef.current?.focus()
      }, 100)
      
      // Prevent background scrolling
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const selectedFiles = Array.from(e.target.files);
    setFileError("");
    
    // Validate file size and type
    const invalidFiles = selectedFiles.filter(
      file => file.size > MAX_FILE_SIZE || !ALLOWED_FILE_TYPES.includes(file.type)
    );
    
    if (invalidFiles.length > 0) {
      setFileError(
        "Some files are too large or have an invalid format. Please upload PDF, DOC, DOCX, JPEG, PNG, or TXT files under 5MB."
      );
      return;
    }
    
    setFiles(selectedFiles);
  }

  const getSignedUrl = async (bucketName: string, filePath: string): Promise<{signedUrl: string, token: string} | null> => {
    try {
      console.log(`Requesting signed URL for ${bucketName}/${filePath}`);
      
      const response = await fetch('/api/supabase-storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bucketName,
          filePath,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error getting signed URL:', errorData);
        return null;
      }
      
      const data = await response.json();
      
      if (!data.success || !data.signedUrl) {
        console.error('Invalid signed URL response:', data);
        return null;
      }
      
      return {
        signedUrl: data.signedUrl,
        token: data.token
      };
    } catch (error) {
      console.error('Error requesting signed URL:', error);
      return null;
    }
  };

  const uploadFileWithRetry = async (bucketName: string, filePath: string, file: File, retries = 3): Promise<void> => {
    if (!supabase) throw new Error("Supabase client not available");
    
    let lastError = null;
    
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        console.log(`Upload attempt ${attempt + 1} for ${filePath}`);
        
        // Try direct upload first
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (!uploadError) {
          console.log(`Successfully uploaded file on attempt ${attempt + 1}`);
          return; // Success, exit the function
        }
        
        // If there's an RLS error, try getting a signed URL
        if (uploadError.message.includes("policy") || uploadError.message.includes("permission")) {
          console.log("Trying upload with signed URL due to permission issue");
          
          // First try our server API to get a signed URL (with service role)
          const signedUrlData = await getSignedUrl(bucketName, filePath);
          
          if (signedUrlData && signedUrlData.signedUrl) {
            // Use the signed URL from our API to upload the file
            const uploadResponse = await fetch(signedUrlData.signedUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': file.type,
                'x-upsert': 'false'
              },
              body: file
            });
            
            if (!uploadResponse.ok) {
              throw new Error(`Signed URL upload failed: ${uploadResponse.statusText}`);
            }
            
            console.log(`Successfully uploaded file using signed URL from API`);
            return; // Success, exit the function
          }
          
          // If our API failed, try the client-side method
          const { data: clientSignedUrlData, error: signedUrlError } = await supabase.storage
            .from(bucketName)
            .createSignedUploadUrl(filePath);
          
          if (signedUrlError) {
            throw new Error(`Failed to get signed URL: ${signedUrlError.message}`);
          }
          
          if (!clientSignedUrlData || !clientSignedUrlData.signedUrl) {
            throw new Error("No signed URL returned");
          }
          
          // Use the signed URL to upload the file
          const { token, signedUrl } = clientSignedUrlData;
          
          const uploadResponse = await fetch(signedUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': file.type,
              'x-upsert': 'false'
            },
            body: file
          });
          
          if (!uploadResponse.ok) {
            throw new Error(`Signed URL upload failed: ${uploadResponse.statusText}`);
          }
          
          console.log(`Successfully uploaded file using client-side signed URL`);
          return; // Success, exit the function
        }
        
        // Other error - log and retry
        lastError = uploadError;
        console.error(`Upload error (attempt ${attempt + 1}):`, uploadError);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retrying
        
      } catch (err) {
        lastError = err;
        console.error(`Upload attempt ${attempt + 1} failed:`, err);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retrying
      }
    }
    
    // If we get here, all retries failed
    throw new Error(lastError instanceof Error ? lastError.message : "File upload failed after multiple attempts");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    
    // Store submission timestamp
    const submissionTime = new Date();

    try {
      // Check if Supabase is available
      if (!supabase) {
        throw new Error("Database connection not available. Please try again later.");
      }

      // Form validation
      if (!formData.name || !formData.email || !formData.description) {
        throw new Error("Please fill all required fields");
      }

      console.log("Starting case submission process...");
      
      let supabaseFileUrls: string[] = [];
      
      // Only attempt file uploads if files are selected
      if (files.length > 0) {
        console.log(`Preparing to upload ${files.length} files`);
        
        // Upload files to Supabase storage
        const fileUploads = files.map(async (file, index) => {
          try {
            // Create a unique file path with user information and timestamp
            const timestamp = new Date().getTime();
            const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filePath = `${formData.name.replace(/\s+/g, '_')}_${timestamp}_${sanitizedFileName}`;
            
            console.log(`Uploading file: ${filePath}`);
            
            // Simple direct upload now that permissions are fixed
            const { data: uploadData, error: uploadError } = await supabase!
              .storage
              .from('case-documents')
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
              });
              
            if (uploadError) {
              console.error("Upload error:", uploadError);
              throw new Error(`Failed to upload file: ${uploadError.message}`);
            }
            
            // Get the public URL for the uploaded file
            const { data } = supabase!
              .storage
              .from('case-documents')
              .getPublicUrl(filePath);
            
            console.log(`File uploaded successfully, public URL: ${data.publicUrl}`);
            
            return data.publicUrl;
          } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error);
            throw new Error(`Failed to upload file ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        });
        
        // Wait for all file uploads to complete
        supabaseFileUrls = await Promise.all(fileUploads);
        console.log(`Successfully uploaded ${supabaseFileUrls.length} files`);
      }

      // Simple insertion into cases table with the documents field
      const caseData = {
        name: formData.name,
        email: formData.email,
        description: formData.description,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        documents: supabaseFileUrls.length > 0 ? supabaseFileUrls : null,
      };

      console.log("Submitting case data to database:", { ...caseData, documents: supabaseFileUrls.length });

      // Insert data into Supabase
      const { data: insertedCase, error: insertError } = await supabase
        .from('cases')
        .insert([caseData])
        .select('id');

      if (insertError) {
        console.error("Error inserting case data:", insertError);
        throw new Error(`Database submission failed: ${insertError.message}`);
      }

      console.log("Case submitted successfully with ID:", insertedCase?.[0]?.id);
      
      // Also insert records into case_documents table for better tracking
      if (insertedCase?.[0]?.id && files.length > 0) {
        console.log("Adding entries to case_documents table...");
        
        const documentRecords = files.map((file, index) => {
          const timestamp = new Date().getTime();
          const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const filePath = `${formData.name.replace(/\s+/g, '_')}_${timestamp}_${sanitizedFileName}`;
          
          return {
            case_id: insertedCase[0].id,
            file_name: file.name,
            file_path: `case-documents/${filePath}`,
            file_type: file.type,
            file_size: file.size,
            uploaded_at: new Date().toISOString()
          };
        });
        
        const { error: docsError } = await supabase
          .from('case_documents')
          .insert(documentRecords);
          
        if (docsError) {
          console.error("Warning: Could not update case_documents table:", docsError);
          // Don't throw error as the case was already created successfully
        } else {
          console.log(`Successfully added ${documentRecords.length} entries to case_documents table`);
        }
      }

      console.log("Case submission process completed successfully!");
      
      // On successful submission
      setIsSubmitting(false);
      
      // Only close and reset if submission was successful
      setSubmitSuccess(true);
      setFiles([]);
      setFormData({
        name: '',
        email: '',
        description: '',
      });
      
      // Store submission time for display
      setSubmissionTime(submissionTime);
      
      // Show success toast notification
      toast({
        title: "SUCCESS: Case Submitted",
        description: "Your case has been submitted successfully! We will review your case and get back to you soon.",
        status: "success",
        duration: 3000,
      });
      
    } catch (error) {
      console.error("Error in case submission:", error);
      setIsSubmitting(false);
      setSubmitError(error instanceof Error ? error.message : "An unknown error occurred");
      
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Failed to submit your case. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Reset function for submitting another request
  const handleSubmitAnother = () => {
    setSubmitSuccess(false);
    setFiles([]);
    setFormData({
      name: "",
      email: "",
      description: ""
    });
    
    // Focus the first input field
    setTimeout(() => {
      initialFocusRef.current?.focus();
    }, 100);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        // Close when clicking the backdrop
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-in zoom-in-90"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 bg-primary text-white">
          <h2 id="modal-title" className="text-xl font-bold">
            {submitSuccess ? "Case Submitted" : "Submit Your Case"}
          </h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-full p-1"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {submitSuccess ? (
          <div className="p-8 text-center">
            <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Case Submitted Successfully</h3>
            <p className="text-gray-600 mb-2">We will review your case and get back to you soon!</p>
            
            {/* Show submission timestamp */}
            {submissionTime && (
              <p className="text-sm text-gray-500 mb-6">
                Submitted on {submissionTime.toLocaleDateString()} at {submissionTime.toLocaleTimeString()}
              </p>
            )}
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="default"
                onClick={handleSubmitAnother}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Submit Another Request
              </Button>
              
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-300 text-gray-700"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}
            
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
                ref={initialFocusRef}
                aria-required="true"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email address"
                aria-required="true"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Case Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provide a brief description of your case"
                aria-required="true"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="documents" className="block text-sm font-medium text-gray-700">
                Supporting Documents (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="documents"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
                    >
                      <span>Upload files</span>
                      <input
                        id="documents"
                        name="documents"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="sr-only"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
                        aria-label="Upload supporting documents"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG, TXT up to 5MB</p>
                </div>
              </div>
              
              {fileError && (
                <p className="mt-2 text-sm text-red-600">{fileError}</p>
              )}
              
              {files.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full py-2.5"
                disabled={isSubmitting || fileError !== ""}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Case"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
} 