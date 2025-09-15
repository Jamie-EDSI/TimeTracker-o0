"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Upload,
  X,
  Download,
  Eye,
  File,
  FileText,
  ImageIcon,
  AlertCircle,
  Loader2,
  Check,
  Trash2,
  Edit3,
} from "lucide-react"
import { clientFilesApi, type ClientFile } from "@/lib/supabase"

interface FileUploadManagerProps {
  clientId: string
  category?: "certification" | "education" | "general"
  files: ClientFile[]
  onFilesChange: (files: ClientFile[]) => void
  isEditing?: boolean
  maxFileSize?: number // in bytes
  allowedTypes?: string[]
  title?: string
}

interface UploadProgress {
  fileId: string
  progress: number
  status: "uploading" | "success" | "error"
  error?: string
}

export function FileUploadManager({
  clientId,
  category = "certification",
  files,
  onFilesChange,
  isEditing = false,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "text/plain",
  ],
  title = "File Management",
}: FileUploadManagerProps) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [showFilePreview, setShowFilePreview] = useState<ClientFile | null>(null)
  const [editingFile, setEditingFile] = useState<ClientFile | null>(null)
  const [editDescription, setEditDescription] = useState("")
  const [editCategory, setEditCategory] = useState<"certification" | "education" | "general">("certification")
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // File validation
  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      if (file.size > maxFileSize) {
        return {
          valid: false,
          error: `File "${file.name}" is too large. Maximum size is ${formatFileSize(maxFileSize)}.`,
        }
      }

      if (!allowedTypes.includes(file.type)) {
        return {
          valid: false,
          error: `File type "${file.type}" is not supported for "${file.name}".`,
        }
      }

      return { valid: true }
    },
    [maxFileSize, allowedTypes],
  )

  // Handle file upload
  const handleFileUpload = useCallback(
    async (selectedFiles: FileList | File[]) => {
      const filesToUpload = Array.from(selectedFiles)
      setError(null)

      // Validate all files first
      const validationResults = filesToUpload.map(validateFile)
      const invalidFiles = validationResults.filter((result) => !result.valid)

      if (invalidFiles.length > 0) {
        setError(invalidFiles.map((result) => result.error).join("\n"))
        return
      }

      // Initialize upload progress
      const progressEntries: UploadProgress[] = filesToUpload.map((file, index) => ({
        fileId: `temp-${Date.now()}-${index}`,
        progress: 0,
        status: "uploading",
      }))
      setUploadProgress(progressEntries)

      try {
        const uploadPromises = filesToUpload.map(async (file, index) => {
          const progressEntry = progressEntries[index]

          try {
            // Simulate progress updates (in real implementation, you'd get this from the upload API)
            const progressInterval = setInterval(() => {
              setUploadProgress((prev) =>
                prev.map((p) =>
                  p.fileId === progressEntry.fileId ? { ...p, progress: Math.min(p.progress + 10, 90) } : p,
                ),
              )
            }, 200)

            const uploadedFile = await clientFilesApi.uploadFile(
              file,
              clientId,
              category,
              `Uploaded ${file.name}`,
              "Current User",
            )

            clearInterval(progressInterval)

            // Update progress to complete
            setUploadProgress((prev) =>
              prev.map((p) => (p.fileId === progressEntry.fileId ? { ...p, progress: 100, status: "success" } : p)),
            )

            return uploadedFile
          } catch (error) {
            console.error("Upload failed for file:", file.name, error)

            setUploadProgress((prev) =>
              prev.map((p) =>
                p.fileId === progressEntry.fileId
                  ? {
                      ...p,
                      status: "error",
                      error: error instanceof Error ? error.message : "Upload failed",
                    }
                  : p,
              ),
            )

            return null
          }
        })

        const results = await Promise.all(uploadPromises)
        const successfulUploads = results.filter((file): file is ClientFile => file !== null)

        if (successfulUploads.length > 0) {
          // Update the files list
          onFilesChange([...files, ...successfulUploads])
        }

        // Clear progress after a delay
        setTimeout(() => {
          setUploadProgress([])
        }, 2000)
      } catch (error) {
        console.error("Upload process failed:", error)
        setError(error instanceof Error ? error.message : "Upload failed")
        setUploadProgress([])
      }
    },
    [clientId, category, files, onFilesChange, validateFile],
  )

  // Handle file input change
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileUpload(selectedFiles)
    }
    // Clear the input
    event.target.value = ""
  }

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files)
      }
    },
    [handleFileUpload],
  )

  // Handle file deletion
  const handleDeleteFile = async (fileId: string) => {
    try {
      await clientFilesApi.deleteFile(fileId, "Current User")
      onFilesChange(files.filter((file) => file.id !== fileId))
    } catch (error) {
      console.error("Delete failed:", error)
      setError(error instanceof Error ? error.message : "Delete failed")
    }
  }

  // Handle file editing
  const handleEditFile = (file: ClientFile) => {
    setEditingFile(file)
    setEditDescription(file.description || "")
    setEditCategory(file.file_category)
  }

  const handleSaveEdit = async () => {
    if (!editingFile) return

    try {
      const updatedFile = await clientFilesApi.updateFile(editingFile.id, {
        description: editDescription.trim() || undefined,
        file_category: editCategory,
      })

      onFilesChange(files.map((file) => (file.id === editingFile.id ? updatedFile : file)))

      setEditingFile(null)
      setEditDescription("")
    } catch (error) {
      console.error("Update failed:", error)
      setError(error instanceof Error ? error.message : "Update failed")
    }
  }

  // Handle file download
  const handleDownloadFile = async (file: ClientFile) => {
    try {
      const downloadUrl = await clientFilesApi.getDownloadUrl(file.id)

      // Create download link
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = file.file_name
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Download failed:", error)
      setError(error instanceof Error ? error.message : "Download failed")
    }
  }

  // Handle file preview
  const handleViewFile = (file: ClientFile) => {
    if (file.file_type.includes("image") || file.file_type.includes("pdf")) {
      setShowFilePreview(file)
    } else {
      // For non-previewable files, just download them
      handleDownloadFile(file)
    }
  }

  // Utility functions
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="w-5 h-5 text-red-500" />
    if (type.includes("image")) return <ImageIcon className="w-5 h-5 text-blue-500" />
    if (type.includes("word")) return <FileText className="w-5 h-5 text-blue-600" />
    return <File className="w-5 h-5 text-gray-500" />
  }

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Upload className="w-5 h-5 text-blue-600" />
          {title}
          {files.length > 0 && <span className="text-sm font-normal text-gray-500">({files.length} files)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700 whitespace-pre-line">{error}</div>
              <Button
                onClick={() => setError(null)}
                variant="ghost"
                size="sm"
                className="ml-auto p-1 h-auto text-red-500 hover:text-red-700"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* File Upload Area - Only show when editing */}
        {isEditing && (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <div className="text-sm text-gray-600 mb-2">
              <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-500 font-medium">
                Click to upload files
              </label>
              {" or drag and drop"}
            </div>
            <p className="text-xs text-gray-500">
              {allowedTypes.includes("application/pdf") && "PDF, "}
              {allowedTypes.includes("image/jpeg") && "JPG, PNG, "}
              {allowedTypes.includes("application/msword") && "DOC, DOCX, "}
              up to {formatFileSize(maxFileSize)} each
            </p>
            <input
              id="file-upload"
              type="file"
              multiple
              accept={allowedTypes.join(",")}
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        )}

        {/* Upload Progress */}
        {uploadProgress.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Uploading files...</Label>
            {uploadProgress.map((progress) => (
              <div key={progress.fileId} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Uploading...</span>
                  <div className="flex items-center gap-2">
                    {progress.status === "uploading" && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                    {progress.status === "success" && <Check className="w-4 h-4 text-green-500" />}
                    {progress.status === "error" && <AlertCircle className="w-4 h-4 text-red-500" />}
                    <span className="text-sm text-gray-600">{progress.progress}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progress.status === "error"
                        ? "bg-red-500"
                        : progress.status === "success"
                          ? "bg-green-500"
                          : "bg-blue-500"
                    }`}
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
                {progress.error && <p className="text-xs text-red-600 mt-1">{progress.error}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Files List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Uploaded Files ({files.length})</Label>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(file.file_type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.file_name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{formatFileSize(file.file_size)}</span>
                        <span>•</span>
                        <span>Uploaded {formatDate(file.upload_date)}</span>
                        {file.uploaded_by && (
                          <>
                            <span>•</span>
                            <span>by {file.uploaded_by}</span>
                          </>
                        )}
                      </div>
                      {file.description && <p className="text-xs text-gray-600 mt-1 truncate">{file.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={() => handleViewFile(file)}
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      title="View file"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDownloadFile(file)}
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-800 hover:bg-green-50"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    {isEditing && (
                      <>
                        <Button
                          onClick={() => handleEditFile(file)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                          title="Edit file details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteFile(file.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          title="Delete file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Files Message */}
        {files.length === 0 && !isEditing && (
          <div className="text-center py-8 text-gray-500">
            <File className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No files uploaded yet</p>
          </div>
        )}

        {/* File Preview Modal */}
        {showFilePreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] w-full mx-4 overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{showFilePreview.file_name}</h3>
                  <p className="text-sm text-gray-600">
                    {formatFileSize(showFilePreview.file_size)} • Uploaded {formatDate(showFilePreview.upload_date)}
                    {showFilePreview.uploaded_by && ` by ${showFilePreview.uploaded_by}`}
                  </p>
                  {showFilePreview.description && (
                    <p className="text-sm text-gray-700 mt-1">{showFilePreview.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownloadFile(showFilePreview)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button onClick={() => setShowFilePreview(null)} variant="outline" size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                {showFilePreview.file_type.includes("image") ? (
                  <img
                    src={showFilePreview.public_url || "/placeholder.svg"}
                    alt={showFilePreview.file_name}
                    className="max-w-full max-h-[60vh] object-contain mx-auto"
                  />
                ) : showFilePreview.file_type.includes("pdf") ? (
                  <iframe
                    src={showFilePreview.public_url}
                    className="w-full h-[60vh]"
                    title={showFilePreview.file_name}
                  />
                ) : (
                  <div className="p-8 text-center">
                    {getFileIcon(showFilePreview.file_type)}
                    <p className="text-gray-600 mt-4">Preview not available for this file type</p>
                    <Button onClick={() => handleDownloadFile(showFilePreview)} className="mt-4">
                      <Download className="w-4 h-4 mr-2" />
                      Download to View
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* File Edit Modal */}
        {editingFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit File Details</h3>
                <Button onClick={() => setEditingFile(null)} variant="ghost" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Enter file description..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select value={editCategory} onValueChange={(value: any) => setEditCategory(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="certification">Certification</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <Button onClick={() => setEditingFile(null)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
