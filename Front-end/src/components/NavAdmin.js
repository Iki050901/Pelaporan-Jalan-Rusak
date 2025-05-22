"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";

export default function NavAdmin({ onMenuClick, active }) {

    const [menuOpen, setMenuOpen] = useState(false)
    
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const router = useRouter();

    const handleProfileClick = () => {
        router.push('/profile/update');
    }

    return (
        <nav className="bg-blue-900 p-2">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <div className="shrink-0">
                            <h1 className="text-white">LAPOR!</h1>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <a href="#"
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${
                                        active === "dashboard"
                                            ? "bg-yellow-400 text-white"
                                            : "text-gray-300 hover:bg-yellow-500 hover:text-white"
                                    }`}
                                    aria-current={active === "dashboard" ? "page" : undefined}
                                    onClick={() => onMenuClick("dashboard")}>Dashboard</a>
                                <a href="#"
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${
                                        active === "report"
                                            ? "bg-yellow-400 text-white"
                                            : "text-gray-300 hover:bg-yellow-500 hover:text-white"
                                    }`}
                                    aria-current={active === "report" ? "page" : undefined}
                                    onClick={() => onMenuClick("report")}>Laporan</a>
                                <a href="#"
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${
                                        active === "history"
                                            ? "bg-yellow-400 text-white"
                                            : "text-gray-300 hover:bg-yellow-500 hover:text-white"
                                    }`}
                                    aria-current={active === "history" ? "page" : undefined}
                                    onClick={() => onMenuClick("history")}>Riwayat Laporan</a>
                                <a href="#"
                                   className={`rounded-md px-3 py-2 text-sm font-medium ${
                                       active === "users"
                                           ? "bg-yellow-400 text-white"
                                           : "text-gray-300 hover:bg-yellow-500 hover:text-white"
                                   }`}
                                   aria-current={active === "users" ? "page" : undefined}
                                   onClick={() => onMenuClick("users")}>Manajemen Users</a>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <div className="relative ml-3">
                                <div>
                                    <button type="button"
                                            onClick={toggleMenu}
                                            className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                                            id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                        <span className="absolute -inset-1.5"></span>
                                        <span className="sr-only">Open user menu</span>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img className="size-8 rounded-full"
                                             src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                             alt=""/>
                                    </button>
                                </div>

                                <div
                                    className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition-all duration-200 ${
                                        menuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                                    }`}
                                    role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button"
                                    tabIndex="-1">
                                    <a href="#" onClick={handleProfileClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"
                                       tabIndex="-1" id="user-menu-item-0">Your Profile</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"
                                       tabIndex="-1" id="user-menu-item-2">Sign out</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">

                        <button type="button"
                                className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                                aria-controls="mobile-menu" aria-expanded="false">
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Open main menu</span>

                            <svg className="block size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                 stroke="currentColor" aria-hidden="true" data-slot="icon">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                            </svg>

                            <svg className="hidden size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                 stroke="currentColor" aria-hidden="true" data-slot="icon">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>


            <div className="md:hidden" id="mobile-menu">
                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                    <a href="#"
                       className={`block rounded-md px-3 py-2 text-base font-medium  ${
                           active === "Dashboard"
                               ? "bg-yellow-400 text-white"
                               : "text-gray-300 hover:bg-yellow-500 hover:text-white"
                       }`}
                       aria-current={active === "Dashboard" ? "page" : undefined}
                       onClick={() => onMenuClick("Dashboard")}>Dashboard</a>
                    <a href="#"
                       className={`block rounded-md px-3 py-2 text-base font-medium  ${
                           active === "Report"
                               ? "bg-yellow-400 text-white"
                               : "text-gray-300 hover:bg-yellow-500 hover:text-white"
                       }`}
                       aria-current={active === "Report" ? "page" : undefined}
                       onClick={() => onMenuClick("Report")}>Laporan</a>
                    <a href="#"
                       className={`block rounded-md px-3 py-2 text-base font-medium  ${
                           active === "History"
                               ? "bg-yellow-400 text-white"
                               : "text-gray-300 hover:bg-yellow-500 hover:text-white"
                       }`}
                       aria-current={active === "History" ? "page" : undefined}
                       onClick={() => onMenuClick("History")}>Riwayat Laporan</a>
                </div>
                <div className="border-t border-gray-700 pt-4 pb-3">
                    <div className="flex items-center px-5">
                        <div className="shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img className="size-10 rounded-full"
                                 src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                 alt=""/>
                        </div>
                        <div className="ml-3">
                            <div className="text-base/5 font-medium text-white">Acull</div>
                            <div className="text-sm font-medium text-gray-400">acull@example.com</div>
                        </div>
                    </div>
                    <div className="mt-3 space-y-1 px-2">
                        <a href="#" onClick={handleProfileClick}
                           className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">Your
                            Profile</a>
                        <a href="#"
                           className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">Sign
                            out</a>
                    </div>
                </div>
            </div>
        </nav>
    )
}