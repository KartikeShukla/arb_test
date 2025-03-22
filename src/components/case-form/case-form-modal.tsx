import { useState, useEffect, useRef } from "react"
import { X, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase, mockSupabaseOps, isDevelopment } from "@/config/supabase"

interface CaseFormModalProps {
  isOpen: boolean
  onClose: () => void
}

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
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      // Check if in development mode with mock
      const useMockData = isDevelopment && !supabase;
      
      // Prepare data to submit
      const caseData = {
        name: formData.name,
        email: formData.email,
        description: formData.description
      };

      let formResponseData;

      // Handle form submission (real or mock)
      if (useMockData) {
        // Use mock implementation
        console.log("Using mock Supabase implementation");
        const response = await mockSupabaseOps.insert([caseData]);
        formResponseData = response.data;
      } else if (supabase) {
        // Use real Supabase client
        const { data, error } = await supabase
          .from('cases')
          .insert([caseData])
          .select();
          
        if (error) throw new Error(error.message);
        formResponseData = data;
      } else {
        throw new Error("Database connection not available. Please check your environment configuration.");
      }

      // Handle file uploads (real or mock)
      if (files.length > 0 && formResponseData) {
        const caseId = formResponseData[0].id;

        for (const file of files) {
          if (useMockData) {
            await mockSupabaseOps.upload(`${caseId}/${file.name}`, file);
          } else if (supabase) {
            const { error: uploadError } = await supabase.storage
              .from('case_documents')
              .upload(`${caseId}/${file.name}`, file);

            if (uploadError) {
              throw new Error(`File upload error: ${uploadError.message}`);
            }
          }
        }
      }

      // Success
      setSubmitSuccess(true)
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({ name: "", email: "", description: "" })
        setFiles([])
        setSubmitSuccess(false)
        onClose()
      }, 2000)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <h2 id="modal-title" className="text-xl font-bold">Submit Your Case</h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-full p-1"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {submitSuccess ? (
          <div className="p-6 text-center">
            <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Case Submitted Successfully</h3>
            <p className="text-gray-600">We will get back to you soon!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        aria-label="Upload supporting documents"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, PNG, JPG up to 10MB each</p>
                </div>
              </div>
              {files.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500" aria-live="polite">
                    {files.length} file(s) selected
                  </p>
                  <ul className="mt-1 space-y-1">
                    {files.map((file, index) => (
                      <li key={index} className="text-xs text-gray-500 truncate">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {!supabase && !isDevelopment && (
              <div 
                className="p-3 bg-yellow-50 text-yellow-700 rounded-md text-sm"
                role="alert"
                aria-live="assertive"
              >
                Database connection not configured. Please check your environment settings.
              </div>
            )}

            {!supabase && isDevelopment && (
              <div 
                className="p-3 bg-blue-50 text-blue-700 rounded-md text-sm"
                role="alert"
              >
                Running in development mode with mock database operations.
              </div>
            )}

            {submitError && (
              <div 
                className="p-3 bg-red-50 text-red-700 rounded-md text-sm"
                role="alert"
                aria-live="assertive"
              >
                {submitError}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="mr-3"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || (!supabase && !isDevelopment)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Submitting...
                  </>
                ) : (
                  'Submit Case'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
} 