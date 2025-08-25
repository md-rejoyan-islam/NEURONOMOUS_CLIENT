import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { IDevice } from '@/lib/types';
import { useChangeDeviceModeMutation } from '@/queries/devices';
import clsx from 'clsx';
import { Check, Cog } from 'lucide-react';
import { toast } from 'sonner';

const ModeChange = ({ device, id }: { device: IDevice; id: string }) => {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cog className="text-primary h-5 w-5" />
          Device Mode Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between gap-8">
          <p
            className={clsx(
              `rounded-md border px-2 py-1`,
              device.mode === 'clock'
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'border-transparent'
            )}
          >
            Clock
            {device.mode === 'clock' && (
              <Check className="ml-1 inline-block h-4 w-4" />
            )}
          </p>
          {/* <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              onChange={handleModeSubmit}
              disabled={isLoading}
              checked={device.mode === 'notice'}
            />
            <div className="peer-checked:bg-primary bg-input h-7 w-14 rounded-full transition-all duration-200 peer-focus:outline-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 after:absolute after:top-[2px] after:left-[2px] after:mt-[3px] after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-7 peer-checked:after:bg-white dark:peer-checked:after:bg-black" />
          </label> */}
          <div className="flex items-center">
            <Switch
              className="before:width-9 scale-150 cursor-pointer before:mt-2!"
              checked={device.mode === 'notice'}
              onClick={handleModeSubmit}
              disabled={isLoading}
            />
          </div>
          <p
            className={clsx(
              `rounded-md border px-2 py-1`,
              device.mode !== 'clock'
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'border-transparent'
            )}
          >
            Notice
            {device.mode !== 'clock' && (
              <Check className="ml-1 inline-block h-4 w-4" />
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModeChange;
