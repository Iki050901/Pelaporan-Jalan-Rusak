'use client';

import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisV} from "@fortawesome/free-solid-svg-icons";

export default function CommentDropDown ({ onDelete, commentId }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [])

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <div>
                <button
                    onClick={() => setOpen(!open)}
                    className="inline-flex justify-center w-full rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none"
                >
                    <FontAwesomeIcon icon={faEllipsisV} size="sm" />
                </button>
            </div>

            {/* Dropdown with transition */}
            <div
                className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out
        ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            >
                <div className="py-1">
                    <a
                        onClick={(e) => onDelete(e, commentId)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white"
                    >
                        Delete
                    </a>
                </div>
            </div>
        </div>
    );
}