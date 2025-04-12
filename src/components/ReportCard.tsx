import { cn } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";

type Props = {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  value: string;
};

export default function ReportCard({ icon, iconColor, title, value }: Props) {
  return (
    <Card className="border-0 rounded p-3">
      <CardContent className="flex items-center space-x-4 px-0">
        <div
          className={cn(
            "p-5 bg-amber-200/25 text-amber-500 bg-opacity-30 rounded-md",
            iconColor
          )}
        >
          {icon}
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
