import { Link } from "react-router";
import { Mail, Phone } from "lucide-react";

import CompanyLogo from "/images/logo.png";
import { Facebook, Twitter, Instagram, WhatsApp } from "../utils/icons";

const Footer = () => {
    return (
        <footer className="w-full py-10 bg-black text-white">
            <div className="custom-container">

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 justify-center pb-10">
                    {/* company slogan */}
                    <div className="space-y-5">
                        <div className="w-fit h-14 md:h-16">
                            <img
                                src={CompanyLogo}
                                alt="Company logo"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <p className="text-slate-300 pr-8">Good vibes and great finds! Buy coolest products in online anywhere at anytime</p>
                    </div>

                    {/* quick links */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold">Quick Links</h3>

                        <div className="text-slate-300 space-y-1">
                            <Link to="/" className="block hover:text-white">Home</Link>
                            <Link to="/products" className="block hover:text-white">Products</Link>
                            <Link to="/about" className="block hover:text-white">About</Link>
                            <Link to="/contact" className="block hover:text-white">Contact</Link>
                        </div>
                    </div>

                    {/* contact us */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold">Contact Us</h3>

                        <div className="text-slate-300 space-y-3">
                            <a href="#" className="flex items-center gap-2 hover:text-white">
                                <Mail size={16} /> contact@commercia.com
                            </a>

                            <a href="#" className="flex items-center gap-2 hover:text-white">
                                <Phone size={16} /> +91 987654321
                            </a>
                        </div>
                    </div>

                    {/* social */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold">Contact Us</h3>

                        <div className="text-slate-300 flex items-center gap-3">
                            <a href="#" className="group">
                                <Facebook size={14} className="group-hover:fill-blue-900" />
                            </a>

                            <a href="#" className="group">
                                <Instagram size={14} className="group-hover:fill-pink-800" />
                            </a>

                            <a href="#" className="group">
                                <Twitter size={14} className="group-hover:fill-sky-500" />
                            </a>

                            <a href="#" className="group">
                                <WhatsApp size={14} className="group-hover:fill-green-600" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="text-center py-5 border-t border-slate-300/10">
                    <p className="text-slate-300 text-sm">
                        {new Date().getFullYear()} &copy; Commercia made by <a target="_blank" href="https://github.com/awizp" className='hover:text-white'>Vishnuprakash R</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;