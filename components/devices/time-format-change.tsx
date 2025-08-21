import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { IDevice } from '@/lib/types';
import { Bell, RefreshCw, TimerReset } from 'lucide-react';
import { useState } from 'react';

const TimeFormatChange = ({ device }: { device: IDevice }) => {
  const [isChangeFontTime, setIsChangeFontTime] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TimerReset className="text-primary h-5 w-5" />
          Time Format Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Duration Settings */}
        <div className="space-y-4">
          <Label>Select Time Format</Label>
          <RadioGroup value={device.time_format} onValueChange={() => {}}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="12h" id="12h" />
              <Label htmlFor="12h">12-Hour Format</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="24h" id="24h" />
              <Label htmlFor="24h">24-Hour Format</Label>
            </div>
          </RadioGroup>
        </div>

        <Button
          onClick={() => {}}
          // disabled={}
          className="w-full"
        >
          {isChangeFontTime ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Updating Time Format...
            </>
          ) : (
            <>
              <Bell className="mr-2 h-4 w-4" />
              Update Time Format
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TimeFormatChange;
