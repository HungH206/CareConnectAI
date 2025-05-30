"use client"; // Essential for a component with client-side hooks

import React, { useState, useEffect, FormEvent, JSX } from 'react';

// Firebase SDK functions
import {
    collection, addDoc, doc, deleteDoc, onSnapshot, query,
    // Firestore, Query, QuerySnapshot, DocumentData, CollectionReference, DocumentReference // Optional for stricter types
} from 'firebase/firestore';
import {
    // Auth, User, // Optional for stricter types
    signInAnonymously, onAuthStateChanged, signInWithCustomToken,
} from 'firebase/auth';
// These are now expected to be imported if NOT using the global __firebase_config approach
// For a typical Next.js app, you'd have a central Firebase initialization file.
// Let's assume the user will create 'src/lib/firebaseConfig.ts' as previously guided.
import { db as firebaseDb, auth as firebaseAuth, app as firebaseApp, firebaseConfigAvailable } from '../../../lib/firebaseConfig'; // Adjust path as needed
// Note: firebaseConfig.ts needs to export 'firebaseConfigAvailable' (boolean)

// --- Type Definitions ---
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
  doctorId: string; // Made sure this is handled
  doctorName: string;
  preferredDate: string;
  timeSlot: string;
  status: string;
  requestedAt: string;
  userId: string | null;
  appId: string; // This can be a constant or from env variables
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

// App ID - recommend using an environment variable or a constant
const appId: string = process.env.NEXT_PUBLIC_APP_ID || 'careconnect-ai-app';

// Mock Data (ensure 'doctorId' is included)
const mockAppointmentTypes: SelectOption[] = [
    { value: 'regular_checkup', label: 'Regular Check-up' },
    { value: 'follow_up', label: 'Follow-up' },
    { value: 'specialist_consultation', label: 'Specialist Consultation' },
];

const mockDoctors: MockDoctor[] = [
    { id: 'doc1', name: 'Dr. John Doe (Cardiology)', specialty: 'Cardiology', availableSlots: ['09:00', '10:00'] },
    { id: 'doc_smith_figma', name: 'Dr. Smith (Primary Care)', specialty: 'Primary Care', availableSlots: ['09:00', '11:00']},
];

const priorityLevels: SelectOption[] = [
    { value: 1, label: 'Urgent' }, { value: 3, label: 'Medium' },
];

