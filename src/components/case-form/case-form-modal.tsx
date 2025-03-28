"use client"

import { useEffect, useState, useCallback, FormEvent, ChangeEvent } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/config/supabase"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface FileWithPreview extends File {
  preview?: string;
}

interface FormData {
  name: string;
  description: string;
  documents: FileWithPreview[];
}

interface FormErrors {
  name?: string;
  description?: string;
  documents?: string;
  general?: string;
}

export function CaseFormModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuth()
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    documents: []
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset form after closing the modal
      setFormData({
        name: "",
        description: "",
        documents: []
      })
      setErrors({})
      setIsSubmitting(false)
      setSubmitSuccess(false)
    }
  }, [isOpen])
  
  // Reset success message after 3 seconds
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    if (submitSuccess) {
      timeoutId = setTimeout(() => {
        setSubmitSuccess(false)
        onClose()
      }, 3000)
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [submitSuccess, onClose])
  
  // Clean up document previews
  useEffect(() => {
    return () => {
      formData.documents.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview)
      })
    }
  }, [formData.documents])
  
  // Handle input changes
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name as keyof FormErrors]
        return newErrors
      })
    }
  }, [errors])
  
  // Handle file uploads
  const handleFileUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const newFiles: FileWithPreview[] = Array.from(e.target.files).map(file => {
      // Create object URL for previews
      const fileWithPreview = file as FileWithPreview
      fileWithPreview.preview = URL.createObjectURL(file)
      return fileWithPreview
    })
    
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...newFiles]
    }))
    
    // Clear document error if it exists
    if (errors.documents) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.documents
        return newErrors
      })
    }
    
    // Reset the input value so the same file can be selected again if removed
    e.target.value = ''
  }, [errors.documents])
  
  // Remove a document
  const removeDocument = useCallback((index: number) => {
    setFormData(prev => {
      const newDocuments = [...prev.documents]
      // Revoke the URL to prevent memory leaks
      const removedFile = newDocuments[index]
      if (removedFile.preview) URL.revokeObjectURL(removedFile.preview)
      
      newDocuments.splice(index, 1)
      return { ...prev, documents: newDocuments }
    })
  }, [])
  
  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Case name is required"
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Case description is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])
  
  // Upload documents
  const uploadDocuments = useCallback(async (caseId: string): Promise<string[]> => {
    if (!supabase) throw new Error("Supabase client is not initialized")
    if (formData.documents.length === 0) return []
    
    const documentIds: string[] = []
    
    for (const file of formData.documents) {
      const fileId = crypto.randomUUID()
      const fileName = `${caseId}/${fileId}-${file.name}`
      
      const { error: uploadError } = await supabase.storage
        .from('case-documents')
        .upload(fileName, file)
      
      if (uploadError) {
        throw new Error(`Failed to upload document ${file.name}: ${uploadError.message}`)
      }
      
      // Get public URL for the file
      const { data: publicUrlData } = supabase.storage
        .from('case-documents')
        .getPublicUrl(fileName)
      
      // Insert document metadata into the documents table
      const { error: docError } = await supabase
        .from('documents')
        .insert({
          case_id: caseId,
          filename: file.name,
          url: publicUrlData.publicUrl,
          content_type: file.type,
          size: file.size
        })
      
      if (docError) {
        throw new Error(`Failed to save document metadata: ${docError.message}`)
      }
      
      documentIds.push(fileId)
    }
    
    return documentIds
  }, [formData.documents])
  
  // Handle form submission
  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setErrors({ general: "You must be logged in to submit a case" })
      return
    }
    
    if (!supabase) {
      setErrors({ general: "Cannot connect to the database" })
      return
    }
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      // Create the case
      const caseId = crypto.randomUUID()
      
      const { error: caseError } = await supabase
        .from('cases')
        .insert({
          id: caseId,
          name: formData.name,
          description: formData.description,
          email: user.email,
          status: 'Pending',
          user_id: user.id
        })
      
      if (caseError) {
        throw new Error(`Failed to create case: ${caseError.message}`)
      }
      
      // Upload documents
      if (formData.documents.length > 0) {
        await uploadDocuments(caseId)
      }
      
      setSubmitSuccess(true)
    } catch (error) {
      console.error('Error submitting case:', error)
      setErrors({
        general: error instanceof Error ? error.message : "An unknown error occurred"
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [user, validateForm, formData, uploadDocuments])
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit a New Arbitration Case</DialogTitle>
        </DialogHeader>
        
        {submitSuccess ? (
          <div className="p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Case Submitted Successfully</h3>
            <p className="mt-2 text-sm text-gray-500">
              Your case has been submitted and is pending review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p>{errors.general}</p>
              </div>
            )}
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="required">Case Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter a name for your case"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? "border-red-500" : ""}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  disabled={isSubmitting}
                  required
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description" className="required">Case Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide details about your case"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? "description-error" : undefined}
                  disabled={isSubmitting}
                  required
                />
                {errors.description && (
                  <p id="description-error" className="text-sm text-red-500 mt-1">{errors.description}</p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="documents">Supporting Documents (Optional)</Label>
                <Input
                  id="documents"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className={errors.documents ? "border-red-500" : ""}
                  aria-invalid={!!errors.documents}
                  aria-describedby={errors.documents ? "documents-error" : undefined}
                  disabled={isSubmitting}
                />
                {errors.documents && (
                  <p id="documents-error" className="text-sm text-red-500 mt-1">{errors.documents}</p>
                )}
                
                {formData.documents.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">Selected files:</p>
                    <ul className="space-y-2">
                      {formData.documents.map((file, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                          <div className="flex items-center space-x-2">
                            <div className="text-xs bg-gray-200 p-1 rounded">
                              {(file.size / 1024).toFixed(1)} KB
                            </div>
                            <span className="text-sm truncate max-w-[300px]">{file.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(index)}
                            className="text-red-500 h-6 px-2"
                            aria-label={`Remove file ${file.name}`}
                            disabled={isSubmitting}
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Submitting...</span>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : "Submit Case"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
} 