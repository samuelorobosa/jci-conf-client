import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Training } from '@/types';
import { trainingsApi } from '@/lib/api/trainings';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DelegateTrainingsProps {
  delegateId: string;
}

export const DelegateTrainings: FC<DelegateTrainingsProps> = ({
  delegateId,
}) => {
  const { data: trainings, isLoading } = useQuery<Training[]>({
    queryKey: ['delegate-trainings', delegateId],
    queryFn: () => trainingsApi.getDelegateTrainings(delegateId),
  });

  if (isLoading) {
    return <div>Loading trainings...</div>;
  }

  if (!trainings || trainings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assigned Trainings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            No trainings assigned yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned Trainings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trainings.map((training) => (
            <div
              key={training.id}
              className="flex items-center justify-between"
            >
              <div>
                <h4 className="font-medium">{training.name}</h4>
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
      </CardContent>
    </Card>
  );
};
