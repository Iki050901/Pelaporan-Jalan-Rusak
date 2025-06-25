"use client";

import { useEffect, useState } from "react";

export default function AlertMessage({ message, type = "error", duration = 5000, onClose }) {
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        // Trigger animasi masuk
        setTimeout(() => setVisible(true), 10);

        const timer = setTimeout(() => handleClose(), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, 300); // waktu animasi keluar
    };

    const baseClasses =
        "fixed right-0 top-25 transform -translate-x-1/2 z-50 px-4 py-3 rounded-md text-sm font-medium flex justify-between items-center shadow transition-all duration-300 ease-in-out";

    const typeStyles = {
        error: "bg-red-100 text-red-800 border border-red-400",
        success: "bg-green-100 text-green-800 border border-green-400",
        warning: "bg-yellow-100 text-yellow-800 border border-yellow-400",
        info: "bg-blue-100 text-blue-800 border border-blue-400",
    };

    const transitionClasses = closing
        ? "opacity-0 scale-90 -translate-y-5"
        : visible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 translate-y-5";

    return (
        <div className={`${baseClasses} ${typeStyles[type]} ${transitionClasses}`}>
            <span>{message}</span>
            <button
                className="ml-4 font-bold text-xl leading-none focus:outline-none"
                onClick={handleClose}
            >
                ×
            </button>
        </div>
    );
}