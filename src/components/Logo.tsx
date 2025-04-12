import { cn } from "@/lib/utils";
import { FishIcon } from "lucide-react";

type Props = {
  className?: string;
  onlyIcon?: boolean;
};

export default function Logo({ className, onlyIcon }: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span><FishIcon/></span>
      {!!onlyIcon && (<>
      <span
        className={cn(
          "text-2xl font-medium font-stretch-125% tracking-widest",
          className
        )}
      >
        FISH
      </span>
      <span className={cn("text-2xl font-thin tracking-widest", className)}>
        CULTURE
      </span>
      </>)}
    </div>
  );
}
