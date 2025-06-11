import React, { createContext, useContext, useState } from "react";
import { cn } from "../../lib/utils";

// Interface definitions
interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

// Create context
const TabsContext = createContext<TabsContextType | undefined>(undefined);

// Consolidated Tabs component that supports both controlled and uncontrolled modes
export const Tabs = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: TabsProps) => {
  // Local state for uncontrolled mode
  const [activeTab, setActiveTab] = useState(defaultValue || "");

  // Determine which value to use (controlled or uncontrolled)
  const currentValue = value !== undefined ? value : activeTab;

  // Handler function that works in both modes
  const handleTabChange = (tabValue: string) => {
    if (onValueChange) {
      // Controlled mode
      onValueChange(tabValue);
    } else {
      // Uncontrolled mode
      setActiveTab(tabValue);
    }
  };

  return (
    <TabsContext.Provider
      value={{
        activeTab: currentValue,
        setActiveTab: handleTabChange,
        value,
        onValueChange,
      }}
    >
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

// Helper hook to use the context
const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs component");
  }
  return context;
};

// TabsList component
export const TabsList = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex space-x-2 rounded-lg", className)}>{children}</div>
  );
};

// TabsTrigger component
export const TabsTrigger = ({
  value,
  children,
  className,
}: TabsTriggerProps) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        "px-3 py-2 text-sm font-medium rounded-md transition-colors",
        isActive ? "bg-white shadow-sm" : "hover:bg-gray-100 text-gray-600",
        className
      )}
      data-state={isActive ? "active" : "inactive"}
    >
      {children}
    </button>
  );
};

// TabsContent component
export const TabsContent = ({
  value,
  children,
  className,
}: TabsContentProps) => {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) {
    return null;
  }

  return <div className={cn("mt-2", className)}>{children}</div>;
};
