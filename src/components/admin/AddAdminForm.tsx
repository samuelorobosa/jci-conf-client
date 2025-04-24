import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { UserRole } from '@/types';

const addAdminSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN'] as const),
});

type AddAdminFormData = z.infer<typeof addAdminSchema>;

interface AddAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddAdminForm: FC<AddAdminFormProps> = ({
  isOpen,
  onClose,
}) => {
  const { addAdmin, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddAdminFormData>({
    resolver: zodResolver(addAdminSchema),
  });

  const onSubmit = async (data: AddAdminFormData) => {
    try {
      await addAdmin(data.email, data.role);
      toast.success('Admin added successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to add admin');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Admin</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              {...register('email')}
              type="email"
              placeholder="Email"
              error={errors.email?.message}
            />
          </div>
          <div className="space-y-2">
            <Select
              onValueChange={(value) =>
                setValue('role', value as UserRole)
              }
              defaultValue="ADMIN"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">
                {errors.role.message}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Admin'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
