import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { IDevice } from '@/lib/types';
import { useChangeDeviceModeMutation } from '@/queries/devices';
import { Cog } from 'lucide-react';
import { toast } from 'sonner';

const ModeChange = ({ device, id }: { device: IDevice; id: string }) => {
  // Form states
  //   const [mode, setMode] = useState<'clock' | 'notice'>(device.mode);
  const [changeMode] = useChangeDeviceModeMutation();

  const handleModeSubmit = async () => {
    try {
      const mode = device.mode === 'notice' ? 'clock' : 'notice';

      await changeMode({ id, mode }).unwrap();

      toast.success('Device Mode Updated', {
        description: `Device mode changed to ${mode}.`,
      });
      // refetch();
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Update Failed', {
        description: error?.data?.message || 'Failed to update device mode.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cog className="text-primary h-5 w-5" />
          Device Mode Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between gap-8">
          <p>Clock</p>
          <Switch
            className="cursor-pointer"
            checked={device.mode === 'notice'}
            onClick={handleModeSubmit}
          />
          <p>Notice</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModeChange;
