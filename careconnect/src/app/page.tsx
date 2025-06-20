import Link from "next/link"
import { Heart, Globe, Zap, Cpu, MessageSquare, Activity, Shield, BarChart3, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardPreview from "@/components/dashboard-preview"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-gray-900 text-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-teal-500" />
            <span className="text-xl font-bold">CareConnect</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-teal-400 transition-colors">
              Features
            </Link>
            <Link href="#demo" className="text-sm font-medium hover:text-teal-400 transition-colors">
              Demo
            </Link>
            <Link href="#impact" className="text-sm font-medium hover:text-teal-400 transition-colors">
              Impact
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-teal-400 transition-colors">
              Contact
            </Link>
          </nav>
          <div>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gray-900 text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-lg bg-teal-900/30 px-3 py-1 text-sm text-teal-400">
                  AI-Powered Healthcare
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Real-time health monitoring for <span className="text-teal-400">everyone</span>,{" "}
                  <span className="text-teal-400">everywhere</span>
                </h1>
                <p className="text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  CareConnect bridges healthcare gaps with AI-driven remote monitoring, real-time anomaly detection, and
                  multilingual medical support for underserved communities worldwide.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                    <Link href="/dashboard">Get Started</Link>
                  </Button>
                  <Button variant="outline" className="text-white border-gray-700 hover:bg-gray-800">
                    Learn More
                  </Button>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-teal-400"></div>
                    <span className="text-sm text-gray-400">Real-time</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-teal-400"></div>
                    <span className="text-sm text-gray-400">AI-Powered</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-teal-400"></div>
                    <span className="text-sm text-gray-400">Global Access</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="bg-gray-800 rounded-xl p-4 shadow-xl w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Heart Rate Monitor</h3>
                    <span className="text-xs text-teal-400">Live</span>
                  </div>
                  <div className="h-32 w-full bg-gray-900 rounded-lg mb-4 relative overflow-hidden">
                    <svg viewBox="0 0 100 20" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                      <path
                        d="M0,10 L5,8 L10,12 L15,10 L20,14 L25,6 L30,10 L35,8 L40,10 L45,6 L50,12 L55,10 L60,8 L65,14 L70,10 L75,6 L80,10 L85,12 L90,8 L95,10 L100,8"
                        fill="none"
                        stroke="#2dd4bf"
                        strokeWidth="0.5"
                      />
                    </svg>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-900 p-3 rounded-lg">
                      <div className="text-xs text-gray-400">Avg</div>
                      <div className="text-xl font-bold">72 BPM</div>
                      <div className="text-xs text-gray-400">Normal</div>
                    </div>
                    <div className="bg-gray-900 p-3 rounded-lg">
                      <div className="text-xs text-gray-400">Peak</div>
                      <div className="text-xl font-bold">110 BPM</div>
                      <div className="text-xs text-gray-400">During exercise</div>
                    </div>
                    <div className="bg-gray-900 p-3 rounded-lg">
                      <div className="text-xs text-gray-400">Resting</div>
                      <div className="text-xl font-bold">62 BPM</div>
                      <div className="text-xs text-gray-400">Normal</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-900 p-3 rounded-lg">
                      <div className="text-xs text-gray-400">Blood Pressure</div>
                      <div className="text-xl font-bold">120/80</div>
                      <div className="text-xs text-gray-400">Normal</div>
                    </div>
                    <div className="bg-gray-900 p-3 rounded-lg">
                      <div className="text-xs text-gray-400">Blood Glucose</div>
                      <div className="text-xl font-bold">5.4 mmol/L</div>
                      <div className="text-xs text-gray-400">Normal</div>
                    </div>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs text-gray-400">AI Assistant</div>
                      <div className="text-xs text-teal-400">Online</div>
                    </div>
                    <div className="text-sm">
                      Your heart rate is within normal range. Would you like me to explain your latest health trends?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Comprehensive Health Monitoring
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                CareConnect integrates cutting-edge technologies to deliver a complete remote healthcare solution for
                patients and providers worldwide.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-start p-6 bg-white rounded-xl border shadow-sm">
                <div className="rounded-lg bg-teal-100 p-3 mb-4">
                  <Activity className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Real-time Monitoring</h3>
                <p className="text-gray-500 text-sm">
                  Secure streaming of biometric data from wearables and sensors via IoT and 5G integration.
                </p>
              </div>
              <div className="flex flex-col items-start p-6 bg-white rounded-xl border shadow-sm">
                <div className="rounded-lg bg-blue-100 p-3 mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Anomaly Detection</h3>
                <p className="text-gray-500 text-sm">
                  Edge computing with Amazon SageMaker detects health anomalies for faster triage and predictive
                  insights.
                </p>
              </div>
              <div className="flex flex-col items-start p-6 bg-white rounded-xl border shadow-sm">
                <div className="rounded-lg bg-purple-100 p-3 mb-4">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Multilingual Support</h3>
                <p className="text-gray-500 text-sm">
                  Converts technical diagnoses into simplified, multilingual explanations tailored to patient literacy
                  levels.
                </p>
              </div>
              <div className="flex flex-col items-start p-6 bg-white rounded-xl border shadow-sm">
                <div className="rounded-lg bg-amber-100 p-3 mb-4">
                  <MessageSquare className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Health Assistant</h3>
                <p className="text-gray-500 text-sm">
                  Virtual assistant guides patients through results and next steps in their native language.
                </p>
              </div>
              <div className="flex flex-col items-start p-6 bg-white rounded-xl border shadow-sm">
                <div className="rounded-lg bg-green-100 p-3 mb-4">
                  <Cpu className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Edge Computing</h3>
                <p className="text-gray-500 text-sm">
                  Processes data locally for faster response times, even in areas with limited connectivity.
                </p>
              </div>
              <div className="flex flex-col items-start p-6 bg-white rounded-xl border shadow-sm">
                <div className="rounded-lg bg-red-100 p-3 mb-4">
                  <UserPlus className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Personalized Care</h3>
                <p className="text-gray-500 text-sm">
                  AI-driven recommendations and alerts customized to each patient their unique health profile and
                  conditions.
                </p>
              </div>
              <div className="flex flex-col items-start p-6 bg-white rounded-xl border shadow-sm">
                <div className="rounded-lg bg-indigo-100 p-3 mb-4">
                  <BarChart3 className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Health Analytics</h3>
                <p className="text-gray-500 text-sm">
                  Advanced data insights for patients and healthcare providers with actionable health insights.
                </p>
              </div>
              <div className="flex flex-col items-start p-6 bg-white rounded-xl border shadow-sm">
                <div className="rounded-lg bg-gray-100 p-3 mb-4">
                  <Shield className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure & Compliant</h3>
                <p className="text-gray-500 text-sm">
                  Enterprise-grade security with HIPAA, GDPR, and local regulatory compliance for patient data
                  protection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 md:py-24 bg-teal-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">Process</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How CareConnect Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform seamlessly connects patients with healthcare insights through a simple process.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 mt-12">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-900">
                    1
                  </div>
                  <h3 className="text-xl font-bold">Connect</h3>
                  <p className="text-center text-gray-500">
                    Connect with your healthcare provider using your smartphone. No wearables required.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-900">
                    2
                  </div>
                  <h3 className="text-xl font-bold">Monitor</h3>
                  <p className="text-center text-gray-500">
                    Your health data is continuously monitored with edge computing for real-time analysis.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-900">
                    3
                  </div>
                  <h3 className="text-xl font-bold">Connect with Care Team</h3>
                  <p className="text-center text-gray-500">
                    Receive simplified explanations and guidance from doctors anytime, anywhere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section id="dashboard" className="py-16 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">Dashboard</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Experience the Platform</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Preview our intuitive dashboard that makes health monitoring simple and accessible.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl mt-12">
              <DashboardPreview />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-24 bg-teal-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">Get Started</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Ready to Transform Healthcare?
                  </h2>
                  <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Join the CareConnect platform and help bring accessible healthcare to underserved regions worldwide.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <Link href="/dashboard">Request Demo</Link>
                  </Button>
                  <Button variant="outline">Contact Sales</Button>
                </div>
              </div>
              <div className="flex flex-col space-y-4 rounded-lg border bg-white p-6 shadow-sm">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Contact Us</h3>
                  <p className="text-gray-500">Fill out the form below and our team will get back to you shortly.</p>
                </div>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="first-name" className="text-sm font-medium">
                        First name
                      </label>
                      <input id="first-name" className="w-full rounded-md border border-gray-300 p-2" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last-name" className="text-sm font-medium">
                        Last name
                      </label>
                      <input id="last-name" className="w-full rounded-md border border-gray-300 p-2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <input id="email" type="email" className="w-full rounded-md border border-gray-300 p-2" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      className="w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
                    ></textarea>
                  </div>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">Send Message</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12">
          <div className="flex flex-col gap-2 md:gap-4 lg:flex-1">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-teal-600" />
              <span className="text-xl font-bold">CareConnect</span>
            </div>
            <p className="text-sm text-gray-500">AI-Driven Global Remote Health Companion</p>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-teal-600">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-teal-600">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-teal-600">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-teal-600">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-teal-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-teal-600">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-teal-600">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-teal-600">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-teal-600">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-teal-600">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-teal-600">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-teal-600">
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-gray-500">© 2025 CareConnect. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-500 hover:text-teal-600">
                <span className="sr-only">Twitter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-teal-600">
                <span className="sr-only">LinkedIn</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-teal-600">
                <span className="sr-only">GitHub</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}