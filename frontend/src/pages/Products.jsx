import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import toast from "react-hot-toast";

import { Footer, Navbar, SidebarFilter, ProductList } from "../components";
import { PageTitle, Pagination, ProductsLoader, ScrollToTop } from "../components/ui";
import { getProduct, removeErrors } from "../features/products/productSlice.js";

const Products = () => {
    const {
        products = [],
        productCount = 0,
        categories = [],
        loading = false,
        error = null,
        resultPerPage = 0
    } = useSelector((state) => state.product || state.products || {});
    const dispatch = useDispatch();

    // URL search params handling
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") || "";
    const pageFromUrl = parseInt(searchParams.get("page"), 10) || 1;
    const categoryFromUrl = searchParams.get("category") || "All";
    const maxPriceFromUrl = Number(searchParams.get("maxPrice")) || 500;

    // Filter drawer and local price range slider state
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState(maxPriceFromUrl);

    // Calculate total pages from productCount and resultPerPage
    const totalPages = Math.ceil((productCount || 0) / (resultPerPage || 6)) || 1;

    // Sync products from backend whenever URL query changes
    useEffect(() => {
        dispatch(
            getProduct({
                keyword,
                page: pageFromUrl,
                category: categoryFromUrl,
                maxPrice: maxPriceFromUrl < 500 ? maxPriceFromUrl : undefined
            })
        );
    }, [dispatch, keyword, pageFromUrl, categoryFromUrl, maxPriceFromUrl]);

    // Handle toast error notifications
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    // Handle Category Filter Selection
    const handleCategoryChange = (newCategory) => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete("page"); // Reset back to page 1 on filter change

        if (newCategory === "All") {
            nextParams.delete("category");
        } else {
            nextParams.set("category", newCategory);
        }

        setSearchParams(nextParams);
        setIsFilterOpen(false);
    };

    // Handle Price Filter Slider Change
    const handlePriceChange = (finalPrice) => {
        setPriceRange(finalPrice);
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete("page"); // Reset to page 1

        if (finalPrice >= 500) {
            nextParams.delete("maxPrice");
        } else {
            nextParams.set("maxPrice", finalPrice);
        }

        setSearchParams(nextParams);
    };

    // Reset Filters back to default
    const handleResetFilters = () => {
        setPriceRange(500);
        const nextParams = new URLSearchParams();
        if (keyword) nextParams.set("keyword", keyword);

        setSearchParams(nextParams);
        setIsFilterOpen(false);
    };

    // Handle page changes through URLSearchParams
    const handlePageChange = (newPage) => {
        if (newPage === pageFromUrl) return;

        const nextParams = new URLSearchParams(searchParams);
        if (newPage === 1) {
            nextParams.delete("page");
        } else {
            nextParams.set("page", newPage);
        }
        setSearchParams(nextParams);

        // Smooth scroll to top of products grid
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return loading ? (
        <ProductsLoader />
    ) : (
        <>
            <ScrollToTop />
            <PageTitle title="Our Products | Commercia" />
            <Navbar />

            <section className="w-full py-24 md:py-28 bg-purple-50/20 min-h-screen">
                <div className="custom-container">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* Sidebar */}
                        <div className="lg:col-span-3">
                            <SidebarFilter
                                categories={categories}
                                selectedCategory={categoryFromUrl}
                                onCategoryChange={handleCategoryChange}
                                priceRange={priceRange}
                                onPriceChange={handlePriceChange}
                                onReset={handleResetFilters}
                                isOpen={isFilterOpen}
                                setIsOpen={setIsFilterOpen}
                            />
                        </div>

                        {/* Products List & Pagination */}
                        <div className="lg:col-span-9 space-y-8">
                            <ProductList
                                products={products || []}
                                totalCount={productCount || products?.length || 0}
                                onOpenFilter={() => setIsFilterOpen(true)}
                            />

                            <Pagination
                                totalPages={totalPages}
                                currentPage={pageFromUrl}
                                onPageChange={handlePageChange}
                            />
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default Products;