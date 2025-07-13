"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {AuthService} from "@/services/auth.service";
import {useUser} from "@/context/UserContext";
import Image from "next/image";

export default function NavAdmin({ onMenuClick, active}) {

    const { userData, setUserData } = useUser();
    const role = userData?.data?.role.role

    const menuItems = [
        { label: "Dashboard", key: "dashboard", roles: ["USER", "KECAMATAN", "PUPR"] },
        { label: "Buat Laporan", key: "report/create", roles: ["USER"] },
        { label: role === "USER" ? "Riwayat Laporan" : "Validasi Laporan", key: "report", roles: ["USER", "KECAMATAN", "PUPR"] },
        { label: "Riwayat Validasi", key: "history", roles: ["KECAMATAN", "PUPR"] },
        { label: "Manajemen Users", key: "users", roles: ["PUPR"] },
    ];

    const [menuOpen, setMenuOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const router = useRouter();

    const handleProfileClick = () => {
        router.push('/profile/update');
    }

    const handleLogout = async () => {
        await AuthService.logout();
        setUserData(null);
        router.push('/login');
    }

    const handleClick = (key) => {
        if (onMenuClick) onMenuClick(key);
    };

    const renderMenu = (mobile = false) => {
        return menuItems
            .filter(item => item.roles.includes(role))
            .map(item => (
                <a
                    key={item.key}
                    href="#"
                    onClick={() => handleClick(item.key)}
                    className={`rounded-md px-3 py-2 text-sm font-medium ${mobile ? 'block text-base' : ''} ${
                        active === item.key
                            ? "bg-yellow-400 text-white"
                            : "text-gray-300 hover:bg-yellow-500 hover:text-white"
                    }`}
                    aria-current={active === item.key ? "page" : undefined}
                >
                    {item.label}
                </a>
            ));
    };

    return (
        <nav className="bg-blue-900 p-2">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <div className="shrink-0 bg-white rounded-md p-2">
                            <Image
                                src="/images/logo.png"
                                unoptimized
                                width={120}
                                height={80}
                                className="w-[120px] h-[40px] object-cover"
                                alt="Logo PUPR"
                            />
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {renderMenu()}
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
                                        <Image className="size-10 rounded-full"
                                               src={userData?.data?.avatar || "/images/default-avatar.png"}
                                               width={40}
                                               height={40}
                                               unoptimized="false"
                                               alt="Profile Image"/>
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
                                    <a href="#" onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"
                                       tabIndex="-1" id="user-menu-item-2">Sign out</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                            aria-controls="mobile-menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>

                            <svg
                                className={`${mobileMenuOpen ? 'hidden' : 'block'} size-6`}
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>

                            <svg
                                className={`${mobileMenuOpen ? 'block' : 'hidden'} size-6`}
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>


            {mobileMenuOpen && (
                <div
                    id="mobile-menu"
                    className={`transform transition-all duration-300 ease-in-out overflow-hidden ${
                        mobileMenuOpen ? 'max-h-screen opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95 pointer-events-none'
                    }`}
                >
                    <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                        {renderMenu(true)}
                    </div>
                    <div className="border-t border-gray-700 pt-4 pb-3">
                        <div className="flex items-center px-5">
                            <div className="shrink-0">
                                <Image
                                    className="size-10 rounded-full"
                                    src={userData?.data?.avatar || "/images/default-avatar.png"}
                                    width={40}
                                    height={40}
                                    alt="Profile Image"
                                />
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-white">{userData?.data?.name}</div>
                                <div className="text-sm font-medium text-gray-400">{userData?.data?.email}</div>
                            </div>
                        </div>
                        <div className="mt-3 space-y-1 px-2">
                            <a
                                href="#"
                                onClick={handleProfileClick}
                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                            >
                                Your Profile
                            </a>
                            <a
                                href="#"
                                onClick={handleLogout}
                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                            >
                                Sign out
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}