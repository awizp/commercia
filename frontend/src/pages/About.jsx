import { Link } from "react-router";
import { Sparkles, ShieldCheck, Truck, Headphones, Award, Users, ArrowRight, CheckCircle2 } from "lucide-react";

import { PageTitle, ScrollToTop } from "../components/ui";
import { Navbar, Footer } from "../components";

const STATS = [
    { label: "Active Customers", value: "250K+" },
    { label: "Curated Products", value: "10K+" },
    { label: "On-Time Deliveries", value: "99.8%" },
    { label: "Customer Satisfaction", value: "4.9/5" }
];

const VALUES = [
    {
        icon: ShieldCheck,
        title: "Verified Authenticity",
        desc: "Every product in our catalog is rigorously verified and directly sourced from authentic certified brands."
    },
    {
        icon: Truck,
        title: "Express Fulfillment",
        desc: "End-to-end synchronized order processing ensuring dispatch within 24 hours to your doorstep."
    },
    {
        icon: Headphones,
        title: "24/7 Dedicated Support",
        desc: "Our responsive specialist team is always on standby to assist with inquiries, warranties, and orders."
    },
    {
        icon: Award,
        title: "Quality First Guarantee",
        desc: "Hassle-free 30-day return policy and full manufacturer warranties backed on every purchase."
    }
];

const About = () => {
    return (
        <>
            <ScrollToTop />
            <PageTitle title="About Us | Commercia" />
            <Navbar />

            <div className="w-full min-h-screen bg-purple-50/20 pt-28 pb-20">
                <div className="custom-container max-w-6xl mx-auto px-4 sm:px-6 space-y-16">

                    {/* Hero Section */}
                    <section className="text-center space-y-4 max-w-3xl mx-auto pt-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider shadow-xs">
                            <Sparkles size={14} />
                            <span>The Commercia Vision</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            Redefining Modern Shopping with Precision & Elegance
                        </h1>
                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                            Commercia was founded on a simple principle: high-end tech, accessories, and everyday essentials should be straightforward to discover, reliably delivered, and supported by a team that genuinely cares.
                        </p>
                    </section>

                    {/* Metrics Banner */}
                    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {STATS.map((stat, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-3xl p-6 border border-purple-100/70 shadow-sm text-center space-y-1 hover:border-purple-200 transition"
                            >
                                <p className="text-2xl sm:text-4xl font-black text-purple-600 tracking-tight">{stat.value}</p>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </section>

                    {/* Story Pane */}
                    <section className="bg-white rounded-3xl p-8 sm:p-12 border border-purple-100/70 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div className="space-y-5">
                            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                                <Users size={20} />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Built for creators, builders, and everyday innovators
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                What started as a small digital storefront has grown into an international platform. We eliminate the guesswork out of e-commerce by maintaining strict quality controls, transparent inventory levels, and real-time shipment updates.
                            </p>
                            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-semibold">
                                <li className="flex items-center gap-2.5">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                    <span>Direct manufacturer partnerships with no counterfeit risk</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                    <span>Real-time stock reservation and rapid multi-node logistics</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                    <span>Encrypted payments powered by enterprise gateway security</span>
                                </li>
                            </ul>
                        </div>

                        <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-purple-100 shadow-md">
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
                                alt="Commercia Team"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </section>

                    {/* Core Pillars */}
                    <section className="space-y-8">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Why Customers Trust Commercia
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
                                We combine intuitive technology with unmatched service standards to make online shopping seamless.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {VALUES.map((val, idx) => {
                                const Icon = val.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="bg-white rounded-3xl p-6 border border-purple-100/70 shadow-sm space-y-3 hover:shadow-md transition group"
                                    >
                                        <div className="w-10 h-10 rounded-2xl bg-purple-50 group-hover:bg-purple-600 text-purple-600 group-hover:text-white flex items-center justify-center transition-colors">
                                            <Icon size={20} />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900">{val.title}</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed">{val.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Storefront CTA */}
                    <section className="bg-purple-600 text-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-purple-600/20 text-center space-y-5">
                        <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                            Ready to upgrade your everyday gear?
                        </h2>
                        <p className="text-xs sm:text-sm text-purple-100 max-w-md mx-auto">
                            Browse through our catalog of verified consumer electronics, lifestyle gadgets, and premium accessories.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 py-3 px-6 bg-white text-purple-700 hover:bg-purple-50 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
                        >
                            <span>Explore Storefront</span>
                            <ArrowRight size={16} />
                        </Link>
                    </section>

                </div>
            </div>

            <Footer />
        </>
    );
};

export default About;