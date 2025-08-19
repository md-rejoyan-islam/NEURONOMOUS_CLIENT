import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
const DurationMinutes = ({
  durationMinutes,
  setDurationMinutes,
}: {
  durationMinutes: string;
  setDurationMinutes: (minutes: string) => void;
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="duration">Duration (minutes)</Label>
      <Input
        id="duration"
        type="number"
        placeholder="Enter duration in minutes"
        value={durationMinutes}
        onChange={(e) => setDurationMinutes(e.target.value)}
        min={1}
        step={1}
      />
    </div>
  );
};

export default DurationMinutes;
