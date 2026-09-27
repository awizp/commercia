import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ totalPages = 1, currentPage = 1, onPageChange }) => {
    if (totalPages <= 1) return null;

    const handlePageClick = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        onPageChange?.(page);
    };

    // Calculate visible page range
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="w-full flex justify-center py-6">
            <nav className="inline-flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white/90 backdrop-blur-md rounded-full border border-purple-100 shadow-md shadow-purple-500/5">
                {/* Prev button */}
                <button
                    type="button"
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous Page"
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white text-slate-600 shadow-sm border border-slate-100 hover:text-purple-600 hover:border-purple-200 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                    <ChevronLeft size={16} />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1 sm:gap-1.5 px-1">
                    {getPageNumbers().map((item, idx) => {
                        if (item === "...") {
                            return (
                                <span
                                    key={`ellipsis-${idx}`}
                                    className="w-7 sm:w-8 text-center text-slate-400 select-none text-xs"
                                >
                                    ...
                                </span>
                            );
                        }

                        const isActive = item === currentPage;
                        return (
                            <button
                                key={item}
                                type="button"
                                onClick={() => handlePageClick(item)}
                                className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${isActive
                                        ? "bg-purple-500 text-white shadow-md shadow-purple-300 scale-105"
                                        : "bg-white text-slate-700 shadow-xs border border-slate-100 hover:text-purple-600 hover:border-purple-200"
                                    }`}
                            >
                                {item}
                            </button>
                        );
                    })}
                </div>

                {/* Next button */}
                <button
                    type="button"
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next Page"
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white text-slate-600 shadow-sm border border-slate-100 hover:text-purple-600 hover:border-purple-200 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                    <ChevronRight size={16} />
                </button>
            </nav>
        </div>
    );
};

export default Pagination;