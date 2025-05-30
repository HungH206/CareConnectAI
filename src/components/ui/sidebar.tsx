/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex flex-col h-full bg-white ${className}`}
      {...props}
    />
  )
);
Sidebar.displayName = "Sidebar";

export const SidebarHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div className={`p-4 border-b ${className}`} {...props} />
  );
};

export const SidebarContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div className={`flex-1 p-4 ${className}`} {...props} />
  );
};

export const SidebarFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div className={`p-4 border-t ${className}`} {...props} />
  );
};

export const SidebarMenu: React.FC<React.HTMLAttributes<HTMLUListElement>> = ({ className, ...props }) => {
  return (
    <ul className={`space-y-1 ${className}`} {...props} />
  );
};

export const SidebarMenuItem: React.FC<React.HTMLAttributes<HTMLLIElement>> = ({ className, ...props }) => {
  return (
    <li className={className} {...props} />
  );
};

export interface SidebarMenuButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
  tooltip?: string;
}
export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ children, asChild, tooltip, className, ...props }, ref) => {
    // In this example, tooltip prop is preserved for future use (e.g., to add a title attribute)
    if (asChild) {
      return (
        <button ref={ref} className={className} {...props}>
          {children}
        </button>
      );
    }
    return (
      <button ref={ref} className={`w-full text-left ${className}`} {...props}>
        {children}
      </button>
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>(
  ({ className, ...props }, ref) => {
    return (
      <button ref={ref} className={`p-2 focus:outline-none ${className}`} {...props} />
    );
  }
);
SidebarTrigger.displayName = "SidebarTrigger";