"use client"
import React, { createContext, useContext } from "react"
import { cn } from "../../lib/utils"

const DialogContext = createContext()

export function Dialog({ open, onOpenChange, children }) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({ asChild, children }) {
  const { onOpenChange } = useContext(DialogContext)
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        children.props.onClick?.(e)
        onOpenChange(true)
      },
    })
  }
  return (
    <button onClick={() => onOpenChange(true)}>{children}</button>
  )
}

export function DialogContent({ className, children }) {
  const { open, onOpenChange } = useContext(DialogContext)
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className={cn("w-full max-w-md rounded-md bg-white p-6", className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ className, children }) {
  return <div className={cn("mb-4", className)}>{children}</div>
}

export function DialogTitle({ className, children }) {
  return (
    <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>
  )
}

export { DialogContext }