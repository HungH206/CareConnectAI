"use client";

import React, { useState, useEffect } from 'react';
import { 
    Download, 
    LineChart, 
    HeartPulse, 
    Droplets,
    BrainCircuit,
    Languages,
    Loader2,
    X,
    Stethoscope,
    ListChecks
} from 'lucide-react';

// --- Enhanced Mock Data with Detailed Content ---
const detailedReportsData = [
  {
    id: 'report-001',
    icon: <LineChart className="h-6 w-6 text-blue-500" />,
    title: 'Monthly Health Summary',
    date: 'May 1, 2025',
    content: {
        diagnosis: "Patient presents with normotensive readings and stable glycemic control. Lipid panel indicates borderline hypercholesterolemia.",
        recommendations: "Recommend therapeutic lifestyle changes (TLC), including dietary modification focusing on reduced saturated fat intake and increased physical activity to 150 minutes of moderate-intensity exercise per week. Re-evaluate lipid panel in 3 months."
    }
  },
  {
    id: 'report-002',
    icon: <HeartPulse className="h-6 w-6 text-red-500" />,
    title: 'Cardiac Assessment',
    date: 'April 15, 2025',
    content: {
        diagnosis: "Electrocardiogram (ECG) shows normal sinus rhythm with no significant ST-segment abnormalities. Echocardiogram reveals an ejection fraction (EF) of 60% with no valvular dysfunction.",
        recommendations: "No acute cardiac intervention required. Continue current medication regimen for hypertension. Advise patient on the importance of continued adherence and regular monitoring of blood pressure."
    }
  },
  {
    id: 'report-003',
    icon: <Droplets className="h-6 w-6 text-cyan-500" />,
    title: 'Blood Work Analysis',
    date: 'April 10, 2025',
    content: {
        diagnosis: "Complete Blood Count (CBC) is within normal limits. Comprehensive Metabolic Panel (CMP) is unremarkable except for a slightly elevated Alanine Aminotransferase (ALT) level, suggesting potential hepatic stress.",
        recommendations: "Advise cessation of alcohol consumption and review of all medications for potential hepatotoxicity. Schedule a follow-up liver function test (LFT) in 6 weeks to ensure normalization."
    }
  },
];

const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'zh', name: 'Chinese (Mandarin)' },
    { code: 'hi', name: 'Hindi' },
];

type Report = typeof detailedReportsData[0];
type ProcessedText = { simplifiedText: string; translatedText: string; language: string; };

