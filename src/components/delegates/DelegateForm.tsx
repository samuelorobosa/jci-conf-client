import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Delegate, OrganizationType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DelegateTrainings } from './DelegateTrainings';

const delegateSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  localOrganization: z
    .string()
    .min(1, 'Local organization is required'),
  organizationType: z.enum(['CITY', 'COLLEGIATE'] as const),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
});

type DelegateFormData = z.infer<typeof delegateSchema>;

interface DelegateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DelegateFormData) => void;
  initialData?: Partial<Delegate>;
  isSubmitting?: boolean;
}

export const DelegateForm: FC<DelegateFormProps> = ({
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
    setValue,
  } = useForm<DelegateFormData>({
    resolver: zodResolver(delegateSchema),
    defaultValues: initialData,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Delegate' : 'Add Delegate'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              {...register('fullName')}
              placeholder="Full Name"
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              {...register('localOrganization')}
              placeholder="Local Organization"
            />
            {errors.localOrganization && (
              <p className="text-sm text-red-500">
                {errors.localOrganization.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Select
              onValueChange={(value) =>
                setValue(
                  'organizationType',
                  value as OrganizationType
                )
              }
              defaultValue={initialData?.organizationType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Organization Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CITY">City</SelectItem>
                <SelectItem value="COLLEGIATE">Collegiate</SelectItem>
              </SelectContent>
            </Select>
            {errors.organizationType && (
              <p className="text-sm text-red-500">
                {errors.organizationType.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              {...register('email')}
              type="email"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              {...register('phoneNumber')}
              placeholder="Phone Number"
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          {initialData?.id && (
            <div className="mt-6">
              <DelegateTrainings delegateId={initialData.id} />
            </div>
          )}
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
