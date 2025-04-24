import { FC } from 'react';
import { Delegate } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface DelegateDetailsProps {
  delegate: Delegate;
  isOpen: boolean;
  onClose: () => void;
}

export const DelegateDetails: FC<DelegateDetailsProps> = ({
  delegate,
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Delegate Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Full Name
                  </p>
                  <p className="mt-1">{delegate.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Email
                  </p>
                  <p className="mt-1">{delegate.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Phone Number
                  </p>
                  <p className="mt-1">{delegate.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Organization Type
                  </p>
                  <p className="mt-1">
                    <Badge variant="secondary">
                      {delegate.organizationType}
                    </Badge>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Local Organization
                  </p>
                  <p className="mt-1">{delegate.localOrganization}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Created At
                  </p>
                  <p className="mt-1">
                    {new Date(
                      delegate.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Trainings */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned Trainings</CardTitle>
            </CardHeader>
            <CardContent>
              {delegate.trainings && delegate.trainings.length > 0 ? (
                <div className="space-y-4">
                  {delegate.trainings.map((training) => (
                    <div
                      key={training.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-medium">
                          {training.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {training.trainer} • {training.location}
                        </p>
                        <p className="text-sm text-gray-500">
                          {training.date} at {training.time}
                        </p>
                      </div>
                      <Badge variant="secondary">Assigned</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No trainings assigned yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Banquet Seating */}
          <Card>
            <CardHeader>
              <CardTitle>Banquet Seating</CardTitle>
            </CardHeader>
            <CardContent>
              {delegate.banquetSeat ? (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    Table {delegate.banquetSeat.tableNumber}, Seat{' '}
                    {delegate.banquetSeat.seatNumber}
                  </Badge>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No banquet seating assigned yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