function AppointmentForm(): JSX.Element { // If JSX is not found, check tsconfig.json and @types/react
    const [patientName, setPatientName] = useState<string>('Test User');
    const [patientAge, setPatientAge] = useState<string>('30');
    const [symptoms, setSymptoms] = useState<string>('Routine check');
    const [priority, setPriority] = useState<number>(3);
    const [appointmentType, setAppointmentType] = useState<string>('regular_checkup');
    const [healthcareProvider, setHealthcareProvider] = useState<string>('');
    const [preferredDate, setPreferredDate] = useState<string>('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
    const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<Message>({ type: '', text: '' });
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

    // Use imported db and auth instances, or fall back to simple mocks if not available
    const dbInstance = firebaseConfigAvailable ? firebaseDb : null;
    const authInstance = firebaseConfigAvailable ? firebaseAuth : null;

    const initialMockAppointments: Appointment[] = [
        { id: 'appt1_mock', doctorId: 'doc_smith_figma', doctorName: 'Dr. Smith', patientName: 'Follow-up User', patientAge: 45, symptoms: 'Follow-up', priority: 3, appointmentType: 'follow_up', appointmentTypeName: 'Follow-up', preferredDate: '2025-05-22', timeSlot: '10:00 AM', status: 'confirmed', requestedAt: new Date(2025,4,20).toISOString(), userId: 'mock_user_123', appId },
        { id: 'appt2_mock', doctorId: 'doc1', doctorName: 'Dr. John Doe', patientName: 'Consult User', patientAge: 30, symptoms: 'Consultation', priority: 1, appointmentType: 'specialist_consultation', appointmentTypeName: 'Specialist Consultation', preferredDate: '2025-05-25', timeSlot: '02:30 PM', status: 'confirmed', requestedAt: new Date(2025,4,21).toISOString(), userId: 'mock_user_123', appId },
    ];
    const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>(initialMockAppointments);


    useEffect(() => {
        if (firebaseConfigAvailable && authInstance) {
            console.log("Firebase config is available. Setting up auth listener.");
            const unsubscribe = onAuthStateChanged(authInstance, async (user: any /* Firebase User */) => {
                if (user) {
                    setUserId(user.uid);
                    console.log("User is signed in with UID:", user.uid);
                } else {
                    setUserId(null);
                    console.log("User is signed out. Attempting anonymous sign-in.");
                    // Simplified: always try anonymous if no user. Remove custom token logic unless specifically needed and configured.
                    try {
                        await signInAnonymously(authInstance);
                    } catch (error) {
                        console.error("Error during anonymous sign-in attempt:", error);
                        setMessage({ type: 'error', text: 'User authentication error.' });
                    }
                }
                setIsAuthReady(true);
            });
            return () => unsubscribe();
        } else {
            console.warn("Firebase config not available or auth instance missing. Using mock auth flow.");
            // Simulate mock auth flow
            setTimeout(() => {
                setUserId('mock_user_123'); // Simulate mock user
                setIsAuthReady(true);
            }, 100);
        }
    }, [authInstance]); // Depend on authInstance

    useEffect(() => {
        if (!isAuthReady || !userId) return;

        if (dbInstance) { // Check if dbInstance (real Firebase db) is available
            console.log("Setting up Firestore onSnapshot listener.");
            const appointmentsCollectionPath = `artifacts/${appId}/public/data/pendingAppointmentsGlobal`;
            const appointmentsQuery = query(collection(dbInstance, appointmentsCollectionPath));
            
            const unsubscribe = onSnapshot(appointmentsQuery, (querySnapshot: any) => {
                const fetchedAppointments: Appointment[] = [];
                querySnapshot.forEach((docSnapshot: any) => {
                    if (typeof docSnapshot.data === 'function') {
                        fetchedAppointments.push({ id: docSnapshot.id, ...(docSnapshot.data() as Omit<Appointment, 'id'>) });
                    }
                });
                fetchedAppointments.sort((a, b) => new Date(`${a.preferredDate}T${a.timeSlot || '00:00'}`).getTime() - new Date(`${b.preferredDate}T${b.timeSlot || '00:00'}`).getTime());
                setPendingAppointments(fetchedAppointments);
            }, (error: Error) => {
                console.error("Error fetching appointments from Firestore: ", error);
                setMessage({ type: 'error', text: 'Could not load appointment list.' });
            });
            return () => unsubscribe();
        } else {
            console.warn("dbInstance not available. Displaying initial mock appointments.");
            setPendingAppointments(initialMockAppointments); // Or keep whatever mock data logic you prefer
        }
    }, [dbInstance, isAuthReady, userId]);

    useEffect(() => {
        if (healthcareProvider) {
            const doctor = mockDoctors.find(doc => doc.id === healthcareProvider);
            setAvailableTimeSlots(doctor ? doctor.availableSlots : []);
            setSelectedTimeSlot('');
        } else {
            setAvailableTimeSlots([]);
        }
    }, [healthcareProvider]);

    const handleCancelAppointment = async (appointmentIdFromUI: string | undefined): Promise<void> => {
        if (!appointmentIdFromUI) {
            setMessage({ type: 'error', text: 'Invalid appointment ID for cancellation.' });
            return;
        }
        if (!dbInstance || !userId) {
            setMessage({ type: 'error', text: 'Cannot cancel: Data service not ready or user not authenticated.' });
            // Mock cancel if dbInstance is not real
            if (!dbInstance) {
                 setPendingAppointments(prev => prev.filter(appt => appt.id !== appointmentIdFromUI));
                 setMessage({ type: 'success', text: `Mock appointment ${appointmentIdFromUI} cancelled.` });
            }
            return;
        }
        setIsLoading(true);
        try {
            const appointmentRef = doc(dbInstance, `artifacts/${appId}/public/data/pendingAppointmentsGlobal`, appointmentIdFromUI);
            await deleteDoc(appointmentRef);
            setMessage({ type: 'success', text: `Appointment ${appointmentIdFromUI} cancelled.` });
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            setMessage({ type: 'error', text: 'Error cancelling appointment.' });
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!isAuthReady || !userId) {
            setMessage({ type: 'error', text: 'User not authenticated. Please wait.' });
            return;
        }
        if (!healthcareProvider || !selectedTimeSlot || !preferredDate || !appointmentType) {
            setMessage({ type: 'error', text: 'Please fill in all required fields.' });
            return;
        }
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        const newAppointmentData: Appointment = {
            // id will be generated by Firestore or mock logic
            patientName,
            patientAge: parseInt(patientAge, 10) || 0,
            symptoms,
            priority,
            appointmentType,
            appointmentTypeName: mockAppointmentTypes.find(t => t.value === appointmentType)?.label || appointmentType,
            doctorId: healthcareProvider, // Ensure this is assigned
            doctorName: mockDoctors.find(d => d.id === healthcareProvider)?.name || 'N/A',
            preferredDate,
            timeSlot: selectedTimeSlot,
            status: 'pending_confirmation',
            requestedAt: new Date().toISOString(),
            userId: userId,
            appId: appId,
        };

        try {
            if (dbInstance) { // Real Firebase DB
                const appointmentsCollectionRef = collection(dbInstance, `artifacts/${appId}/public/data/pendingAppointmentsGlobal`);
                const docRef = await addDoc(appointmentsCollectionRef, newAppointmentData);
                setMessage({ type: 'success', text: `Appointment request sent (ID: ${docRef.id}).` });
                setAppointmentType('regular_checkup');
                setHealthcareProvider('');
                setPreferredDate('');
                setSelectedTimeSlot('');
            } else { // Mock logic
                console.log("Mock submission:", newAppointmentData);
                const mockId = `mock_id_${Date.now()}`;
                const newMockAppointment = { ...newAppointmentData, id: mockId };
                setPendingAppointments(prev => [...prev, newMockAppointment].sort((a,b) => new Date(`${a.preferredDate}T${a.timeSlot || '00:00'}`).getTime() - new Date(`${b.preferredDate}T${b.timeSlot || '00:00'}`).getTime()));
                setMessage({ type: 'success', text: 'Appointment request recorded (demo).' });
            }
        } catch (error) {
            console.error("Error submitting appointment: ", error);
            setMessage({ type: 'error', text: 'Error sending request.' });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isAuthReady) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center">
                     <p className="text-lg font-medium text-gray-700">Initializing Authentication...</p>
                </div>
            </div>
        );
    }

    return (
        // JSX structure remains the same as before
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Appointment Management
                </h1>
                {userId && <p className="text-xs text-gray-500 mt-1">UserID: {userId} (AppID: {appId})</p>}
            </header>

            {message.text && (
                <div className={`p-3 mb-6 rounded-md text-sm text-white ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {message.text}
                </div>
            )}

            <div className="mb-10 bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Appointments</h2>
                {pendingAppointments.length > 0 ? (
                    <ul className="space-y-4">
                        {pendingAppointments.map((appt) => (
                            <li key={appt.id} className="p-4 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div>
                                    <p className="font-semibold text-blue-600">{appt.appointmentTypeName || appt.symptoms} with {appt.doctorName}</p>
                                    <p className="text-sm text-gray-600">Date: {new Date(appt.preferredDate).toLocaleDateString('en-US', { timeZone: 'UTC' })} - Time: {appt.timeSlot}</p>
                                    <p className="text-xs text-gray-500">Patient: {appt.patientName} (Age: {appt.patientAge}) - Priority: {(priorityLevels.find(p=>p.value === appt.priority) as SelectOption)?.label || 'N/A'}</p>
                                </div>
                                <button
                                    onClick={() => handleCancelAppointment(appt.id)}
                                    disabled={isLoading}
                                    className="mt-2 sm:mt-0 sm:ml-4 px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No upcoming appointments.</p>
                )}
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-6">Schedule New Appointment</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <fieldset className="border border-gray-200 p-4 rounded-md">
                        <legend className="text-md font-semibold text-gray-600 px-2">Patient Information (for priority assessment)</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" id="patientName" value={patientName} onChange={(e) => setPatientName(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                            </div>
                            <div>
                                <label htmlFor="patientAge" className="block text-sm font-medium text-gray-700">Age</label>
                                <input type="number" id="patientAge" value={patientAge} onChange={(e) => setPatientAge(e.target.value)} required min="0" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">Symptoms/Reason for Visit</label>
                            <textarea id="symptoms" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={2} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority Level</label>
                            <select id="priority" value={priority} onChange={(e) => setPriority(parseInt(e.target.value, 10))} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white">
                                {priorityLevels.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
                            </select>
                        </div>
                    </fieldset>
                    
                    <fieldset className="border border-gray-200 p-4 rounded-md">
                         <legend className="text-md font-semibold text-gray-600 px-2">Appointment Details</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-2">
                            <div>
                                <label htmlFor="appointmentType" className="block text-sm font-medium text-gray-700">Appointment Type</label>
                                <select id="appointmentType" value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white">
                                    {mockAppointmentTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="healthcareProvider" className="block text-sm font-medium text-gray-700">Healthcare Provider</label>
                                <select id="healthcareProvider" value={healthcareProvider} onChange={(e) => setHealthcareProvider(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white">
                                    <option value="">-- Select Provider --</option>
                                    {mockDoctors.map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">Date</label>
                                <input type="date" id="preferredDate" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                            </div>
                            <div>
                                <label htmlFor="selectedTimeSlot" className="block text-sm font-medium text-gray-700">Time</label>
                                <select id="selectedTimeSlot" value={selectedTimeSlot} onChange={(e) => setSelectedTimeSlot(e.target.value)} required disabled={!healthcareProvider || availableTimeSlots.length === 0} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white disabled:bg-gray-100">
                                    <option value="">-- Select Time --</option>
                                    {availableTimeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                                </select>
                                {healthcareProvider && availableTimeSlots.length === 0 && <p className="mt-1 text-xs text-red-600">Provider has no available slots on the selected date or no schedule.</p>}
                            </div>
                        </div>
                    </fieldset>
                    
                    <div className="pt-2 text-right">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60"
                        >
                            {isLoading ? 'Processing...' : 'Schedule Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AppointmentForm;
