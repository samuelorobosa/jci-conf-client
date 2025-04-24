import { FC, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Delegate, BanquetTable } from '@/types';
import { Button } from '@/components/ui/button';
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

// Dummy data for now
const dummyTables: BanquetTable[] = [
  {
    id: '1',
    tableNumber: 1,
    maxCapacity: 10,
    currentOccupancy: 5,
    isDignitaryTable: true,
  },
  {
    id: '2',
    tableNumber: 2,
    maxCapacity: 10,
    currentOccupancy: 3,
    isDignitaryTable: false,
  },
  // Add more dummy data as needed
];

interface BanquetSeatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  delegate: Delegate;
  onAssign: (tableNumber: number, seatNumber: number) => void;
  isSubmitting?: boolean;
}

export const BanquetSeatingModal: FC<BanquetSeatingModalProps> = ({
  isOpen,
  onClose,
  delegate,
  onAssign,
  isSubmitting = false,
}) => {
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [selectedSeat, setSelectedSeat] = useState<string>('');

  const { data: tables, isLoading } = useQuery<BanquetTable[]>({
    queryKey: ['banquet-tables'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return dummyTables;
    },
  });

  const handleSubmit = () => {
    if (!selectedTable || !selectedSeat) {
      toast.error('Please select both table and seat number');
      return;
    }
    onAssign(Number(selectedTable), Number(selectedSeat));
    onClose();
  };

  const getAvailableSeats = (tableNumber: number) => {
    const table = tables?.find((t) => t.tableNumber === tableNumber);
    if (!table) return [];
    return Array.from(
      { length: table.maxCapacity - table.currentOccupancy },
      (_, i) => i + 1
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Banquet Seating</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Table Number
            </label>
            <Select
              value={selectedTable}
              onValueChange={setSelectedTable}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a table" />
              </SelectTrigger>
              <SelectContent>
                {tables?.map((table) => (
                  <SelectItem
                    key={table.id}
                    value={table.tableNumber.toString()}
                    disabled={
                      table.currentOccupancy >= table.maxCapacity
                    }
                  >
                    Table {table.tableNumber} (
                    {table.maxCapacity - table.currentOccupancy} seats
                    available)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTable && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Seat Number
              </label>
              <Select
                value={selectedSeat}
                onValueChange={setSelectedSeat}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a seat" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableSeats(Number(selectedTable)).map(
                    (seat) => (
                      <SelectItem key={seat} value={seat.toString()}>
                        Seat {seat}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Assigning...' : 'Assign Seat'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
