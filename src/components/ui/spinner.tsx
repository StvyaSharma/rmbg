// components/ui/spinner.tsx
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'sm' | 'lg'
}

export function Spinner({ className, size = 'default', ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      className={cn("animate-spin", className)}
      {...props}
    >
      <Loader2 
        className={cn(
          "text-primary",
          size === 'sm' && 'h-4 w-4',
          size === 'default' && 'h-6 w-6',
          size === 'lg' && 'h-8 w-8'
        )}
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}