import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "outline"
}

export const Badge: React.FC<BadgeProps> = ({
    variant = "default",
    className,
    children,
    ...props
}) => {
    const baseClasses =
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
    const variantClasses =
        variant === "outline"
            ? "border border-gray-300 text-gray-700"
            : "bg-gray-100 text-gray-800"

    return (
        <span className={`${baseClasses} ${variantClasses} ${className || ""}`} {...props}>
            {children}
        </span>
    )
}