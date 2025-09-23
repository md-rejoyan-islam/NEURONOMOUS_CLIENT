import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IDevice } from '@/lib/types';
import { useChangeDeviceSceneMutation } from '@/queries/devices';
import { Bell, RefreshCw, TypeOutline } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const SceneChange = ({ device, id }: { device: IDevice; id: string }) => {
  // Form states
  const [changeScene, { isLoading }] = useChangeDeviceSceneMutation();
  const [currentScene, setCurrentScene] = useState<
    'scene0' | 'scene1' | 'scene2'
  >(device.scene || 'scene1');

  const handleModeSubmit = async () => {
    try {
      await changeScene({ id, scene: currentScene }).unwrap();

      toast.success('Device Scene Updated', {
        description: `Device scene changed to ${currentScene}.`,
      });
      // refetch();
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Update Failed', {
        description: error?.data?.message || 'Failed to update device scene.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TypeOutline className="text-primary h-5 w-5" />
          Scene Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="notice">Select Scene</Label>
          <Select
            value={currentScene}
            onValueChange={(value: 'scene1' | 'scene2') => {
              setCurrentScene(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Scene" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="scene0">Scene-0</SelectItem>s */}
              <SelectItem value="scene0">HH:MM-DD:MM</SelectItem>
              <SelectItem value="scene1">HH:MM:SS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleModeSubmit}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Changing Scene...
            </>
          ) : (
            <>
              <Bell className="mr-2 h-4 w-4" />
              Change Scene
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SceneChange;
