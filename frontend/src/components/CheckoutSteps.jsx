import { Check, Truck, ClipboardCheck, CreditCard } from "lucide-react";

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
    const steps = [
        { label: "Shipping Details", active: shipping, icon: Truck },
        { label: "Confirm Order", active: confirmOrder, icon: ClipboardCheck },
        { label: "Payment", active: payment, icon: CreditCard }
    ];

    return (
        <div className="w-full max-w-2xl mx-auto mb-10 px-4">
            <div className="flex items-center justify-between relative">
                {steps.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center relative z-10">
                            {/* Circle Indicator */}
                            <div
                                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm ${step.active
                                    ? "bg-purple-600 text-white shadow-purple-200 shadow-md ring-4 ring-purple-100"
                                    : "bg-white text-slate-400 border border-slate-200"
                                    }`}
                            >
                                {step.active ? <Icon size={19} /> : <Icon size={19} />}
                            </div>

                            {/* Label */}
                            <span
                                className={`mt-2.5 text-xs font-semibold tracking-tight transition-colors ${step.active ? "text-purple-600 font-bold" : "text-slate-400"
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}

                {/* Progress Line */}
                <div className="absolute top-5.5 left-1/6 right-1/6 h-0.5 bg-slate-200 z-0">
                    <div
                        className="h-full bg-purple-600 transition-all duration-500"
                        style={{
                            width: payment ? "100%" : confirmOrder ? "50%" : "0%"
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CheckoutSteps;