import { Card, CardContent } from '@/components/ui/card';
import { IDevice } from '@/lib/types';
import { useChangeDeviceModeMutation } from '@/queries/devices';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

const ModeChange = ({
  device,
  id,
  newMode,
}: {
  device: IDevice;
  id: string;
  newMode: 'clock' | 'notice';
}) => {
  // Form states
  //   const [mode, setMode] = useState<'clock' | 'notice'>(device.mode);
  const [changeMode, { isLoading }] = useChangeDeviceModeMutation();

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
    <Card className="mb-6">
      <CardContent className="">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <Label className="text-lg font-medium">
              <ShieldCheck className="text-primary inline-block h-6 w-6" />
              Enable
              <span className="capitalize">{newMode}</span>
              Mode
            </Label>
            <p className="pt-2 text-sm">
              {newMode === 'notice'
                ? 'Switch the device to Notice mode to display important messages.'
                : 'Switch the device to Clock mode to show the current time.'}
            </p>
          </div>
          <Button
            disabled={
              device.mode === newMode || isLoading || device.status !== 'online'
            }
            onClick={handleModeSubmit}
          >
            Switch to <span className="capitalize">{newMode}</span> Mode
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModeChange;
