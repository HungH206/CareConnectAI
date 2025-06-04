"use client";

import React, { useState, useEffect, FormEvent, JSX } from 'react';
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
  Clock
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
  { icon: BarChart3, label: 'Dashboard', active: false, href: "/dashboard"}, // Assuming Appointments is active
  { icon: Activity, label: 'Health Metrics' },
  { icon: Calendar, label: 'Appointments', active: true}, // Marking Appointments as active
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
    
    const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);

    // Use imported db and auth instances, checking if Firebase config was available
    const dbInstance = firebaseConfigAvailable ? firebaseDb : null;
    const authInstance = firebaseConfigAvailable ? firebaseAuth : null;

    // Firebase Authentication Effect
    useEffect(() => {
        if (!authInstance) { // If firebaseConfigAvailable was false, authInstance will be null
            console.warn("Firebase Auth not available. Mocking auth state.");
            setTimeout(() => { 
              setUserId('mock_user_123_no_firebase'); 
              setIsAuthReady(true); 
            }, 100);
            return;
        }

        console.log("Setting up Firebase Auth listener.");
        const unsubscribe = onAuthStateChanged(authInstance, (user) => { // user is type firebase.User | null
            if (user) {
                setUserId(user.uid);
                console.log("Firebase: User signed in with UID:", user.uid);
            } else {
                setUserId(null);
                console.log("Firebase: User signed out. Attempting anonymous sign-in.");
                signInAnonymously(authInstance)
                    .then(() => console.log("Firebase: Anonymous sign-in successful."))
                    .catch((error) => {
                        console.error("Firebase: Error during anonymous sign-in:", error);
                        setMessage({ type: 'error', text: 'Authentication error.' });
                    });
            }
            setIsAuthReady(true);
        });
        return () => unsubscribe();
    }, [authInstance]); // Rerun if authInstance changes (e.g., from null to actual)

    // Firestore onSnapshot Effect for Appointments
    useEffect(() => {
        if (!isAuthReady || !userId || !dbInstance) {
            if (isAuthReady && userId && !dbInstance) {
                 console.warn("Firebase DB not available. Cannot fetch appointments. Displaying local mock if any, or empty.");
            }
            setPendingAppointments([]); // Clear or use initial mock if desired for no-DB scenario
            return;
        }

        console.log("Setting up Firestore onSnapshot listener for appointments.");
        setIsLoading(true);
        const appointmentsCollectionPath = `artifacts/${appId}/public/data/pendingAppointmentsGlobal`;
        const q = query(collection(dbInstance, appointmentsCollectionPath));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => { // querySnapshot type is QuerySnapshot
            const fetchedAppointments: Appointment[] = [];
            querySnapshot.forEach((docSnapshot) => { // docSnapshot type is QueryDocumentSnapshot
                const data = docSnapshot.data() as AppointmentServerData;
                const requestedAtTimestamp = data.requestedAt;
                let requestedAtString = new Date().toISOString(); // Default if conversion fails
                if (requestedAtTimestamp && typeof requestedAtTimestamp === 'object' && 'toDate' in requestedAtTimestamp) {
                    requestedAtString = (requestedAtTimestamp as any).toDate().toISOString();
                } else if (typeof requestedAtTimestamp === 'string') {
                    requestedAtString = requestedAtTimestamp;
                }

                fetchedAppointments.push({ 
                    id: docSnapshot.id, 
                    ...data,
                    requestedAt: requestedAtString
                });
            });
            
            fetchedAppointments.sort((a, b) => 
                new Date(`${a.preferredDate}T${(a.timeSlot || '00:00 AM').replace(/( AM| PM)/, '')}:00`).getTime() - 
                new Date(`${b.preferredDate}T${(b.timeSlot || '00:00 AM').replace(/( AM| PM)/, '')}:00`).getTime()
            );
            setPendingAppointments(fetchedAppointments);
            setIsLoading(false);
            console.log("Firebase: Appointments fetched/updated:", fetchedAppointments.length);
        }, (error: Error) => {
            console.error("Firebase: Error fetching appointments:", error);
            setMessage({ type: 'error', text: 'Could not load appointments.' });
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [dbInstance, isAuthReady, userId]); // Rerun if dbInstance, auth status or user changes


    useEffect(() => {
        const doctor = mockDoctors.find(doc => doc.id === healthcareProvider);
        setAvailableTimeSlots(doctor ? doctor.availableSlots : []);
        setSelectedTimeSlot('');
    }, [healthcareProvider]);

    const handleCancelAppointment = async (idToCancel: string | undefined): Promise<void> => {
        if (!idToCancel) return;

        if (!dbInstance || !userId) { // Fallback to mock if Firebase not available
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
            setMessage({ type: 'success', text: `Appointment ${idToCancel} cancelled.` });
            // UI will update automatically via onSnapshot listener
        } catch (error) {
            console.error("Firebase: Error cancelling appointment:", error);
            setMessage({ type: 'error', text: 'Failed to cancel appointment.' });
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    // Changed parameter type to FormEvent<HTMLFormElement>
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
            priority,
            appointmentType, 
            appointmentTypeName: mockAppointmentTypes.find(t => t.value === appointmentType)?.label || 'N/A',
            doctorId: healthcareProvider, 
            doctorName: selectedDoc?.name || 'Unknown Doctor',
            preferredDate, 
            timeSlot: selectedTimeSlot, 
            status: 'pending_confirmation', // Standard status for new requests
            requestedAt: serverTimestamp(), // Use Firestore server timestamp
            userId, 
            appId,
        };

        if (!dbInstance) { // Fallback to mock if Firebase not available
            console.log("Mock submitting appointment:", appointmentPayload);
            const mockId = `mock_id_${Date.now()}`;
            const newMockAppointment: Appointment = {
                ...appointmentPayload,
                id: mockId,
                requestedAt: new Date().toISOString() // For mock, use client time
            };
            setPendingAppointments(prev => [...prev, newMockAppointment].sort((a,b) => 
                new Date(`${a.preferredDate}T00:00`).getTime() - new Date(`${b.preferredDate}T00:00`).getTime()
            ));
            setMessage({ type: 'success', text: 'Appointment scheduled (mock)!' });
            setIsLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            return;
        }

        try {
            const appointmentsCollectionRef = collection(dbInstance, `artifacts/${appId}/public/data/pendingAppointmentsGlobal`);
            const docRef = await addDoc(appointmentsCollectionRef, appointmentPayload);
            setMessage({ type: 'success', text: `Appointment request sent (ID: ${docRef.id}).` });
            
            // Reset form
            setAppointmentType(mockAppointmentTypes[0].value as string);
            setHealthcareProvider(mockDoctors[0].id);
            setPreferredDate(''); 
            setSelectedTimeSlot('');
            
        } catch (error: any) {
            console.error("Firebase: Error scheduling appointment:", error);
            setMessage({ type: 'error', text: error.message || 'Failed to schedule appointment.' });
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
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
        <div className="fixed inset-0 flex bg-gray-50 font-sans overflow-hidden"> {/* Added overflow-hidden */}
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col flex-shrink-0`}> {/* Added flex-shrink-0 */}
                <div className="flex items-center justify-center h-20 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <Heart className="h-8 w-8 text-teal-600" />
                        <span className="text-2xl font-semibold text-gray-800">CareConnect</span>
                    </div>
                </div>
                
                <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto"> {/* Added overflow-y-auto for long nav */}
                    {sidebarItems.map((item) => (
                        <a 
                            key={item.label} 
                            href={item.href || "#"} // Use href from item
                            className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                                item.active 
                                    ? 'bg-teal-50 text-teal-700' 
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            <item.icon 
                                className={`mr-3 h-5 w-5 ${
                                    item.active ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-500'
                                }`} 
                            />
                            {item.label}
                        </a>
                    ))}
                </nav>
                
                <div className="p-4 border-t border-gray-200 mt-auto"> {/* Added mt-auto to push to bottom */}
                    <a href="#" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors group">
                        <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                        Sign Out
                    </a>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0"> {/* Added min-w-0 */}
                {/* Header */}
                <header className="bg-white shadow-sm flex-shrink-0"> {/* Added flex-shrink-0 */}
                    <div className="flex items-center justify-between px-6 h-20">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                aria-label="Open sidebar"
                                className="lg:hidden p-2 -ml-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            {/* Removed Dashboard h1 from here, it's in main content's header */}
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
                        <div className={`mb-6 p-4 rounded-md shadow ${
                            message.type === 'success' 
                                ? 'bg-green-50 border border-green-300 text-green-700' 
                                : 'bg-red-50 border border-red-300 text-red-700'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="max-w-7xl mx-auto">
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold text-gray-900">Appointment Management</h1>
                            <p className="mt-1 text-sm text-gray-600">Schedule and manage your healthcare appointments</p>
                        </div>

                        <div className="mb-8 bg-white rounded-lg shadow-md border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Upcoming Appointments</h3>
                            </div>
                            <div className="p-6">
                                {isLoading && pendingAppointments.length === 0 && <p className="text-gray-500 text-center py-6">Loading appointments...</p>}
                                {!isLoading && pendingAppointments.length === 0 && (
                                    <p className="text-gray-500 text-center py-6">No upcoming appointments.</p>
                                )}
                                {pendingAppointments.length > 0 && (
                                    <ul className="divide-y divide-gray-200">
                                        {pendingAppointments.map((appt) => (
                                            <li key={appt.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-teal-600 truncate">{appt.doctorName}</p>
                                                    <p className="mt-1 text-sm text-gray-500 truncate">
                                                        {/* Display requestedAt for sorting demo or preferredDate if more relevant */}
                                                        {new Date(appt.requestedAt).toLocaleDateString('en-US', { 
                                                            month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' 
                                                        })}
                                                        {' - '} <i>Slot: {appt.preferredDate} at {appt.timeSlot}</i>
                                                    </p>
                                                     <p className="text-xs text-gray-400">Patient: {appt.patientName}, Priority: {appt.priority}</p>
                                                </div>
                                                <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 flex space-x-2">
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

                        <div className="bg-white rounded-lg shadow-md border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Schedule New Appointment</h3>
                            </div>
                            <div className="p-6">
                                <form className="space-y-6" onSubmit={handleSubmit}> {/* Use onSubmit here */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* ... form fields remain the same ... */}
                                        <div>
                                            <label htmlFor="appointmentType" className="block text-sm font-medium text-gray-700">
                                                Appointment Type
                                            </label>
                                            <select 
                                                id="appointmentType" 
                                                name="appointmentType"
                                                value={appointmentType} 
                                                onChange={(e) => setAppointmentType(e.target.value)} 
                                                required 
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                            >
                                                {mockAppointmentTypes.map(type => (
                                                    <option key={type.value} value={type.value}>{type.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="healthcareProvider" className="block text-sm font-medium text-gray-700">
                                                Healthcare Provider
                                            </label>
                                            <select 
                                                id="healthcareProvider" 
                                                name="healthcareProvider"
                                                value={healthcareProvider} 
                                                onChange={(e) => setHealthcareProvider(e.target.value)} 
                                                required 
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                            >
                                                 <option value="" disabled>Select provider</option>
                                                {mockDoctors.map(doc => (
                                                    <option key={doc.id} value={doc.id}>{doc.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">
                                                Date
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input 
                                                    type="date" 
                                                    id="preferredDate" 
                                                    name="preferredDate"
                                                    value={preferredDate} 
                                                    onChange={(e) => setPreferredDate(e.target.value)} 
                                                    min={new Date().toISOString().split('T')[0]} 
                                                    required 
                                                    className="form-input block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <Calendar className="h-5 w-5 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="selectedTimeSlot" className="block text-sm font-medium text-gray-700">
                                                Time
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <select 
                                                    id="selectedTimeSlot" 
                                                    name="selectedTimeSlot"
                                                    value={selectedTimeSlot} 
                                                    onChange={(e) => setSelectedTimeSlot(e.target.value)} 
                                                    required 
                                                    disabled={!healthcareProvider || availableTimeSlots.length === 0}
                                                    className="form-select block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                                >
                                                    <option value="" disabled>--:-- --</option>
                                                    {availableTimeSlots.map(slot => (
                                                        <option key={slot} value={slot}>{slot}</option>
                                                    ))}
                                                </select>
                                                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <Clock className="h-5 w-5 text-gray-400" />
                                                </div>
                                            </div>
                                            {healthcareProvider && availableTimeSlots.length === 0 && (
                                                <p className="mt-1 text-xs text-red-500">No time slots available for this provider.</p>
                                            )}
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
                                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority Level</label>
                                            <select id="priority" name="priority" value={priority} onChange={(e) => setPriority(parseInt(e.target.value, 10))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white">
                                                {priorityLevels.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-5">
                                        <button
                                            type="submit" // This button will now trigger the form's onSubmit
                                            disabled={isLoading}
                                            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                                                    Scheduling...
                                                </>
                                            ) : (
                                                'Schedule Appointment'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-20 bg-black bg-opacity-25 lg:hidden" 
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    );
}

export default CareConnectDashboard;
