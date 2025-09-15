"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Download, Eye, X, File, Trash2, Edit3 } from "lucide-react"
import { clientFilesApi, type ClientFile } from "@/lib/supabase"

interface FileUploadManagerProps {
  clientId: string
  category: "certification" | "education" | "general"
  files: ClientFile[]
  onFilesChange: (files: ClientFile[]) => void
  isEditing: boolean
  title: string
}

export function FileUploadManager({
  clientId,
  category,
  files,
  onFilesChange,
  isEditing,
  title,
}: FileUploadManagerProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [showFilePreview, setShowFilePreview] = useState<ClientFile | null>(null)
  const [editingFile, setEditingFile] = useState<ClientFile | null>(null)
  const [editDescription, setEditDescription] = useState("")

  // Load files when component mounts or clientId changes
  useEffect(() => {
    loadFiles()
  }, [clientId, category])

  const loadFiles = async () => {
    try {
      const loadedFiles = await clientFilesApi.getByClientId(clientId, category)
      onFilesChange(loadedFiles)
    } catch (error) {
      console.error("Error loading files:", error)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (!selectedFiles) return

    setIsUploading(true)
    const newFiles: ClientFile[] = []

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ]
      if (!allowedTypes.includes(file.type)) {
        alert(`File type not supported: ${file.name}. Please upload PDF, DOC, DOCX, JPG, or PNG files.`)
        continue
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File too large: ${file.name}. Please upload files smaller than 10MB.`)
        continue
      }

      try {
        // Set upload progress
        setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))

        // Upload file to database and storage
        const uploadedFile = await clientFilesApi.uploadFile(file, clientId, category, undefined, "Current User")

        // Update progress to 100%
        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }))

        newFiles.push(uploadedFile)
      } catch (error) {
        console.error("Error uploading file:", error)
        alert(`Failed to upload ${file.name}. Please try again.`)
      }
    }

    // Update files list
    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles]
      onFilesChange(updatedFiles)
    }

    // Clear upload progress
    setTimeout(() => {
      setUploadProgress({})
    }, 1000)

    setIsUploading(false)
    // Clear the input
    event.target.value = ""
  }

  const removeFile = async (fileId: string) => {
    try {
      await clientFilesApi.deleteFile(fileId, "Current User")
      const updatedFiles = files.filter((file) => file.id !== fileId)
      onFilesChange(updatedFiles)
    } catch (error) {
      console.error("Error removing file:", error)
      alert("Failed to remove file. Please try again.")
    }
  }

  const downloadFile = async (file: ClientFile) => {
    try {
      const downloadUrl = await clientFilesApi.getDownloadUrl(file.id)
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = file.file_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading file:", error)
      alert("Failed to download file. Please try again.")
    }
  }

  const viewFile = async (file: ClientFile) => {
    if (file.file_type.includes("image") || file.file_type.includes("pdf")) {
      setShowFilePreview(file)
    } else {
      // For non-previewable files, just download them
      downloadFile(file)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return "📄"
    if (type.includes("image")) return "🖼️"
    if (type.includes("word")) return "📝"
    return "📎"
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const handleEditFile = (file: ClientFile) => {
    setEditingFile(file)
    setEditDescription(file.description || "")
  }

  const handleSaveEdit = async () => {
    if (!editingFile) return

    try {
      const updatedFile = await clientFilesApi.updateFile(editingFile.id, {
        description: editDescription.trim() || undefined,
      })

      const updatedFiles = files.map((file) => (file.id === editingFile.id ? updatedFile : file))
      onFilesChange(updatedFiles)

      setEditingFile(null)
      setEditDescription("")
    } catch (error) {
      console.error("Error updating file:", error)
      alert("Failed to update file. Please try again.")
    }
  }

  const handleCancelEdit = () => {
    setEditingFile(null)
    setEditDescription("")
  }

  return (
    <>
      <Card className="border border-gray-200">
        <CardHeader className="pb-2 px-4 pt-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <File className="w-5 h-5 text-orange-600" />
            {title} ({files.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-4 pb-3 pt-0">
          {/* File Upload Section - Only visible when editing */}
          {isEditing && (
            <div>
              <label className="text-sm font-medium text-gray-600">Upload Documents</label>
              <div className="mt-2">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <div className="text-sm text-gray-600 mb-2">
                    <label
                      htmlFor={`file-upload-${category}`}
                      className="cursor-pointer text-blue-600 hover:text-blue-500"
                    >
                      Click to upload files
                    </label>
                    {" or drag and drop"}
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB each</p>
                  <input
                    id={`file-upload-${category}`}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="space-y-2">
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">{fileName}</span>
                    <span className="text-sm text-gray-500">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Display files */}
          {files.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600">Uploaded Documents</label>
              <div className="mt-2 space-y-2">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-2xl">{getFileIcon(file.file_type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.file_name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.file_size)} • Uploaded {formatDate(file.upload_date)}
                        </p>
                        {file.description && <p className="text-xs text-gray-600 mt-1">{file.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        onClick={() => viewFile(file)}
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        title="View file"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        onClick={() => downloadFile(file)}
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
                            type="button"
                            onClick={() => handleEditFile(file)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                            title="Edit file details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            onClick={() => removeFile(file.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            title="Remove file"
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

          {files.length === 0 && !isEditing && (
            <p className="text-sm text-gray-500 italic text-center py-4">No documents uploaded yet</p>
          )}
        </CardContent>
      </Card>

      {/* File Preview Modal */}
      {showFilePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] w-full mx-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{showFilePreview.file_name}</h3>
                <p className="text-sm text-gray-600">
                  {formatFileSize(showFilePreview.file_size)} • Uploaded {formatDate(showFilePreview.upload_date)}
                </p>
                {showFilePreview.description && (
                  <p className="text-sm text-gray-700 mt-1">{showFilePreview.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => downloadFile(showFilePreview)}
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
                  <File className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Preview not available for this file type</p>
                  <Button onClick={() => downloadFile(showFilePreview)} className="mt-4">
                    <Download className="w-4 h-4 mr-2" />
                    Download to View
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit File Modal */}
      {editingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit File Details</h3>
              <Button onClick={handleCancelEdit} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">File Name</p>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{editingFile.file_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="Add a description for this file..."
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <Button onClick={handleCancelEdit} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
