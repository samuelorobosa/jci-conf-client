import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { AddAdminForm } from '@/components/forms/AddAdminForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'react-hot-toast';

export function AdminsList() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<User | null>(
    null
  );
  const getAdmins = useAuthStore((state) => state.getAdmins);
  const removeAdmin = useAuthStore((state) => state.removeAdmin);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const adminList = await getAdmins();
      setAdmins(adminList);
    } catch (err) {
      setError('Failed to load admins');
      toast.error('Failed to load admins');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await removeAdmin(adminId);
      await loadAdmins();
      toast.success('Admin removed successfully');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to remove admin'
      );
      toast.error('Failed to remove admin');
    } finally {
      setIsLoading(false);
      setAdminToDelete(null);
    }
  };

  if (!user || user.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Admins</h1>
        <Button onClick={() => setIsAddAdminOpen(true)}>
          Add Admin
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.role}</TableCell>
                <TableCell>
                  {new Date(admin.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAdminToDelete(admin)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddAdminForm
        isOpen={isAddAdminOpen}
        onClose={() => {
          setIsAddAdminOpen(false);
          loadAdmins();
        }}
      />

      <AlertDialog
        open={!!adminToDelete}
        onOpenChange={() => setAdminToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently
              remove the admin
              {adminToDelete && ` ${adminToDelete.email}`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                adminToDelete && handleRemoveAdmin(adminToDelete.id)
              }
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
