import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IScheduledNotice } from '@/lib/types';
import { useCancelScheduledNoticeMutation } from '@/queries/devices';
import { format } from 'date-fns';
import { AlertTriangle, Bell, Trash } from 'lucide-react';
import { toast } from 'sonner';

const ScheduledNotice = ({
  id,
  schedules = [],
}: {
  id: string;
  schedules?: IScheduledNotice[];
}) => {
  const [cancelScheduledNotice] = useCancelScheduledNoticeMutation();
  const cancelScheduledNoticeHandler = async (noticeId: string) => {
    try {
      await cancelScheduledNotice({ id, noticeId }).unwrap();
      toast.success('Scheduled Notice Cancelled', {
        description: 'The scheduled notice has been cancelled successfully.',
      });
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Cancellation Failed', {
        description:
          error?.data?.message || 'Failed to cancel scheduled notice.',
      });
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="text-primary h-5 w-5" />
          Scheduled Notices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600 overflow-x-auto">
          <div className="w-full">
            {(schedules?.length ?? 0) > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="hidden sm:table-cell">From</TableHead>
                    <TableHead>To</TableHead>

                    <TableHead className="hidden md:table-cell">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules?.map((notice, index) => (
                    <TableRow key={notice._id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{index + 1}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>{notice.notice}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {format(new Date(notice.start_time), 'PPPpp')}
                        {/* {format(
                            new Date(notice.start_time),
                            "yyyy-MM-dd hh:mm:ss a"
                          )} */}
                      </TableCell>
                      <TableCell>
                        {format(new Date(notice.end_time), 'PPPpp')}
                      </TableCell>

                      <TableCell className="text-muted-foreground hidden text-sm md:table-cell">
                        <Trash
                          className="h-5 w-5 cursor-pointer text-red-500 hover:text-red-600"
                          onClick={() =>
                            cancelScheduledNoticeHandler(notice._id)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-12 text-center">
                <AlertTriangle className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <h3 className="mb-2 text-lg font-medium">
                  No Scheduled Notices
                </h3>
                <p className="text-muted-foreground">
                  There are currently no scheduled notices for this device.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduledNotice;
