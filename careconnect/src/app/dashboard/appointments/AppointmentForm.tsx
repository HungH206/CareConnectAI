/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, FormEvent, JSX, useRef } from 'react';
// Import Firebase config (user confirmed this import is now working)
import { db as firebaseDb, auth as firebaseAuth, firebaseConfigAvailable } from '../../../lib/firebaseConfig';

// Import Firebase SDK functions
import {
    collection,
    addDoc,
    doc,
    deleteDoc,
    onSnapshot,
    query,
    serverTimestamp // For writing server-side timestamps
} from 'firebase/firestore';
import {
    signInAnonymously,
    onAuthStateChanged,
    // User as FirebaseUser, // Optional: for stricter user type
    // signInWithCustomToken, // Not used in this simplified version
} from 'firebase/auth';

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
    User, // Assuming this is from lucide-react as per user's code
    Clock,
    RefreshCw // Icon for Reschedule
} from 'lucide-react';

// --- Type Definitions ---
interface Message {
    type: 'success' | 'error' | '';
    text: string;
}

// Data structure for Firestore (without client-side id)
interface AppointmentServerData {
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
    requestedAt: any; // Will be Firestore ServerTimestamp
    userId: string | null;
    appId: string;
}

// Data structure for client-side (with id and consistent requestedAt)
interface Appointment extends AppointmentServerData {
    id: string;
    requestedAt: string; // ISO string on client
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

const appId: string = process.env.NEXT_PUBLIC_APP_ID || 'careconnect-ai-app';

const mockAppointmentTypes: SelectOption[] = [
    { value: 'regular_checkup', label: 'Regular Check-up' },
    { value: 'follow_up', label: 'Follow-up' },
    { value: 'specialist_consultation', label: 'Specialist Consultation' },
];

// More doctor options
const mockDoctors: MockDoctor[] = [
    { id: 'doc_smith_primary', name: 'Dr. John Smith (Primary Care)', specialty: 'Primary Care', availableSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '02:00 PM', '02:30 PM'] },
    { id: 'doc_reed_cardio', name: 'Dr. Evelyn Reed (Cardiology)', specialty: 'Cardiology', availableSlots: ['09:00 AM', '10:00 AM', '02:00 PM', '04:00 PM'] },
    { id: 'doc_chen_nutrition', name: 'Dr. Marcus Chen (Nutrition)', specialty: 'Nutrition', availableSlots: ['08:30 AM', '09:30 AM', '03:00 PM'] },
    { id: 'doc_patel_derma', name: 'Dr. Priya Patel (Dermatology)', specialty: 'Dermatology', availableSlots: ['10:00 AM', '11:30 AM', '01:30 PM'] },
];

const priorityLevels: SelectOption[] = [
    { value: 1, label: 'Urgent' },
    { value: 2, label: 'High' },
    { value: 3, label: 'Medium' },
    { value: 4, label: 'Low (Routine)' },
];

const sidebarItems = [
    { icon: BarChart3, label: 'Dashboard', active: false, href: "/dashboard"},
    { icon: Activity, label: 'Health Metrics' },
    { icon: Calendar, label: 'Appointments', active: true},
    { icon: FileText, label: 'Reports' },
    { icon: MessageSquare, label: 'Messages', active: true, href: "/dashboard/messages" },
    { icon: Users, label: 'Care Team' },
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Help & Support' },
];

// Helper function to parse date and time string into a Date object for reliable sorting
const parseAppointmentDateTime = (dateStr: string, timeStr: string): Date => {
    if (!dateStr || !timeStr) return new Date(0); // Return a very old date if info is missing
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier.toUpperCase() === 'PM' && hours < 12) {
        hours += 12;
    }
    if (modifier.toUpperCase() === 'AM' && hours === 12) { // Handle midnight case
        hours = 0;
    }

    const date = new Date(dateStr);
    date.setHours(hours, minutes, 0, 0);
    return date;
};


