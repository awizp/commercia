import { useEffect, useState } from "react";

import { Star } from "lucide-react";

const Rating = ({ value = 0, onRatingChange, disabled = false, showValue = true }) => {

    const [hover, setHover] = useState(0);
    const [rating, setRating] = useState(Math.floor(value));

    // if rating value changes while clicking again set rating value from product
    useEffect(() => {
        const changeRatingHandle = () => {
            setRating(Math.floor(value));
        };

        changeRatingHandle();
    }, [value]);

    // rating product by clicking
    const handleRating = (rate) => {
        if (disabled) return;
        setRating(rate);
        onRatingChange?.(rate);
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => {

                    // hover filling color
                    const filled = hover ? star <= hover : star <= rating;

                    return <Star
                        key={star}
                        size={16}
                        className={`transition duration-200 hover:scale-125
                        ${filled ? 'fill-amber-500 text-amber-500' : 'text-slate-600'}
                        ${disabled ? 'cursor-default' : 'cursor-pointer'}
                        `}
                        onMouseEnter={() => !disabled && setHover(star)}
                        onMouseLeave={() => !disabled && setHover(0)}
                        onClick={() => handleRating(star)}
                    />;
                })}
            </div>
            {showValue && <p className="text-slate-600 text-xs">{value} out of 5</p>}
        </div>
    );
};

export default Rating;