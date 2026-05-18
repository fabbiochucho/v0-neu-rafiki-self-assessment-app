import { AlertCircle, Zap } from "lucide-react"

interface DemoBadgeProps {
  variant?: "banner" | "badge" | "inline"
  className?: string
}

export function DemoBadge({ variant = "badge", className = "" }: DemoBadgeProps) {
  if (variant === "banner") {
    return (
      <div className="bg-accent/20 border border-accent text-accent-foreground px-4 py-3 rounded-lg flex items-center gap-2">
        <Zap className="h-4 w-4" />
        <div>
          <p className="font-semibold text-sm">Demo Mode</p>
          <p className="text-xs opacity-75">Using test data for evaluation purposes</p>
        </div>
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent/20 text-accent-foreground text-xs font-medium ${className}`}>
        <Zap className="h-3 w-3" />
        Demo
      </span>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 text-accent-foreground text-sm border border-accent/30 ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <span>Demo Account</span>
    </div>
  )
}
