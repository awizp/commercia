import { useEffect, useState, useRef } from "react";
import { Link, useLocation, matchPath, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingBasket, UserRoundArrowLeft, Search, TextAlignEnd, X, LogOut, User as UserIcon, Package, LayoutDashboard, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

import CommerciaLogo from "/images/logo.png";
import { logoutUser } from "../features/users/userSlice.js";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isHome = matchPath("/", location.pathname);

    // Redux State
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const { cartItems } = useSelector((state) => state.cart);

    // Calculate total quantity of items in cart
    const totalCartItems = cartItems?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

    const [isMenuOpened, setIsMenuOpened] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);
    const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80";

    const isAdmin = user?.role === "admin";

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close dropdown and mobile menu on route changes
    useEffect(() => {
        const dropdownHandle = () => {
            setIsDropdownOpen(false);
            setIsMenuOpened(false);
        };

        dropdownHandle();
    }, [location.pathname]);

    // Handle logout action
    const handleLogout = async () => {
        setIsDropdownOpen(false);
        setIsMenuOpened(false);
        try {
            await dispatch(logoutUser()).unwrap();
            toast.success("Logged out successfully", { position: "bottom-center" });
            navigate("/login");
        } catch (err) {
            toast.error(err || "Failed to logout", { position: "bottom-center" });
        }
    };

    // Search handle to navigate products section
    const searchHandle = (e) => {
        e.preventDefault();

        if (searchQuery.trim()) {
            navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate("/products");
        }

        setSearchQuery("");
        setIsMenuOpened(false);
    };

    // Scroll listener for background styling
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getLinkClassName = (path, baseClasses = "nav-link") => {
        const isActive = matchPath({ path, end: true }, location.pathname);
        return `${baseClasses} ${isActive ? "bg-purple-600 px-3 py-1 rounded-full text-white" : ""}`;
    };

    return (
        <nav className={`w-full py-3 fixed top-0 z-50 transition duration-300 ${!isHome ? "bg-white/70 backdrop-blur-md border-b border-purple-900/30 shadow-lg" : isScrolled ? "bg-white/70 backdrop-blur-md border-b border-purple-900/30 shadow-lg" : "bg-transparent"}`}>
            <div className="custom-container">

                {/* Commercia Logo */}
                <div className="w-full flex justify-between items-center gap-5">
                    <div className="w-fit h-14 md:h-16">
                        <Link to="/">
                            <img src={CommerciaLogo} alt="Commercia Logo" className="w-full h-full object-contain cursor-pointer" />
                        </Link>
                    </div>

                    {/* Desktop Links */}
                    <div className="w-fit px-3 py-1.5 bg-white rounded-full hidden md:flex justify-center items-center gap-8 transition duration-300 shadow-md">
                        <Link to="/" className={getLinkClassName("/")}>Home</Link>
                        <Link to="/products" className={getLinkClassName("/products")}>Products</Link>
                        <Link to="/about" className={getLinkClassName("/about")}>About</Link>
                        <Link to="/contact" className={getLinkClassName("/contact")}>Contact</Link>
                    </div>

                    {/* Mobile Backdrop Overlay */}
                    <div
                        onClick={() => setIsMenuOpened(false)}
                        className={`fixed inset-0 bg-black/40 backdrop-blur-xs md:hidden z-40 transition-opacity duration-300 ${isMenuOpened ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                    />

                    {/* Mobile Drawer */}
                    <div className={`shadow-2xl border-l border-black/10 md:hidden w-72 sm:w-80 h-screen fixed top-0 right-0 bg-white p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out z-50 ${isMenuOpened ? "translate-x-0" : "translate-x-full"}`}>
                        <div className="flex flex-col gap-4">
                            {/* Close Button */}
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                <span className="text-sm font-semibold text-slate-800">Menu</span>
                                <button
                                    type="button"
                                    onClick={() => setIsMenuOpened(false)}
                                    className="p-1 rounded-full text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Mobile Search */}
                            <form onSubmit={searchHandle} className="w-full px-3 py-2 bg-slate-50 rounded-xl justify-between items-center flex sm:hidden border border-purple-500/20 shadow-xs">
                                <input
                                    type="text"
                                    placeholder="Search products"
                                    className="outline-none text-sm w-full bg-transparent"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" className="cursor-pointer text-slate-500 hover:text-purple-900">
                                    <Search size={16} />
                                </button>
                            </form>

                            {/* Nav links */}
                            <div className="flex flex-col gap-2 pt-2">
                                <Link to="/" onClick={() => setIsMenuOpened(false)} className={getLinkClassName("/", "nav-link w-full py-2 px-3 rounded-xl")}>Home</Link>
                                <Link to="/products" onClick={() => setIsMenuOpened(false)} className={getLinkClassName("/products", "nav-link w-full py-2 px-3 rounded-xl")}>Products</Link>
                                <Link to="/about" onClick={() => setIsMenuOpened(false)} className={getLinkClassName("/about", "nav-link w-full py-2 px-3 rounded-xl")}>About</Link>
                                <Link to="/contact" onClick={() => setIsMenuOpened(false)} className={getLinkClassName("/contact", "nav-link w-full py-2 px-3 rounded-xl")}>Contact</Link>
                            </div>
                        </div>

                        {/* Mobile Drawer Bottom Section */}
                        <div className="pt-4 border-t border-slate-100 space-y-3">
                            {isAuthenticated && user ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-purple-50/70 border border-purple-100/70">
                                        <div className={`w-11 h-11 rounded-full overflow-hidden shrink-0 bg-white ${isAdmin ? "ring-2 ring-purple-600 border-2 border-white shadow-xs" : "border border-purple-200"}`}>
                                            <img
                                                src={user?.avatar?.url || defaultAvatar}
                                                alt={user?.name || "User Avatar"}
                                                onError={(e) => { e.currentTarget.src = defaultAvatar; }}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        {/* Mobile Admin Dashboard Link */}
                                        {isAdmin && (
                                            <Link
                                                to="/admin/dashboard"
                                                onClick={() => setIsMenuOpened(false)}
                                                className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-sm font-bold text-purple-700 bg-purple-100/70 hover:bg-purple-200 transition"
                                            >
                                                <LayoutDashboard size={16} className="text-purple-600" />
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        )}
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsMenuOpened(false)}
                                            className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-600 transition"
                                        >
                                            <UserIcon size={16} />
                                            <span>My Profile</span>
                                        </Link>
                                        <Link
                                            to="/orders"
                                            onClick={() => setIsMenuOpened(false)}
                                            className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-600 transition"
                                        >
                                            <Package size={16} />
                                            <span>My Orders</span>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition cursor-pointer"
                                        >
                                            <LogOut size={16} />
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpened(false)}
                                        className="w-full py-2.5 px-4 bg-purple-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shadow-purple-200 hover:bg-purple-700 transition"
                                    >
                                        <UserRoundArrowLeft size={16} />
                                        <span>Sign In</span>
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMenuOpened(false)}
                                        className="w-full py-2.5 px-4 bg-purple-50 text-purple-700 border border-purple-200/60 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-purple-100 transition"
                                    >
                                        <span>Create Account</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Desktop Search, Cart, Desktop Profile & Hamburger */}
                    <div className="flex-center gap-4 sm:gap-5">
                        {/* Desktop Search Input */}
                        <form onSubmit={searchHandle} className="px-3 py-1.5 bg-white rounded-full hidden sm:flex justify-center items-center shadow-md">
                            <input
                                type="text"
                                placeholder="Search products"
                                className="outline-none w-full h-full block"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="w-fit h-full cursor-pointer hover:text-purple-900">
                                <Search size={18} />
                            </button>
                        </form>

                        {/* Cart Button with dynamic badge count */}
                        <Link
                            to="/cart"
                            title="Shopping Cart"
                            className="w-fit h-fit rounded-full p-2 bg-white relative hover:cursor-pointer group shadow-md"
                        >
                            <ShoppingBasket size={18} className="group-hover:text-purple-900 transition-colors" />

                            {totalCartItems > 0 && (
                                <span className="w-5 h-5 flex items-center justify-center absolute -top-1.5 -right-1.5 rounded-full bg-purple-600 text-white text-[11px] font-bold shadow-xs shadow-purple-500/30 animate-in zoom-in duration-200">
                                    {totalCartItems > 99 ? "99+" : totalCartItems}
                                </span>
                            )}
                        </Link>

                        {/* Desktop User Profile Dropdown */}
                        {isAuthenticated && user ? (
                            <div className="relative hidden md:block" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                                    className="w-fit rounded-full px-3 py-1 bg-white flex items-center gap-2 hover:cursor-pointer hover:text-purple-900 shadow-md border border-purple-100 transition"
                                >
                                    <span className="font-semibold text-xs text-slate-800">
                                        {user?.name?.split(" ")[0] || "Account"}
                                    </span>
                                    {/* Profile Avatar: ring-2 and border-2 applied when user is admin */}
                                    <span
                                        className={`w-7 h-7 rounded-full overflow-hidden bg-white flex items-center justify-center transition-all ${isAdmin
                                            ? "ring-2 ring-purple-600 border-2 border-white shadow-xs"
                                            : "border border-purple-200"
                                            }`}
                                    >
                                        <img
                                            src={user?.avatar?.url || defaultAvatar}
                                            alt={user?.name || "User profile"}
                                            onError={(e) => { e.currentTarget.src = defaultAvatar; }}
                                            className="w-full h-full object-cover"
                                        />
                                    </span>
                                    <ChevronDown
                                        size={14}
                                        className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-purple-600" : ""}`}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border border-purple-100/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                        {/* User Brief */}
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                        </div>

                                        {/* Dropdown Links */}
                                        <div className="p-1 space-y-0.5">
                                            {/* Prominent Admin Dashboard Link */}
                                            {isAdmin && (
                                                <Link
                                                    to="/admin/dashboard"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition"
                                                >
                                                    <LayoutDashboard size={15} className="text-purple-600" />
                                                    <span>Admin Dashboard</span>
                                                </Link>
                                            )}
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-600 transition"
                                            >
                                                <UserIcon size={15} />
                                                <span>My Profile</span>
                                            </Link>
                                            <Link
                                                to="/orders"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-600 transition"
                                            >
                                                <Package size={15} />
                                                <span>My Orders</span>
                                            </Link>
                                        </div>

                                        {/* Logout Button */}
                                        <div className="pt-1 px-1 border-t border-slate-100">
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
                                            >
                                                <LogOut size={15} />
                                                <span>Log Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="hidden md:flex w-fit rounded-full px-3 py-1 bg-white items-center gap-1 hover:cursor-pointer hover:text-purple-900 shadow-md">
                                <span className="text-xs font-medium">Login</span>
                                <span className="w-fit h-fit p-1 rounded-full"><UserRoundArrowLeft size={18} /></span>
                            </Link>
                        )}

                        {/* Hamburger Icon */}
                        <button
                            type="button"
                            onClick={() => setIsMenuOpened((prev) => !prev)}
                            className="md:hidden w-fit h-fit p-2 bg-white rounded-full hover:text-purple-800 cursor-pointer shadow-md"
                        >
                            <TextAlignEnd size={18} />
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;