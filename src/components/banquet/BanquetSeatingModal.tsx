import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BanquetTable } from '@/types';
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
import { banquetApi } from '@/lib/api/banquet';

interface BanquetSeatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (tableId: string, seatNumber: string) => void;
}

export const BanquetSeatingModal = ({
  isOpen,
  onClose,
  onAssign,
}: BanquetSeatingModalProps) => {
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [selectedSeat, setSelectedSeat] = useState<string>('');

  const { data: tables } = useQuery<BanquetTable[]>({
    queryKey: ['banquet-tables'],
    queryFn: () => banquetApi.getTables(),
  });

  const handleSubmit = () => {
    if (!selectedTable || !selectedSeat) {
      toast.error('Please select both table and seat');
      return;
    }
    onAssign(selectedTable, selectedSeat);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Banquet Seat</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Select
              value={selectedTable}
              onValueChange={setSelectedTable}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select table" />
              </SelectTrigger>
              <SelectContent>
                {tables?.map((table) => (
                  <SelectItem key={table.id} value={table.id}>
                    Table {table.tableNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={selectedSeat}
              onValueChange={setSelectedSeat}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select seat" />
              </SelectTrigger>
              <SelectContent>
                {selectedTable &&
                  tables
                    ?.find((t) => t.id === selectedTable)
                    ?.seats.filter((seat) => !seat.isOccupied)
                    .map((seat) => (
                      <SelectItem
                        key={seat.number}
                        value={seat.number}
                      >
                        Seat {seat.number}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Assign Seat</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
