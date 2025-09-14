import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IDevice } from '@/lib/types';
import { Bell, RefreshCw, TypeOutline } from 'lucide-react';
import { useState } from 'react';

const FontChange = ({ device }: { device: IDevice }) => {
  const [isChangeFontTime] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TypeOutline className="text-primary h-5 w-5" />
          Font Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="notice">Select Font</Label>
          <Select value={device.font} onValueChange={() => {}}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Courier New">Courier New</SelectItem>
              <SelectItem value="Verdana">Verdana</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => {}}
          // disabled={isChangeFontTime}
          className="w-full"
        >
          {isChangeFontTime ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Changing Font...
            </>
          ) : (
            <>
              <Bell className="mr-2 h-4 w-4" />
              Change Font
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FontChange;
