import * as React from "react";

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; onValueChange: (value: string) => void }
>(({ className, value, onValueChange, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`inline-flex items-center border-b border-zinc-800 ${className}`}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string; isActive?: boolean }
>(({ className, value, isActive, ...props }, ref) => (
  <button
    ref={ref}
    className={`px-4 py-3 text-sm transition-colors relative ${
      isActive
        ? "text-white"
        : "text-zinc-400 hover:text-white"
    } ${className}`}
    {...props}
  >
    {props.children}
    {isActive && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F8CFF]" />
    )}
  </button>
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`mt-6 ${className}`}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
