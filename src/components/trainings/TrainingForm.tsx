import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Training } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const trainingSchema = z.object({
  name: z.string().min(1, 'Training name is required'),
  trainer: z.string().min(1, 'Trainer name is required'),
  location: z.string().min(1, 'Location is required'),
  time: z.string().min(1, 'Time is required'),
  date: z.string().min(1, 'Date is required'),
});

type TrainingFormData = z.infer<typeof trainingSchema>;

interface TrainingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TrainingFormData) => void;
  initialData?: Partial<Training>;
  isSubmitting?: boolean;
}

export const TrainingForm: FC<TrainingFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrainingFormData>({
    resolver: zodResolver(trainingSchema),
    defaultValues: initialData,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Training' : 'Add Training'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              {...register('name')}
              placeholder="Training Name"
              error={errors.name?.message}
            />
          </div>
          <div className="space-y-2">
            <Input
              {...register('trainer')}
              placeholder="Trainer Name"
              error={errors.trainer?.message}
            />
          </div>
          <div className="space-y-2">
            <Input
              {...register('location')}
              placeholder="Location"
              error={errors.location?.message}
            />
          </div>
          <div className="space-y-2">
            <Input
              {...register('time')}
              type="time"
              error={errors.time?.message}
            />
          </div>
          <div className="space-y-2">
            <Input
              {...register('date')}
              type="date"
              error={errors.date?.message}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
