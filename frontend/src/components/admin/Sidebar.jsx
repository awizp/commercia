import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import { LayoutDashboard, Package, ShoppingBag, Users, Star, ArrowLeft, LayoutGrid, X, ShieldCheck } from "lucide-react";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Products", to: "/admin/products", icon: Package },
        { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
        { label: "Users", to: "/admin/users", icon: Users },
        { label: "Reviews", to: "/admin/reviews", icon: Star },
    ];

    const currentItem = navItems.find((item) =>
        item.to === "/admin/dashboard"
            ? location.pathname === "/admin/dashboard"
            : location.pathname.startsWith(item.to)
    );

    const renderNavLinks = (isMobile = false) => (
        <nav className="space-y-1.5">
            {navItems.map((item) => {
                const Icon = item.icon;
                return (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/admin/dashboard"}
                        onClick={() => {
                            if (isMobile) setIsOpen(false);
                        }}
                        className={({ isActive }) =>
                            `group flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${isActive
                                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25 translate-x-1"
                                : "text-slate-600 hover:text-purple-600 hover:bg-purple-50/80"
                            }`
                        }
                    >
                        <div className="flex items-center gap-3">
                            <Icon size={18} className="transition-transform duration-200 group-hover:scale-110" />
                            <span>{item.label}</span>
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-0 group-hover:opacity-100 transition-opacity" />
                    </NavLink>
                );
            })}
        </nav>
    );

    return (
        <>
            {/*  Mobile Top Compact Bar */}
            <div className="md:hidden w-full bg-white/80 backdrop-blur-md rounded-2xl border border-purple-100/80 p-2.5 px-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-xs">
                        <ShieldCheck size={17} />
                    </div>
                    <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600">Admin</p>
                        <p className="text-xs font-bold text-slate-800 leading-none">{currentItem?.label || "Portal"}</p>
                    </div>
                </div>

                {/* Toggle Button */}
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-label="Toggle Admin Navigation"
                    className="w-9 h-9 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 flex items-center justify-center transition shadow-xs cursor-pointer active:scale-95"
                >
                    {isOpen ? <X size={18} /> : <LayoutGrid size={18} />}
                </button>
            </div>

            {/* Mobile Backdrop */}
            <div
                onClick={() => setIsOpen(false)}
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            />

            {/* Mobile Drawer Panel */}
            <div
                className={`fixed top-4 left-4 bottom-4 w-72 bg-white rounded-3xl z-50 p-6 flex flex-col justify-between shadow-2xl border border-purple-100/80 md:hidden transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-[-115%]"
                    }`}
            >
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-purple-100/60">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm shadow-purple-300">
                                <ShieldCheck size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-extrabold text-slate-900 leading-tight">Commercia</h3>
                                <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Control Panel</p>
                            </div>
                        </div>

                        {/* Icon-only close trigger */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close Navigation"
                            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-400 hover:text-purple-600 flex items-center justify-center transition cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Nav Links */}
                    {renderNavLinks(true)}
                </div>

                {/* Footer link */}
                <div className="pt-4 border-t border-purple-100/60">
                    <NavLink
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Storefront</span>
                    </NavLink>
                </div>
            </div>

            {/* Desktop Persistent Sidebar */}
            <aside className="hidden md:flex w-64 bg-white p-5 shrink-0 flex-col justify-between">
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-purple-100/70">
                        <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm shadow-purple-300">
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">Commercia</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-purple-600">Admin Portal</p>
                        </div>
                    </div>

                    {renderNavLinks(false)}
                </div>

                <div className="pt-4 border-t border-purple-100 mt-8">
                    <NavLink
                        to="/"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition"
                    >
                        <ArrowLeft size={15} />
                        <span>Back to Storefront</span>
                    </NavLink>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;