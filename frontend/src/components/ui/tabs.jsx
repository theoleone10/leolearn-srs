"use client"
import { createContext, useContext, useState } from "react"
import { cn } from "../../lib/utils"

const TabsContext = createContext()

function Tabs({ defaultValue, className, children }) {
  const [value, setValue] = useState(defaultValue)
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div data-slot="tabs" className={cn("flex flex-col gap-2", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({ className, children }) {
  return (
    <div
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className,
      )}
      >
      {children}
    </div>
  )
}

function TabsTrigger({ value, className, children }) {
    const { value: current, setValue } = useContext(TabsContext)
    const active = current === value
  return (
    <button
      type="button"
      data-slot="tabs-trigger"
      onClick={() => setValue(value)}
      className={cn(
        "text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        active && "bg-background dark:text-foreground shadow-sm",
        className,
      )}
      >
      {children}
    </button>
  )
}

function TabsContent({ value, className, children }) {
    const { value: current } = useContext(TabsContext)
    if (current !== value) return null
    return (
      <div data-slot="tabs-content" className={cn("flex-1 outline-none", className)}>
        {children}
      </div>
    )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
