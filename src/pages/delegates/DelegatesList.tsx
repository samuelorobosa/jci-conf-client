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
import { Delegate, DelegateFormData } from '@/types';
import {
  Plus,
  Pencil,
  Calendar,
  Users,
  QrCode,
  MoreVertical,
  Trash2,
  Eye,
  Search,
} from 'lucide-react';
import { DelegateForm } from '@/components/delegates/DelegateForm';
import { AssignTrainingModal } from '@/components/delegates/AssignTrainingModal';
import { BanquetSeatingModal } from '@/components/banquet/BanquetSeatingModal';
import { DelegateQRCode } from '@/components/delegates/DelegateQRCode';
import { DelegateDetails } from '@/components/delegates/DelegateDetails';
import { toast } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { delegatesApi } from '@/lib/api/delegates';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export const DelegatesList: FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAssignTrainingOpen, setIsAssignTrainingOpen] =
    useState(false);
  const [isBanquetSeatingOpen, setIsBanquetSeatingOpen] =
    useState(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedDelegate, setSelectedDelegate] =
    useState<Delegate | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [localOrganization, setLocalOrganization] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['delegates', page, limit, search, localOrganization],
    queryFn: () =>
      delegatesApi.getDelegates({
        page,
        limit,
        search,
        localOrganization,
      }),
  });

  const { mutate: saveDelegate, isPending: isSaving } = useMutation({
    mutationFn: async (data: DelegateFormData) => {
      if (selectedDelegate) {
        return delegatesApi.updateDelegate(selectedDelegate.id, data);
      }
      return delegatesApi.createDelegate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delegates'] });
      toast.success(
        selectedDelegate
          ? 'Delegate updated successfully'
          : 'Delegate added successfully'
      );
      setIsFormOpen(false);
      setSelectedDelegate(null);
    },
    onError: () => {
      toast.error('Failed to save delegate');
    },
  });

  const { mutate: deleteDelegate } = useMutation({
    mutationFn: async (id: string) => {
      await delegatesApi.deleteDelegate(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delegates'] });
      toast.success('Delegate deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete delegate');
    },
  });

  const { mutate: assignTrainings, isPending: isAssigning } =
    useMutation({
      mutationFn: async ({
        delegateId,
        trainingIds,
      }: {
        delegateId: string;
        trainingIds: string[];
      }) => {
        return delegatesApi.assignTrainings(delegateId, trainingIds);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['delegates'] });
        toast.success('Trainings assigned successfully');
        setIsAssignTrainingOpen(false);
      },
      onError: () => {
        toast.error('Failed to assign trainings');
      },
    });

  const { mutate: assignBanquetSeating } = useMutation({
    mutationFn: async ({
      delegateId,
      tableNumber,
      seatNumber,
    }: {
      delegateId: string;
      tableNumber: number;
      seatNumber: number;
    }) => {
      return delegatesApi.assignBanquetSeating(
        delegateId,
        tableNumber,
        seatNumber
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delegates'] });
      toast.success('Banquet seating assigned successfully');
      setIsBanquetSeatingOpen(false);
    },
    onError: () => {
      toast.error('Failed to assign banquet seating');
    },
  });

  const handleAddClick = () => {
    setSelectedDelegate(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (delegate: Delegate) => {
    setSelectedDelegate(delegate);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (delegate: Delegate) => {
    if (
      window.confirm('Are you sure you want to delete this delegate?')
    ) {
      deleteDelegate(delegate.id);
    }
  };

  const handleAssignTrainingClick = (delegate: Delegate) => {
    setSelectedDelegate(delegate);
    setIsAssignTrainingOpen(true);
  };

  const handleBanquetSeatingClick = (delegate: Delegate) => {
    setSelectedDelegate(delegate);
    setIsBanquetSeatingOpen(true);
  };

  const handleQRCodeClick = (delegate: Delegate) => {
    setSelectedDelegate(delegate);
    setIsQRCodeOpen(true);
  };

  const handleViewDetailsClick = (delegate: Delegate) => {
    setSelectedDelegate(delegate);
    setIsDetailsOpen(true);
  };

  const handleFormSubmit = (data: DelegateFormData) => {
    saveDelegate(data);
  };

  const handleAssignTrainings = (trainingIds: string[]) => {
    if (selectedDelegate) {
      assignTrainings({
        delegateId: selectedDelegate.id,
        trainingIds,
      });
    }
  };

  const handleAssignBanquetSeating = (
    tableId: string,
    seatNumber: string
  ) => {
    if (selectedDelegate) {
      assignBanquetSeating({
        delegateId: selectedDelegate.id,
        tableNumber: Number(tableId),
        seatNumber: Number(seatNumber),
      });
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  };

  const handleLocalOrganizationChange = (value: string) => {
    setLocalOrganization(value === 'all' ? '' : value);
    setPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Delegates</h2>
        <Button
          onClick={handleAddClick}
          className="flex items-center space-x-2 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          <span>Add Delegate</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or organization..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <Select
          value={localOrganization || 'all'}
          onValueChange={handleLocalOrganizationChange}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by organization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Organizations</SelectItem>
            {data?.data
              .map((d) => d.localOrganization)
              .filter(
                (value, index, self) => self.indexOf(value) === index
              )
              .map((org) => (
                <SelectItem key={org} value={org}>
                  {org}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Local Organization</TableHead>
                  <TableHead>Organization Type</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.map((delegate) => (
                  <TableRow key={delegate.id}>
                    <TableCell className="whitespace-nowrap">
                      {delegate.fullName}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {delegate.localOrganization}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {delegate.organizationType}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {delegate.email}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {delegate.phoneNumber}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-[200px]"
                        >
                          <DropdownMenuItem
                            onClick={() =>
                              handleViewDetailsClick(delegate)
                            }
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditClick(delegate)}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleAssignTrainingClick(delegate)
                            }
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Assign Training
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleBanquetSeatingClick(delegate)
                            }
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Banquet Seating
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleQRCodeClick(delegate)
                            }
                          >
                            <QrCode className="h-4 w-4 mr-2" />
                            View QR Code
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteClick(delegate)
                            }
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data?.pagination && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="hidden sm:flex"
                    />
                  </PaginationItem>
                  {Array.from(
                    { length: data.pagination.totalPages },
                    (_, i) => i + 1
                  )
                    .filter((p) => {
                      if (data.pagination.totalPages <= 7)
                        return true;
                      if (p === 1 || p === data.pagination.totalPages)
                        return true;
                      if (p >= page - 1 && p <= page + 1) return true;
                      return false;
                    })
                    .map((p, i, arr) => {
                      if (i > 0 && arr[i - 1] !== p - 1) {
                        return (
                          <PaginationItem key={`ellipsis-${p}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return (
                        <PaginationItem key={p}>
                          <PaginationLink
                            onClick={() => handlePageChange(p)}
                            isActive={p === page}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === data.pagination.totalPages}
                      className="hidden sm:flex"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      <DelegateForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedDelegate(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedDelegate || undefined}
        isSubmitting={isSaving}
      />

      {selectedDelegate && (
        <>
          <AssignTrainingModal
            isOpen={isAssignTrainingOpen}
            onClose={() => {
              setIsAssignTrainingOpen(false);
              setSelectedDelegate(null);
            }}
            delegateId={selectedDelegate.id}
            onAssign={handleAssignTrainings}
            isSubmitting={isAssigning}
          />
          <BanquetSeatingModal
            isOpen={isBanquetSeatingOpen}
            onClose={() => {
              setIsBanquetSeatingOpen(false);
              setSelectedDelegate(null);
            }}
            onAssign={handleAssignBanquetSeating}
          />
          <DelegateQRCode
            isOpen={isQRCodeOpen}
            onClose={() => {
              setIsQRCodeOpen(false);
              setSelectedDelegate(null);
            }}
            delegate={selectedDelegate}
          />
          <DelegateDetails
            isOpen={isDetailsOpen}
            onClose={() => {
              setIsDetailsOpen(false);
              setSelectedDelegate(null);
            }}
            delegate={selectedDelegate}
          />
        </>
      )}
    </div>
  );
};
