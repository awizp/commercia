import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { images } from "../utils/slideImages.js";

const ImgCarousel = () => {

    const [currentIdx, setCurrentIdx] = useState(0);

    // automatic slider
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIdx((prev) => (prev + 1) % images.length);
        }, 10000);

        return () => clearInterval(interval);
    }, [currentIdx]);

    // prev image
    // const prevSlideHandle = () => {
    //     setCurrentIdx(prev => prev === 0 ? images.length - 1 : prev - 1);
    // };

    // next image
    // const nextSlideHanlde = () => {
    //     setCurrentIdx((prev) => (prev + 1) % images.length);
    // };

    return (
        <section className="w-full shadow-lg overflow-hidden relative">

            {/* carousel area */}
            <div
                className='w-full flex transition duration-900 ease-in-out'
                style={{ transform: `translateX(-${currentIdx * 100}%)` }}
            >
                {images.map((img, idx) => (
                    <div key={idx} className="w-full h-75 md:h-112.5 shrink-0">
                        <img
                            src={img}
                            alt="Products Carousel Image"
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* overlay & carousel buttons */}
            <div className="absolute inset-0 flex-center bg-black/20">
                {/* <div className="w-full flex justify-between items-center p-3">
                    <button onClick={prevSlideHandle}
                        className="bg-black/20 text-white rounded-full p-1.5 cursor-pointer hover:text-purple-500 select-none">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextSlideHanlde}
                        className="bg-black/20 text-white rounded-full p-1.5 cursor-pointer hover:text-purple-500 select-none">
                        <ChevronRight size={20} />
                    </button>
                </div> */}

                {/* indicators */}
                <div className="absolute bottom-5 w-fit px-3 py-1 bg-black/10 rounded-full flex-center gap-3">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIdx(idx)}
                            className={`h-2 rounded-full transition duration-300 ease-in-out ${currentIdx === idx ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-purple-500'}`}
                        >
                        </button>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default ImgCarousel;