// --- Component to show the detailed view of a selected report ---
const ReportDetailView = ({ report, onClose }: { report: Report; onClose: () => void; }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    
    // --- FIX APPLIED HERE ---
    // The state's type is now `ProcessedText | null` to allow clearing the state during loading.
    const [processedContent, setProcessedContent] = useState<Record<string, ProcessedText | null>>({});
    
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    // Reset state when the selected report changes
    useEffect(() => {
        setProcessedContent({});
        setSelectedLanguage('en');
    }, [report]);

    const handleProcessText = async (text: string, field: 'diagnosis' | 'recommendations') => {
        if (!text) return;
        setIsProcessing(true);
        // This is now valid because the state type allows null
        setProcessedContent(prev => ({ ...prev, [field]: null }));

        try {
            const response = await fetch('/api/process-text', { // Calls our Python backend
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, language: selectedLanguage }),
            });
            if (!response.ok) throw new Error('API request failed');
            const data: ProcessedText = await response.json();
            setProcessedContent(prev => ({ ...prev, [field]: data }));
        } catch (error) {
            console.error("Failed to process text:", error);
            // You could set an error state here to show in the UI
        } finally {
            setIsProcessing(false);
        }
    };
    
    return (
        <div className="mt-6 bg-white rounded-lg shadow-lg border p-6 space-y-4 animate-fade-in">
            <div className="flex justify-between items-center pb-4 border-b">
                <div className="flex items-center gap-3">
                    {report.icon}
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{report.title}</h3>
                        <p className="text-sm text-gray-500">Generated on {report.date}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2">
                        <Languages size={16} className="text-gray-500" />
                        <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="text-sm border-gray-300 rounded-md shadow-sm"
                        >
                            {availableLanguages.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><X /></button>
                </div>
            </div>

            {/* Diagnosis Section */}
            <div className="space-y-2">
                <h4 className="font-semibold text-gray-700 flex items-center gap-2"><Stethoscope size={18} /> Official Diagnosis</h4>
                <p className="text-gray-600 ml-2 pl-4 border-l-4 border-gray-200">{report.content.diagnosis}</p>
                <button onClick={() => handleProcessText(report.content.diagnosis, 'diagnosis')} disabled={isProcessing} className="flex items-center gap-2 text-sm text-teal-600 font-semibold hover:text-teal-800 disabled:opacity-50">
                    <BrainCircuit size={16} /> Explain This to Me
                </button>
                {/* More precise loading indicator */}
                {isProcessing && processedContent.diagnosis === null && <Loader2 className="animate-spin mt-2 text-teal-500" />}
                {processedContent.diagnosis && (
                    <div className="mt-2 p-3 bg-teal-50/70 rounded-md border border-teal-200">
                        <p className="text-teal-900 whitespace-pre-wrap">{processedContent.diagnosis.translatedText}</p>
                    </div>
                )}
            </div>

            {/* Recommendations Section */}
            <div className="space-y-2 pt-4 border-t">
                <h4 className="font-semibold text-gray-700 flex items-center gap-2"><ListChecks size={18} /> Doctor's Recommendations</h4>
                <p className="text-gray-600 ml-2 pl-4 border-l-4 border-gray-200">{report.content.recommendations}</p>
                <button onClick={() => handleProcessText(report.content.recommendations, 'recommendations')} disabled={isProcessing} className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-800 disabled:opacity-50">
                    <BrainCircuit size={16} /> Explain This to Me
                </button>
                {/* More precise loading indicator */}
                {isProcessing && processedContent.recommendations === null && <Loader2 className="animate-spin mt-2 text-blue-500" />}
                {processedContent.recommendations && (
                    <div className="mt-2 p-3 bg-blue-50/70 rounded-md border border-blue-200">
                        <p className="text-blue-900 whitespace-pre-wrap">{processedContent.recommendations.translatedText}</p>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Main Page Component ---
export default function ReportsPage() {
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Health Reports</h1>
            
            {/* Recent Reports List */}
            <div className="rounded-lg bg-white p-6 shadow-sm border">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Recent Reports</h2>
                <div className="divide-y divide-gray-200">
                    {detailedReportsData.map((report) => (
                        <div key={report.id} className="flex items-center justify-between py-4">
                            <button onClick={() => setSelectedReport(report)} className="flex items-center gap-4 text-left w-full hover:bg-gray-50 p-2 rounded-md">
                                {report.icon}
                                <div>
                                    <p className={`font-semibold ${selectedReport?.id === report.id ? 'text-teal-600' : 'text-gray-800'}`}>{report.title}</p>
                                    <p className="text-sm text-gray-500">Generated on {report.date}</p>
                                </div>
                            </button>
                            <a href="#" className="ml-4 flex-shrink-0 flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                                <Download className="h-4 w-4" />
                                Download
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Conditionally render the detail view */}
            {selectedReport && (
                <ReportDetailView 
                    report={selectedReport} 
                    onClose={() => setSelectedReport(null)} 
                />
            )}
            
            <div className="mt-8 rounded-lg bg-white p-6 shadow-sm border">
               <h2 className="mb-4 text-xl font-semibold text-gray-900">Generate Custom Report</h2>
               <p className="text-gray-600">This feature is coming soon.</p>
            </div>
        </div>
    );
}