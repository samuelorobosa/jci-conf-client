import { FC, useState, useEffect } from 'react';
import { Delegate } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Check, Loader2 } from 'lucide-react';
import { qrApi } from '@/lib/api/qr';
import { toast } from 'react-hot-toast';

interface ScannedDelegateInfoProps {
  isOpen: boolean;
  onClose: () => void;
  delegate: Delegate;
  eventId?: string;
}

export const ScannedDelegateInfo: FC<ScannedDelegateInfoProps> = ({
  isOpen,
  onClose,
  delegate,
  eventId,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAttendance, setIsCheckingAttendance] =
    useState(true);
  const [isAlreadyCheckedIn, setIsAlreadyCheckedIn] = useState(false);

  useEffect(() => {
    if (isOpen && eventId) {
      checkAttendanceStatus();
    }
  }, [isOpen, eventId]);

  const checkAttendanceStatus = async () => {
    if (!eventId) return;

    setIsCheckingAttendance(true);
    try {
      const attendance = await qrApi.getDelegateAttendance(
        delegate.id
      );
      const isCheckedIn = attendance.some(
        (record) => record.eventId === eventId
      );
      setIsAlreadyCheckedIn(isCheckedIn);
    } catch {
      // If we can't check attendance status, we'll assume they're not checked in
      setIsAlreadyCheckedIn(false);
    } finally {
      setIsCheckingAttendance(false);
    }
  };

  const handleRecordAttendance = async () => {
    if (!eventId) {
      setError('Event ID is required');
      toast.error('Event ID is required');
      return;
    }

    if (isAlreadyCheckedIn) {
      setError('Delegate is already checked in');
      toast.error('Delegate is already checked in');
      return;
    }

    setIsRecording(true);
    setError(null);
    try {
      await qrApi.recordAttendance(delegate.id, eventId);
      toast.success('Attendance recorded successfully');
      setIsAlreadyCheckedIn(true);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError('Failed to record attendance');
        toast.error('Failed to record attendance');
      }
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delegate Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Full Name
              </h3>
              <p className="mt-1">{delegate.fullName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Local Organization
              </h3>
              <p className="mt-1">{delegate.localOrganization}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Organization Type
              </h3>
              <p className="mt-1">{delegate.organizationType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Email
              </h3>
              <p className="mt-1">{delegate.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Phone Number
              </h3>
              <p className="mt-1">{delegate.phoneNumber}</p>
            </div>
            {delegate.banquetSeat && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Banquet Seating
                </h3>
                <p className="mt-1">
                  Table {delegate.banquetSeat.tableNumber}, Seat{' '}
                  {delegate.banquetSeat.seatNumber}
                </p>
              </div>
            )}
          </div>

          {delegate.trainings.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Trainings
              </h3>
              <ul className="mt-1 space-y-2">
                {delegate.trainings.map((training) => (
                  <li key={training.id} className="text-sm">
                    {training.name} - {training.trainer} (
                    {training.date} at {training.time})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            {eventId && (
              <Button
                onClick={handleRecordAttendance}
                disabled={
                  isRecording ||
                  isCheckingAttendance ||
                  isAlreadyCheckedIn
                }
                className="flex items-center space-x-2"
              >
                {isRecording ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Recording...</span>
                  </>
                ) : isCheckingAttendance ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Checking Status...</span>
                  </>
                ) : isAlreadyCheckedIn ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Already Checked In</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Record Attendance</span>
                  </>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Close</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