function CareConnectDashboard(): JSX.Element {
    // --- State Management ---
    const [patientName, setPatientName] = useState<string>('Test Patient');
    const [patientAge, setPatientAge] = useState<string>('35');
    const [symptoms, setSymptoms] = useState<string>('Annual health screening');
    const [priority, setPriority] = useState<number>(4); // Default to low, will be auto-calculated

    const [appointmentType, setAppointmentType] = useState<string>('regular_checkup');
    const [healthcareProvider, setHealthcareProvider] = useState<string>(mockDoctors[0].id);
    const [preferredDate, setPreferredDate] = useState<string>('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
    const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>(mockDoctors[0].availableSlots);
    
    // NEW: State for rescheduling
    const [rescheduleTargetId, setRescheduleTargetId] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<Message>({ type: '', text: '' });
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);

    const formRef = useRef<HTMLFormElement>(null);

    const dbInstance = firebaseConfigAvailable ? firebaseDb : null;
    const authInstance = firebaseConfigAvailable ? firebaseAuth : null;

    // --- Effects ---

    // Firebase Authentication Effect
    useEffect(() => {
        if (!authInstance) {
            console.warn("Firebase Auth not available. Mocking auth state.");
            setTimeout(() => { setUserId('mock_user_123_no_firebase'); setIsAuthReady(true); }, 100);
            return;
        }

        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
                signInAnonymously(authInstance).catch((error) => console.error("Firebase: Error during anonymous sign-in:", error));
            }
            setIsAuthReady(true);
        });
        return () => unsubscribe();
    }, [authInstance]);

    // Firestore onSnapshot Effect for Appointments
    useEffect(() => {
        if (!isAuthReady || !userId || !dbInstance) {
            setPendingAppointments([]);
            return;
        }

        setIsLoading(true);
        const appointmentsCollectionPath = `artifacts/${appId}/public/data/pendingAppointmentsGlobal`;
        const q = query(collection(dbInstance, appointmentsCollectionPath));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedAppointments: Appointment[] = [];
            querySnapshot.forEach((docSnapshot) => {
                const data = docSnapshot.data() as AppointmentServerData;
                const requestedAtTimestamp = data.requestedAt;
                let requestedAtString = new Date().toISOString();
                if (requestedAtTimestamp && typeof requestedAtTimestamp.toDate === 'function') {
                    requestedAtString = requestedAtTimestamp.toDate().toISOString();
                } else if (typeof requestedAtTimestamp === 'string') {
                    requestedAtString = requestedAtTimestamp;
                }

                fetchedAppointments.push({ id: docSnapshot.id, ...data, requestedAt: requestedAtString });
            });
            
            // IMPROVED: Sorting using the new helper function
            fetchedAppointments.sort((a, b) => 
                parseAppointmentDateTime(a.preferredDate, a.timeSlot).getTime() - 
                parseAppointmentDateTime(b.preferredDate, b.timeSlot).getTime()
            );

            setPendingAppointments(fetchedAppointments);
            setIsLoading(false);
        }, (error: Error) => {
            console.error("Firebase: Error fetching appointments:", error);
            setMessage({ type: 'error', text: 'Could not load appointments.' });
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [dbInstance, isAuthReady, userId]);

    // Effect to update available time slots when doctor changes
    useEffect(() => {
        const doctor = mockDoctors.find(doc => doc.id === healthcareProvider);
        setAvailableTimeSlots(doctor ? doctor.availableSlots : []);
        setSelectedTimeSlot('');
    }, [healthcareProvider]);

    // NEW: Algorithm to calculate priority based on symptoms
    const calculatePriority = (symptomsText: string): number => {
        const text = symptomsText.toLowerCase();
        // Urgent Keywords
        if (['chest pain', 'breathing difficulty', 'severe bleeding', 'unconscious', 'stroke symptoms', 'cannot breathe'].some(kw => text.includes(kw))) {
            return 1; // Urgent
        }
        // High Priority Keywords
        if (['high fever', 'severe migraine', 'intense pain', 'allergic reaction', 'vomiting blood', 'dizziness'].some(kw => text.includes(kw))) {
            return 2; // High
        }
        // Medium Priority Keywords
        if (['sore throat', 'cough', 'cold', 'flu', 'stomach ache', 'headache'].some(kw => text.includes(kw))) {
            return 3; // Medium
        }
        // Low Priority (Default)
        return 4; // Low (Routine)
    };

    // NEW: Effect to auto-update priority when symptoms change
    useEffect(() => {
        const calculatedPriority = calculatePriority(symptoms);
        setPriority(calculatedPriority);
    }, [symptoms]);

    // --- Action Handlers ---
    
    const resetForm = () => {
        setPatientName('Test Patient');
        setPatientAge('35');
        setSymptoms('Annual health screening');
        setAppointmentType(mockAppointmentTypes[0].value as string);
        setHealthcareProvider(mockDoctors[0].id);
        setPreferredDate('');
        setSelectedTimeSlot('');
        setRescheduleTargetId(null); // Clear reschedule state
    };

    const handleCancelAppointment = async (idToCancel: string | undefined): Promise<void> => {
        if (!idToCancel) return;
        if (!dbInstance || !userId) {
            console.log(`Mock cancel appointment: ${idToCancel}`);
            setPendingAppointments(prev => prev.filter(appt => appt.id !== idToCancel));
            setMessage({ type: 'success', text: `Appointment cancelled (mock).` });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            return;
        }

        setIsLoading(true);
        try {
            const appointmentRef = doc(dbInstance, `artifacts/${appId}/public/data/pendingAppointmentsGlobal`, idToCancel);
            await deleteDoc(appointmentRef);
            setMessage({ type: 'success', text: `Appointment cancelled.` });
        } catch (error) {
            console.error("Firebase: Error cancelling appointment:", error);
            setMessage({ type: 'error', text: 'Failed to cancel appointment.' });
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    // NEW: Handler for the reschedule button
    const handleReschedule = (appt: Appointment) => {
        setPatientName(appt.patientName);
        setPatientAge(String(appt.patientAge));
        setSymptoms(appt.symptoms);
        setPriority(appt.priority);
        setAppointmentType(appt.appointmentType);
        setHealthcareProvider(appt.doctorId);
        setPreferredDate(appt.preferredDate);
        setSelectedTimeSlot(''); // Clear time slot so user must re-select
        setRescheduleTargetId(appt.id); // Set the ID of the appointment being rescheduled

        // Scroll to form for better UX
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
        setMessage({ type: 'success', text: `Rescheduling appointment for ${appt.patientName}. Please select a new date/time and submit.` });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault(); 
        if (!isAuthReady || !userId) { 
            setMessage({ type: 'error', text: 'User not authenticated.' }); 
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            return; 
        }
        if (!healthcareProvider || !selectedTimeSlot || !preferredDate || !appointmentType) {
            setMessage({ type: 'error', text: 'Please complete all required fields.' }); 
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            return;
        }
        
        setIsLoading(true);
        setMessage({ type: '', text: '' });
        
        const selectedDoc = mockDoctors.find(d => d.id === healthcareProvider);
        
        const appointmentPayload: AppointmentServerData = {
            patientName, 
            patientAge: parseInt(patientAge, 10) || 0, 
            symptoms, 
            priority, // Uses the auto-calculated priority
            appointmentType, 
            appointmentTypeName: mockAppointmentTypes.find(t => t.value === appointmentType)?.label || 'N/A',
            doctorId: healthcareProvider, 
            doctorName: selectedDoc?.name || 'Unknown Doctor',
            preferredDate, 
            timeSlot: selectedTimeSlot, 
            status: 'pending_confirmation',
            requestedAt: serverTimestamp(),
            userId, 
            appId,
        };

        if (!dbInstance) { // Fallback to mock if Firebase not available
            console.log("Mock submitting appointment:", appointmentPayload);
            const mockId = `mock_id_${Date.now()}`;
            const newMockAppointment: Appointment = {
                ...appointmentPayload,
                id: mockId,
                requestedAt: new Date().toISOString()
            };
            // If rescheduling, remove old one
            const updatedAppointments = rescheduleTargetId
                ? pendingAppointments.filter(a => a.id !== rescheduleTargetId)
                : pendingAppointments;

            setPendingAppointments([...updatedAppointments, newMockAppointment].sort((a,b) => 
                 parseAppointmentDateTime(a.preferredDate, a.timeSlot).getTime() - 
                 parseAppointmentDateTime(b.preferredDate, b.timeSlot).getTime()
            ));
            const successText = rescheduleTargetId ? 'Appointment rescheduled (mock)!' : 'Appointment scheduled (mock)!';
            setMessage({ type: 'success', text: successText });
            setIsLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            resetForm();
            return;
        }

        try {
            const appointmentsCollectionRef = collection(dbInstance, `artifacts/${appId}/public/data/pendingAppointmentsGlobal`);
            const docRef = await addDoc(appointmentsCollectionRef, appointmentPayload);
            
            // If this was a reschedule, delete the old appointment
            if (rescheduleTargetId) {
                await handleCancelAppointment(rescheduleTargetId);
            }
            
            const successText = rescheduleTargetId 
                ? 'Appointment has been successfully rescheduled.' 
                : `Appointment request sent (ID: ${docRef.id}).`;

            setMessage({ type: 'success', text: successText });
            resetForm(); // Reset form fields and reschedule state
            
        } catch (error: any) {
            console.error("Firebase: Error handling appointment:", error);
            setMessage({ type: 'error', text: error.message || 'Failed to process appointment.' });
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 5000); // Longer timeout for reschedule message
        }
    };
    
    // --- Render Logic ---

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
        <div className="fixed inset-0 flex bg-gray-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col flex-shrink-0`}>
                <div className="flex items-center justify-center h-20 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <Heart className="h-8 w-8 text-teal-600" />
                        <span className="text-2xl font-semibold text-gray-800">CareConnect</span>
                    </div>
                </div>
                <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto">
                    {sidebarItems.map((item) => (
                        <a 
                            key={item.label} 
                            href={item.href || "#"}
                            className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                                item.active 
                                    ? 'bg-teal-50 text-teal-700' 
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            <item.icon className={`mr-3 h-5 w-5 ${item.active ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                            {item.label}
                        </a>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-200 mt-auto">
                    <a href="#" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors group">
                        <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                        Sign Out
                    </a>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Header */}
                <header className="bg-white shadow-sm flex-shrink-0">
                    <div className="flex items-center justify-between px-6 h-20">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                aria-label="Open sidebar"
                                className="lg:hidden p-2 -ml-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="flex items-center space-x-5">
                            <button aria-label="Notifications" className="relative p-1 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                                <Bell className="h-6 w-6" />
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                            </button>
                            <button aria-label="Settings" className="p-1 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                                <Settings className="h-6 w-6" />
                            </button>
                            <div className="relative">
                                <button aria-label="User menu" className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                                    <div className="w-9 h-9 bg-teal-500 rounded-full flex items-center justify-center">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-gray-700">User</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-md shadow ${ message.type === 'success' ? 'bg-green-50 border border-green-300 text-green-700' : 'bg-red-50 border border-red-300 text-red-700' }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="max-w-7xl mx-auto">
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold text-gray-900">Appointment Management</h1>
                            <p className="mt-1 text-sm text-gray-600">Schedule, reschedule, and manage your healthcare appointments</p>
                        </div>

                        <div className="mb-8 bg-white rounded-lg shadow-md border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Upcoming Appointments</h3>
                            </div>
                            <div className="p-6">
                                {isLoading && pendingAppointments.length === 0 && <p className="text-gray-500 text-center py-6">Loading appointments...</p>}
                                {!isLoading && pendingAppointments.length === 0 && <p className="text-gray-500 text-center py-6">No upcoming appointments.</p>}
                                {pendingAppointments.length > 0 && (
                                    <ul className="divide-y divide-gray-200">
                                        {pendingAppointments.map((appt) => (
                                            <li key={appt.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-teal-600 truncate">{appt.appointmentTypeName} with {appt.doctorName}</p>
                                                    <p className="mt-1 text-sm font-medium text-gray-800 truncate">
                                                        <span className="flex items-center">
                                                            <Calendar className="h-4 w-4 mr-2 text-gray-500"/>
                                                            {/* IMPROVED: Consistent date/time display */}
                                                            {new Date(appt.preferredDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {appt.timeSlot.toUpperCase()}
                                                        </span>
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500">Patient: {appt.patientName} | Priority: <span className="font-medium">{priorityLevels.find(p => p.value === appt.priority)?.label || 'N/A'}</span></p>
                                                </div>
                                                <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 flex items-center space-x-3">
                                                    {/* NEW: Reschedule Button */}
                                                    <button
                                                        onClick={() => handleReschedule(appt)}
                                                        disabled={isLoading}
                                                        className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                                                    >
                                                        <RefreshCw className="h-3 w-3 mr-1.5"/>
                                                        Reschedule
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancelAppointment(appt.id)}
                                                        disabled={isLoading}
                                                        className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 disabled:opacity-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        
                        {/* The ref is attached here */}
                        <form ref={formRef} className="space-y-6 bg-white rounded-lg shadow-md border border-gray-200" onSubmit={handleSubmit}>
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">{rescheduleTargetId ? 'Reschedule Appointment' : 'Schedule New Appointment'}</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="appointmentType" className="block text-sm font-medium text-gray-700">Appointment Type</label>
                                        <select id="appointmentType" name="appointmentType" value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                            {mockAppointmentTypes.map(type => (<option key={type.value} value={type.value}>{type.label}</option>))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="healthcareProvider" className="block text-sm font-medium text-gray-700">Healthcare Provider</label>
                                        <select id="healthcareProvider" name="healthcareProvider" value={healthcareProvider} onChange={(e) => setHealthcareProvider(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                            <option value="" disabled>Select provider</option>
                                            {mockDoctors.map(doc => (<option key={doc.id} value={doc.id}>{doc.name}</option>))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">Date</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <input type="date" id="preferredDate" name="preferredDate" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required className="form-input block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"/>
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><Calendar className="h-5 w-5 text-gray-400" /></div>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="selectedTimeSlot" className="block text-sm font-medium text-gray-700">Time</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <select id="selectedTimeSlot" name="selectedTimeSlot" value={selectedTimeSlot} onChange={(e) => setSelectedTimeSlot(e.target.value)} required disabled={!healthcareProvider || availableTimeSlots.length === 0} className="form-select block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed">
                                                <option value="" disabled>Select a time</option>
                                                {availableTimeSlots.map(slot => (<option key={slot} value={slot}>{slot}</option>))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><Clock className="h-5 w-5 text-gray-400" /></div>
                                        </div>
                                        {healthcareProvider && availableTimeSlots.length === 0 && (<p className="mt-1 text-xs text-red-500">No time slots available for this provider.</p>)}
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-gray-200">
                                    <h3 className="text-base font-medium text-gray-900 mb-4">Patient Details (for Priority Assessment)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Full Name</label>
                                            <input type="text" id="patientName" name="patientName" value={patientName} onChange={(e) => setPatientName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"/>
                                        </div>
                                        <div>
                                            <label htmlFor="patientAge" className="block text-sm font-medium text-gray-700">Age</label>
                                            <input type="number" id="patientAge" name="patientAge" value={patientAge} onChange={(e) => setPatientAge(e.target.value)} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"/>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">Symptoms/Reason for Visit</label>
                                        <textarea id="symptoms" name="symptoms" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={3} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"></textarea>
                                    </div>
                                    <div className="mt-4">
                                        {/* CHANGED: Priority is now a read-only display based on algorithm */}
                                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Calculated Priority</label>
                                        <div className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-600 sm:text-sm">
                                            {priorityLevels.find(level => level.value === priority)?.label || 'Calculating...'}
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-5 flex items-center justify-end space-x-3">
                                    {/* NEW: Cancel Reschedule Button */}
                                    {rescheduleTargetId && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                        >
                                            Cancel Reschedule
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                                                {rescheduleTargetId ? 'Rescheduling...' : 'Scheduling...'}
                                            </>
                                        ) : (
                                            rescheduleTargetId ? 'Confirm Reschedule' : 'Schedule Appointment'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
            {sidebarOpen && (<div className="fixed inset-0 z-20 bg-black bg-opacity-25 lg:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true"/>)}
        </div>
    );
}

export default CareConnectDashboard;