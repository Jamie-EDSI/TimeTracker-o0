"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Trash2, RotateCcw } from "lucide-react"

interface Client {
  id: string
  firstName: string
  lastName: string
  participantId: string
  program: string
  email: string
}

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  client: Client
  isLoading?: boolean
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  client,
  isLoading = false,
}: DeleteConfirmationDialogProps) {
  const [confirmText, setConfirmText] = useState("")
  const [isConfirmValid, setIsConfirmValid] = useState(false)

  const handleConfirmTextChange = (value: string) => {
    setConfirmText(value)
    setIsConfirmValid(value.toUpperCase() === "DELETE")
  }

  const handleConfirm = () => {
    if (isConfirmValid && !isLoading) {
      onConfirm()
      setConfirmText("")
      setIsConfirmValid(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
      setConfirmText("")
      setIsConfirmValid(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Delete Client Record
          </DialogTitle>
          <DialogDescription className="text-left space-y-2">
            <p>You are about to delete the following client record:</p>
            <div className="bg-gray-50 p-3 rounded-md border">
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Name:</span> {client.firstName} {client.lastName}
                </p>
                <p>
                  <span className="font-medium">Participant ID:</span> {client.participantId}
                </p>
                <p>
                  <span className="font-medium">Program:</span> {client.program}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {client.email}
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Safety Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start gap-2">
              <RotateCcw className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Don't worry - this is safe!</p>
                <p>
                  This record will be moved to the <strong>Recycle Bin</strong> where it can be restored if needed. The
                  record won't be permanently deleted unless you choose to do so from the Recycle Bin.
                </p>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <Label htmlFor="confirm-delete" className="text-sm font-medium">
              To confirm deletion, type <span className="font-mono bg-gray-100 px-1 rounded">DELETE</span> below:
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => handleConfirmTextChange(e.target.value)}
              placeholder="Type DELETE to confirm"
              className={`font-mono ${confirmText && !isConfirmValid ? "border-red-300 focus:border-red-500" : ""}`}
              disabled={isLoading}
            />
            {confirmText && !isConfirmValid && (
              <p className="text-xs text-red-600">Please type "DELETE" exactly as shown</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmValid || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Move to Recycle Bin
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
