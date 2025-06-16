"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3, // For Dashboard
    Activity,  // For Health Metrics
    CalendarDays,
    FileText,
    MessageSquare,
    Users,     // For Care Team
    Settings,
    HelpCircle,
    LogOut,
    Bell,
    Menu,
    User,
    Heart,     // For the logo
} from 'lucide-react';

// Sidebar items from your new screenshot
const sidebarItems = [
    { icon: BarChart3, label: 'Dashboard', href: "/dashboard" },
    { icon: Activity, label: 'Health Metrics', href: "/dashboard/vitals" },
    { icon: CalendarDays, label: 'Appointments', href: "/dashboard/appointments" },
    { icon: FileText, label: 'Reports', href: "/dashboard/reports" },
    { icon: MessageSquare, label: 'Messages', href: "/dashboard/messages" },
    { icon: Users, label: 'Care Team', href: "/dashboard/team" },
    { icon: Settings, label: 'Settings', href: "/dashboard/settings" },
    { icon: HelpCircle, label: 'Help & Support', href: "/dashboard/help" },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 md:flex md:flex-col flex-shrink-0`}>
                <div className="flex items-center justify-start px-6 h-20 border-b border-gray-200">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <Heart className="h-8 w-8 text-teal-500" fill="#14b8a6" />
                        <span className="text-2xl font-bold text-gray-800">CareConnect</span>
                    </Link>
                </div>
                <nav className="flex-1 mt-4 px-4 space-y-2">
                    {sidebarItems.map((item) => {
                        // Check if the current path is the item's href
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href || "#"}
                                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                                    isActive
                                        ? 'bg-teal-50 text-gray-900'
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-teal-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-red-500 transition-colors hover:bg-red-50">
                        <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-white font-semibold text-sm">N</div>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

             {/* Backdrop for mobile */}
            {sidebarOpen && (<div className="fixed inset-0 z-20 bg-black bg-opacity-25 md:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true"/>)}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Header */}
                <header className="bg-white flex-shrink-0">
                    <div className="flex items-center justify-between px-6 h-20 border-b border-gray-200">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                aria-label="Open sidebar"
                                className="md:hidden p-2 -ml-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="relative p-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600">
                                <Bell className="h-6 w-6" />
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-xs text-white ring-2 ring-white">3</span>
                            </button>
                            <button className="p-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600">
                                <Settings className="h-6 w-6" />
                            </button>
                            <button className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-teal-600" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}