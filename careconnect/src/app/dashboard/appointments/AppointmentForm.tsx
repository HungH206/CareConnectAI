/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, FormEvent, JSX } from 'react';
import { 
  Heart, 
  BarChart3, 
  Activity, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut,
  Bell,
  Menu,
  User,
  Clock
} from 'lucide-react';

// Type Definitions
interface Message {
  type: 'success' | 'error' | '';
  text: string;
}

interface Appointment {
  id?: string;
  patientName: string;
  patientAge: number;
  symptoms: string;
  priority: number;
  appointmentType: string;
  appointmentTypeName?: string;
  doctorId: string;
  doctorName: string;
  preferredDate: string;
  timeSlot: string;
  status: string;
  requestedAt: string;
  userId: string | null;
  appId: string;
}

interface MockDoctor {
  id: string;
  name: string;
  specialty: string;
  availableSlots: string[];
}

interface SelectOption {
  value: string | number;
  label: string;
}

const appId: string = 'careconnect-ai-app';

const mockAppointmentTypes: SelectOption[] = [
    { value: 'regular_checkup', label: 'Regular Check-up' },
    { value: 'follow_up', label: 'Follow-up' },
    { value: 'specialist_consultation', label: 'Specialist Consultation' },
];

const mockDoctors: MockDoctor[] = [
    { id: 'doc_smith_figma', name: 'Dr. Smith (Primary Care)', specialty: 'Primary Care', availableSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM'] },
    { id: 'doc1', name: 'Dr. Evelyn Reed (Cardiology)', specialty: 'Cardiology', availableSlots: ['09:00 AM', '10:00 AM', '02:00 PM'] },
    { id: 'doc2', name: 'Dr. Marcus Chen (Nutritionist)', specialty: 'Nutritionist', availableSlots: ['08:30 AM', '09:30 AM', '03:00 PM'] },
];

const priorityLevels: SelectOption[] = [
    { value: 1, label: 'Urgent' }, 
    { value: 2, label: 'High' },
    { value: 3, label: 'Medium' }, 
    { value: 4, label: 'Low (Routine)' },
];

const sidebarItems = [
  { icon: BarChart3, label: 'Dashboard', active: true },
  { icon: Activity, label: 'Health Metrics' },
  { icon: Activity, label: 'Activity' },
  { icon: Calendar, label: 'Appointments' },
  { icon: FileText, label: 'Reports' },
  { icon: MessageSquare, label: 'Messages' },
  { icon: Users, label: 'Care Team' },
  { icon: Settings, label: 'Settings' },
  { icon: HelpCircle, label: 'Help & Support' },
];

function CareConnectDashboard(): JSX.Element {
    const [patientName, setPatientName] = useState<string>('Test Patient');
    const [patientAge, setPatientAge] = useState<string>('35');
    const [symptoms, setSymptoms] = useState<string>('Annual health screening');
    const [priority, setPriority] = useState<number>(3);
    
    const [appointmentType, setAppointmentType] = useState<string>('regular_checkup');
    const [healthcareProvider, setHealthcareProvider] = useState<string>(mockDoctors[0].id);
    const [preferredDate, setPreferredDate] = useState<string>('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
    const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>(mockDoctors[0].availableSlots);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<Message>({ type: '', text: '' });
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const initialMockAppointments: Appointment[] = [
        { 
          id: 'figma_appt1', 
          doctorId: 'doc_smith_figma', 
          doctorName: 'Dr. Smith - Follow-up', 
          patientName: 'User 1', 
          patientAge: 40, 
          symptoms: 'Follow-up discussion', 
          priority: 3, 
          appointmentType: 'follow_up', 
          appointmentTypeName: 'Follow-up', 
          preferredDate: '2025-05-22', 
          timeSlot: '10:00 AM', 
          status: 'Confirmed', 
          requestedAt: new Date('2025-05-20T10:00:00Z').toISOString(), 
          userId: 'mock_user_figma1', 
          appId 
        },
        { 
          id: 'figma_appt2', 
          doctorId: 'doc2', 
          doctorName: 'Nutritionist Consultation', 
          patientName: 'User 2', 
          patientAge: 32, 
          symptoms: 'Diet plan review', 
          priority: 3, 
          appointmentType: 'specialist_consultation', 
          appointmentTypeName: 'Nutritionist Consultation', 
          preferredDate: '2025-05-25', 
          timeSlot: '2:30 PM', 
          status: 'Confirmed', 
          requestedAt: new Date('2025-05-21T14:00:00Z').toISOString(), 
          userId: 'mock_user_figma2', 
          appId 
        },
    ];
    
    const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>(initialMockAppointments);

    useEffect(() => {
        setTimeout(() => { 
          setUserId('mock_user_123'); 
          setIsAuthReady(true); 
        }, 100);
    }, []);

    useEffect(() => {
        const doctor = mockDoctors.find(doc => doc.id === healthcareProvider);
        setAvailableTimeSlots(doctor ? doctor.availableSlots : []);
        setSelectedTimeSlot('');
    }, [healthcareProvider]);

    const handleCancelAppointment = async (idToCancel: string | undefined): Promise<void> => {
        if (!idToCancel) return;
        setPendingAppointments(prev => prev.filter(appt => appt.id !== idToCancel));
        setMessage({ type: 'success', text: `Appointment cancelled successfully.` });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleSubmit = (e: FormEvent<HTMLDivElement>): void => {
        e.preventDefault();
        if (!healthcareProvider || !selectedTimeSlot || !preferredDate || !appointmentType) {
            setMessage({ type: 'error', text: 'Please complete all required fields.' }); 
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            return;
        }
        
        setIsLoading(true);
        
        const selectedDoc = mockDoctors.find(d => d.id === healthcareProvider);
        const mockId = `mock_id_${Date.now()}`;
        
        const apptData: Appointment = {
            id: mockId,
            patientName, 
            patientAge: parseInt(patientAge, 10) || 0, 
            symptoms, 
            priority,
            appointmentType, 
            appointmentTypeName: mockAppointmentTypes.find(t => t.value === appointmentType)?.label || 'N/A',
            doctorId: healthcareProvider, 
            doctorName: selectedDoc?.name || 'Unknown Doctor',
            preferredDate, 
            timeSlot: selectedTimeSlot, 
            status: 'Confirmed',
            requestedAt: new Date().toISOString(), 
            userId, 
            appId,
        };

        // Simulate API delay
        setTimeout(() => {
            setPendingAppointments(prev => [...prev, apptData].sort((a,b) => 
                new Date(`${a.preferredDate}T00:00`).getTime() - new Date(`${b.preferredDate}T00:00`).getTime()
            ));
            setMessage({ type: 'success', text: 'Appointment scheduled successfully!' });
            
            // Reset form
            setAppointmentType(mockAppointmentTypes[0].value as string);
            setHealthcareProvider(mockDoctors[0].id);
            setPreferredDate(''); 
            setSelectedTimeSlot('');
            setIsLoading(false);
            
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }, 1000);
    };

    if (!isAuthReady) {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Initializing CareConnect...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex items-center justify-center h-16 bg-white border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <Heart className="h-8 w-8 text-teal-600" />
                        <span className="text-xl font-semibold text-gray-800">CareConnect</span>
                    </div>
                </div>
                
                <nav className="mt-8 px-4">
                    <ul className="space-y-2">
                        {sidebarItems.map((item, index) => (
                            <li key={index}>
                                <a href="#" className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                    item.active 
                                        ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}>
                                    <item.icon className={`mr-3 h-5 w-5 ${item.active ? 'text-blue-700' : 'text-gray-400'}`} />
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                
                <div className="absolute bottom-4 left-4 right-4">
                    <a href="#" className="flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                    </a>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <h1 className="ml-4 lg:ml-0 text-2xl font-semibold text-gray-900">Dashboard</h1>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-gray-400 hover:text-gray-500">
                                <Bell className="h-6 w-6" />
                                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-500">
                                <Settings className="h-6 w-6" />
                            </button>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-white" />
                                </div>
                                <span className="hidden sm:block text-sm font-medium text-gray-700">User</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6 h-full">
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-lg ${
                                message.type === 'success' 
                                    ? 'bg-green-50 border border-green-200 text-green-800' 
                                    : 'bg-red-50 border border-red-200 text-red-800'
                            }`}>
                                {message.text}
                            </div>
                        )}

                        <div className="max-w-7xl mx-auto">
                            {/* Page Header */}
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900">Appointment Management</h2>
                                <p className="mt-2 text-gray-600">Schedule and manage your healthcare appointments</p>
                            </div>

                            {/* Upcoming Appointments */}
                            <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
                                </div>
                                <div className="p-6">
                                    {pendingAppointments.length > 0 ? (
                                        <div className="space-y-4">
                                            {pendingAppointments.map((appt, index) => (
                                                <div key={appt.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900">{appt.doctorName}</h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {new Date(appt.preferredDate).toLocaleDateString('en-US', { 
                                                                month: 'long', 
                                                                day: 'numeric', 
                                                                year: 'numeric', 
                                                                timeZone: 'UTC' 
                                                            })} at {appt.timeSlot}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                                            Reschedule
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancelAppointment(appt.id)}
                                                            disabled={isLoading}
                                                            className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">No upcoming appointments.</p>
                                    )}
                                </div>
                            </div>

                            {/* Schedule New Appointment */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Schedule New Appointment</h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="appointmentType" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Appointment Type
                                                </label>
                                                <select 
                                                    id="appointmentType" 
                                                    value={appointmentType} 
                                                    onChange={(e) => setAppointmentType(e.target.value)} 
                                                    required 
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                                                >
                                                    {mockAppointmentTypes.map(type => (
                                                        <option key={type.value} value={type.value}>{type.label}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="healthcareProvider" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Healthcare Provider
                                                </label>
                                                <select 
                                                    id="healthcareProvider" 
                                                    value={healthcareProvider} 
                                                    onChange={(e) => setHealthcareProvider(e.target.value)} 
                                                    required 
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                                                >
                                                    {mockDoctors.map(doc => (
                                                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Date
                                                </label>
                                                <div className="relative">
                                                    <input 
                                                        type="date" 
                                                        id="preferredDate" 
                                                        value={preferredDate} 
                                                        onChange={(e) => setPreferredDate(e.target.value)} 
                                                        min={new Date().toISOString().split('T')[0]} 
                                                        required 
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                                                        placeholder="mm/dd/yyyy"
                                                    />
                                                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="selectedTimeSlot" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Time
                                                </label>
                                                <div className="relative">
                                                    <select 
                                                        id="selectedTimeSlot" 
                                                        value={selectedTimeSlot} 
                                                        onChange={(e) => setSelectedTimeSlot(e.target.value)} 
                                                        required 
                                                        disabled={!healthcareProvider || availableTimeSlots.length === 0}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                                    >
                                                        <option value="" disabled>--:-- --</option>
                                                        {availableTimeSlots.map(slot => (
                                                            <option key={slot} value={slot}>{slot}</option>
                                                        ))}
                                                    </select>
                                                    <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                                                </div>
                                                {healthcareProvider && availableTimeSlots.length === 0 && (
                                                    <p className="mt-1 text-xs text-red-500">No time slots available for this provider.</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                onClick={(e) => handleSubmit(e as any)}
                                                disabled={isLoading}
                                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        Scheduling...
                                                    </>
                                                ) : (
                                                    'Schedule Appointment'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" 
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}

export default CareConnectDashboard;