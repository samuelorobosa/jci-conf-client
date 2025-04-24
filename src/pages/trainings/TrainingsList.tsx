import { FC, useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Training } from '@/types';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { TrainingForm } from '@/components/trainings/TrainingForm';
import { toast } from 'react-hot-toast';
import { trainingsApi } from '@/lib/api/trainings';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const TrainingsList: FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] =
    useState<Training | null>(null);
  const queryClient = useQueryClient();

  const { data: trainings, isLoading } = useQuery<Training[]>({
    queryKey: ['trainings'],
    queryFn: trainingsApi.getTrainings,
  });

  const { mutate: saveTraining, isPending: isSaving } = useMutation({
    mutationFn: async (data: Omit<Training, 'id'>) => {
      if (selectedTraining) {
        return trainingsApi.updateTraining(selectedTraining.id, data);
      }
      return trainingsApi.createTraining(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      toast.success(
        selectedTraining
          ? 'Training updated successfully'
          : 'Training added successfully'
      );
      setIsFormOpen(false);
      setSelectedTraining(null);
    },
    onError: () => {
      toast.error('Failed to save training');
    },
  });

  const { mutate: deleteTraining, isPending: isDeleting } =
    useMutation({
      mutationFn: async (id: string) => {
        await trainingsApi.deleteTraining(id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['trainings'] });
        toast.success('Training deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete training');
      },
    });

  const handleAddClick = () => {
    setSelectedTraining(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (training: Training) => {
    setSelectedTraining(training);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (training: Training) => {
    if (
      window.confirm('Are you sure you want to delete this training?')
    ) {
      deleteTraining(training.id);
    }
  };

  const handleFormSubmit = (data: Omit<Training, 'id'>) => {
    saveTraining(data);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Trainings</h2>
          <Button
            onClick={handleAddClick}
            className="flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Training</span>
          </Button>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Trainer</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainings?.map((training) => (
                <TableRow key={training.id}>
                  <TableCell>{training.name}</TableCell>
                  <TableCell>{training.trainer}</TableCell>
                  <TableCell>{training.location}</TableCell>
                  <TableCell>{training.time}</TableCell>
                  <TableCell>{training.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditClick(training)}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(training)}
                          className="text-red-600"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <TrainingForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedTraining(null);
          }}
          onSubmit={handleFormSubmit}
          initialData={selectedTraining || undefined}
          isSubmitting={isSaving}
        />
      </div>
    </DashboardLayout>
  );
};
