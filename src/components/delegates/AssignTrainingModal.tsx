import { FC, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Training } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { trainingsApi } from '@/lib/api/trainings';
import { delegatesApi } from '@/lib/api/delegates';

interface AssignTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  delegateId: string;
  onAssign: (trainingIds: string[]) => void;
  isSubmitting?: boolean;
}

export const AssignTrainingModal: FC<AssignTrainingModalProps> = ({
  isOpen,
  onClose,
  delegateId,
  onAssign,
  isSubmitting = false,
}) => {
  const [selectedTrainings, setSelectedTrainings] = useState<
    string[]
  >([]);

  const { data: trainings, isLoading: isLoadingTrainings } = useQuery<
    Training[]
  >({
    queryKey: ['trainings'],
    queryFn: trainingsApi.getTrainings,
  });

  const { data: delegate, isLoading: isLoadingDelegate } = useQuery({
    queryKey: ['delegate', delegateId],
    queryFn: () => delegatesApi.getDelegateById(delegateId),
    enabled: !!delegateId,
  });

  useEffect(() => {
    if (delegate?.trainings) {
      setSelectedTrainings(
        delegate.trainings.map((training) => training.id)
      );
    }
  }, [delegate]);

  const handleToggleTraining = (trainingId: string) => {
    setSelectedTrainings((prev) =>
      prev.includes(trainingId)
        ? prev.filter((id) => id !== trainingId)
        : [...prev, trainingId]
    );
  };

  const handleSubmit = () => {
    onAssign(selectedTrainings);
    onClose();
  };

  const isLoading = isLoadingTrainings || isLoadingDelegate;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Trainings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-2">
              {trainings?.map((training) => (
                <div
                  key={training.id}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={training.id}
                    checked={selectedTrainings.includes(training.id)}
                    onCheckedChange={() =>
                      handleToggleTraining(training.id)
                    }
                  />
                  <label
                    htmlFor={training.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {training.name} - {training.trainer} (
                    {training.date} at {training.time})
                  </label>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
