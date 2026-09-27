import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { ProductCard } from "./ui";

const Collections = ({ products }) => {

    const gap = 40; // gap-10 = 40px
    const step = 300; // 300px to move carousel gap-10 + w-64

    const [translateX, setTranslateX] = useState(0);
    const containerRef = useRef(null);

    const handlePrev = () => {
        setTranslateX((prev) => Math.min(prev + step, 0));
    };

    const handleNext = () => {
        if (!containerRef.current) return;

        // total width of products and remove gap
        const totalWidth = products.length * step - gap;
        // total width of container and minus 50px
        const visibleWidth = containerRef.current.offsetWidth - 50;
        // maximum scrolling
        const maxScroll = -(totalWidth - visibleWidth);

        setTranslateX((prev) => {
            const nextScroll = prev - step;
            return nextScroll < maxScroll ? maxScroll : nextScroll;
        });
    };

    return (
        <section className="w-full py-20">
            <div ref={containerRef} className="custom-container space-y-10 overflow-hidden">

                {/* heading */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Our Products</h2>

                    <Link to="/products" className="flex items-center gap-2 text-sm text-slate-600 hover:text-purple-600">
                        browse <ArrowRight size={14} />
                    </Link>
                </div>

                {/* products */}
                <div className="w-fit flex gap-10 flex-nowrap transition duration-500 ease" style={{ transform: `translateX(${translateX}px)` }}>
                    {products.map((product, idx) => (
                        <div key={idx} className="w-65 shrink-0">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* buttons */}
                <div className="w-full flex justify-end items-end gap-5">
                    <button
                        onClick={handlePrev}
                        className="text-slate-400 hover:text-purple-600 p-2 border border-slate-400 hover:border-purple-600 cursor-pointer rounded-full">
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="text-slate-400 hover:text-purple-600 p-2 border border-slate-400 hover:border-purple-600 cursor-pointer rounded-full">
                        <ChevronRight size={18} />
                    </button>
                </div>

            </div>
        </section>
    );
};

export default Collections;