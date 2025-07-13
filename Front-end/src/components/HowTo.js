"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faListAlt,
    faBars,
    faList,
    faFileAlt,
    faCheckSquare
} from '@fortawesome/free-solid-svg-icons';
import {useEffect, useState} from "react";
import {getDashboardReport} from "@/services/report.service";
import Image from "next/image";

export default function HowTo() {

    const stats = [
        { icon: '/icons/write-report.png', value: "Buat<br/>Laporan", label: 'Laporkan keluhan kerusakan jalan dengan jelas dan lengkap' },
        { icon: '/icons/verif-district.png', value: "Verikasi Kecamatan", label: 'Diverifikasi kecamatan untuk memastikan kebenaran laporan dan lokasi.' },
        { icon: '/icons/verif-pupr.png', value: "Verikasi<br/>PUPR", label: 'Jika valid, laporan diperiksa PUPR untuk verifikasi akhir.' },
        { icon: '/icons/done.png', value: "Selesai", label: 'Laporan Anda telah diterima dan masuk dalam daftar tindak lanjut PUPR' },
    ];

    return (
        <div className="flex flex-col justify-center items-center w-auto">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                 aria-hidden="true">
            </div>
            <div className="flex flex-col justify-center items-center max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl text-center font-semibold tracking-tight text-balance text-gray-900">
                   <span className="text-blue-900"> Bagaimana Laporan Saya di Proses ?</span>
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full mt-24">
                    {stats.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-start text-center h-full px-4"
                        >
                            {/* ICON */}
                            <div className="bg-yellow-400 text-white p-5 rounded-md mb-4">
                                <Image
                                    src={item.icon}
                                    unoptimized
                                    width={40}
                                    height={40}
                                    className="w-[40px] h-auto"
                                    alt="Icon"
                                />
                            </div>

                            {/* TITLE */}
                            <h3 className="text-lg font-bold text-blue-900 mb-2 min-h-[48px] leading-snug prose" dangerouslySetInnerHTML={{ __html: item.value }} >
                            </h3>

                            {/* DESCRIPTION (biar sejajar pakai min-h) */}
                            <p className="text-gray-400 text-sm leading-relaxed min-h-[72px]">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                aria-hidden="true">
            </div>
        </div>
    )
}