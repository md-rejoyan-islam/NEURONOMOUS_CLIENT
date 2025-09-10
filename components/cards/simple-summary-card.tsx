import { Card, CardContent } from '@/components/ui/card';

const SimpleSummaryCard = ({
  label,
  value,
  icon,
  valueColor,
}: {
  readonly label: string;
  readonly value: string | number;
  readonly icon: React.ReactNode;
  readonly valueColor: string;
}) => {
  return (
    <Card className="py-2 transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">{label}</p>
            <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
          </div>
          <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/20">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleSummaryCard;
