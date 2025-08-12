"use client"
import { cn } from "../../lib/utils"

export function Progress({ value = 0, className, ...props }) {
  return (
    <div className={cn("h-4 w-full rounded-full bg-gray-200", className)} {...props}>
      <div className="h-full rounded-full bg-blue-600" style={{ width: `${value}%` }} />
    </div>
  )
}
