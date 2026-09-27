import React from 'react';
import { Truck, ShieldCheck, PhoneCall, RotateCcw } from 'lucide-react';

const FeaturesBanner = () => {
    const features = [
        {
            id: 1,
            icon: Truck,
            title: "Free Delivery",
            description: "Free shipping on all orders over $99"
        },
        {
            id: 2,
            icon: ShieldCheck,
            title: "Secure Shipping",
            description: "100% protected and tracked packages"
        },
        {
            id: 3,
            icon: PhoneCall,
            title: "24/7 Call Service",
            description: "Dedicated instant phone support"
        },
        {
            id: 4,
            icon: RotateCcw,
            title: "Easy Returns",
            description: "30 day hassle free return policy"
        }
    ];

    return (
        <section className="w-full py-15 bg-white">
            <div className="custom-container">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => {
                        const IconComponent = feature.icon;
                        return (
                            <div
                                key={feature.id}
                                className="flex flex-col items-center text-center p-6 transition-transform duration-300 ease-out hover:-translate-y-0.5"
                            >
                                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-purple-50 text-purple-500 mb-4">
                                    <IconComponent className="w-6 h-6 stroke-[1.75]" />
                                </div>
                                <h3 className="font-semibold text-sm text-neutral-800 mb-1">
                                    {feature.title}
                                </h3>
                                <p className="text-xs text-neutral-500 max-w-60 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesBanner;
