import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import { PageTitle, ScrollToTop } from "../components/ui";
import { Navbar, Footer } from "../components";

const CONTACT_INFO = [
    {
        icon: Mail,
        title: "Email Support",
        detail: "support@commercia.com",
        sub: "Responses within 24 hours"
    },
    {
        icon: Phone,
        title: "Phone Line",
        detail: "+1 (800) 456-7890",
        sub: "Mon - Fri from 9am to 6pm"
    },
    {
        icon: MapPin,
        title: "Headquarters",
        detail: "742 Evergreen Terrace",
        sub: "San Francisco, CA 94107"
    },
    {
        icon: Clock,
        title: "Business Hours",
        detail: "Open Mon – Sat",
        sub: "Sunday: Order processing only"
    }
];

const Contact = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
            toast.error("Please fill out all fields", { position: "bottom-center" });
            return;
        }

        setIsSubmitted(true);
        toast.success("Thank you! Your message has been received.", { position: "bottom-center" });
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
    };

    return (
        <>
            <ScrollToTop />
            <PageTitle title="Contact Us | Commercia" />
            <Navbar />

            <div className="w-full min-h-screen bg-purple-50/20 pt-28 pb-20">
                <div className="custom-container max-w-6xl mx-auto px-4 sm:px-6 space-y-14">

                    {/* Header */}
                    <div className="text-center space-y-3 max-w-2xl mx-auto pt-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider shadow-xs">
                            <MessageSquare size={14} />
                            <span>Customer Assistance</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                            We’re Here to Help
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Have questions about a recent order, warranty claim, product specifications, or enterprise bulk pricing? Drop us a note anytime.
                        </p>
                    </div>

                    {/* Grid Layout: Contact Info & Form */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* Contact Information Cards (5 cols) */}
                        <div className="lg:col-span-5 space-y-4">
                            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 px-1">
                                Communication Channels
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
                                {CONTACT_INFO.map((item, idx) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={idx}
                                            className="bg-white rounded-3xl p-5 border border-purple-100/70 shadow-sm flex items-start gap-4 hover:border-purple-200 transition"
                                        >
                                            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                                <Icon size={18} />
                                            </div>
                                            <div className="space-y-0.5 overflow-hidden">
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.title}</h3>
                                                <p className="text-sm font-extrabold text-slate-900 truncate">{item.detail}</p>
                                                <p className="text-xs text-slate-500">{item.sub}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Help Banner */}
                            <div className="bg-purple-600 text-white rounded-3xl p-6 shadow-lg shadow-purple-500/20 space-y-2">
                                <h3 className="text-sm font-extrabold flex items-center gap-2">
                                    <CheckCircle2 size={16} />
                                    <span>Immediate Order Help</span>
                                </h3>
                                <p className="text-xs text-purple-100 leading-relaxed">
                                    Need to inspect tracking status or download your invoice right away? You can view live milestones directly in your account.
                                </p>
                            </div>
                        </div>

                        {/* Message Form (7 cols) */}
                        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-purple-100/70 shadow-sm space-y-6">
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                                    Send us a Message
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    Our support agents typically reply within a few business hours.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                            Your Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Jane Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="jane@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Subject <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Order status inquiry / Product question"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        rows="5"
                                        required
                                        placeholder="How can our support team assist you today?"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-8 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-purple-200 hover:shadow-lg transition cursor-pointer"
                                >
                                    <Send size={16} />
                                    <span>Send Message</span>
                                </button>
                            </form>
                        </div>

                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
};

export default Contact;