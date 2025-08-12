import { Card, CardContent } from "@/components/ui/card";

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
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
          </div>
          <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleSummaryCard;
