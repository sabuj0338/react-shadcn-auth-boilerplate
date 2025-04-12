import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

type Props = {
  className?: string;
}

export default function Loader({ className }: Props) {
  return (
    <div className={cn("w-full h-full flex items-center justify-center", className)}>
      <Loader2Icon className="animate-spin h-6 w-6"/>
    </div>
  );
}
