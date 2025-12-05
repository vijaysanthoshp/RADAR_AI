"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, Navigation } from "lucide-react"
import { useState } from "react"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  bookingTarget: {
    name: string
    price: string
  } | null
}

export function BookingModal({ isOpen, onClose, bookingTarget }: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    onClose()
    // In a real app, you'd probably show a success toast here
  }

  if (!bookingTarget) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogDescription>
            Review your booking details below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-slate-50 p-4 rounded-lg flex items-center gap-4 mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Booking At</p>
            <h3 className="font-bold text-slate-900">{bookingTarget.name}</h3>
            <p className="text-sm text-emerald-600 font-bold">{bookingTarget.price}</p>
          </div>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="symptoms" className="text-xs font-medium text-slate-500 uppercase tracking-wide">Minor Details</Label>
            <Input
              id="symptoms"
              placeholder="Current Symptoms (Optional)"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select defaultValue="patient">
              <SelectTrigger>
                <SelectValue placeholder="Patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">Patient Only</SelectItem>
                <SelectItem value="caregiver">With Caregiver</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="no">
              <SelectTrigger>
                <SelectValue placeholder="Wheelchair" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">Wheelchair: No</SelectItem>
                <SelectItem value="yes">Wheelchair: Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6" 
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Confirming..." : (
              <>
                Confirm & Track <Navigation className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
