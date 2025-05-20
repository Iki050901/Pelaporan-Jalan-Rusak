import {useEffect, useState} from "react";

export default function Modal({ isOpen, onClose, children }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setShow(true), 10); // slight delay to trigger transition
        } else {
            setShow(false);
        }
    }, [isOpen]);

    if (!isOpen && !show) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
            <div
                className={`bg-white w-full max-w-md p-6 rounded-lg shadow-lg transform transition-all duration-300 ${
                    show ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-4'
                }`}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
}