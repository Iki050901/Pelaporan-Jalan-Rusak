'use client'

import { useRouter } from 'next/navigation';
import {useState, useEffect} from "react";
import Image from "next/image";

export default function Banner({ login }) {

    const router = useRouter();

    const [menuOpen, setMenuOpen] = useState(false);

    const handleLoginClick = () => {
        router.push('/login');
    }

    const handleHowTo = (e) => {
        e.preventDefault()
        router.push("/howto");
    }

    const handleAbout = (e) => {
        e.preventDefault()
        router.push("/about");
    }

    const [isLogin, setIsLogin] = useState(login);

    return (
        <nav className="bg-blue-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-4">
                <a href="/" className="bg-white rounded-md p-2">
                    <Image
                        src="/images/logo.png"
                        unoptimized
                        width={120}
                        height={80}
                        className="w-[120px] h-[40px] object-cover"
                        alt="Logo PUPR"
                    />
                </a>

                {/* Hamburger Button */}
                {!login && (
                    <div>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            type="button"
                            className="inline-flex items-center p-2 w-10 h-10 text-sm text-gray-300 rounded-lg md:hidden hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            aria-controls="navbar"
                            aria-expanded={menuOpen}
                        >
                            <span className="sr-only">Open menu</span>
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {menuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-4">
                            <a
                                href="#"
                                onClick={handleHowTo}
                                className="rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-yellow-500 hover:text-white"
                            >
                                Cara Melapor
                            </a>
                            <a
                                href="#"
                                onClick={handleAbout}
                                className="rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-yellow-500 hover:text-white"
                            >
                                Tentang
                            </a>
                            <button
                                onClick={handleLoginClick}
                                className="text-white bg-yellow-400 hover:bg-yellow-600 font-bold rounded-md px-6 py-2 text-sm"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-blue-800 px-4 pb-4 space-y-3 transition-all duration-300 ease-in-out">
                    <a
                        href="#"
                        onClick={handleHowTo}
                        className="block text-white text-sm py-2 hover:text-yellow-400"
                    >
                        Cara Melapor
                    </a>
                    <a
                        href="#"
                        onClick={handleAbout}
                        className="block text-white text-sm py-2 hover:text-yellow-400"
                    >
                        Tentang
                    </a>
                    <button
                        onClick={handleLoginClick}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-md"
                    >
                        Login
                    </button>
                </div>
            )}
        </nav>
    )
}
