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
import {useRouter} from "next/navigation";

export default function Hero() {

    const router = useRouter();

    const handleLapor = () => {
        router.push("/login");
    }

    return (
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center w-full px-4 pt-16 lg:px-8 gap-12">
            {/* Background blur atas */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true"></div>
            {/* Kiri: Text & Button */}
            <div className="flex flex-col w-full lg:w-1/2">
                <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-balance text-gray-900">
                    <span className="text-gray-500">Selamat Datang </span>
                    <span className="text-blue-900">Di Website Laporkan Jalan Rusak</span>
                </h1>

                <div className="text-left mt-6">
                    <p className="text-base lg:text-2xl text-gray-900 leading-relaxed">
                        Website ini hadir sebagai sarana resmi untuk mengakomodasi
                        masyarakat Kabupaten Garut dalam melaporkan kondisi jalan yang rusak.
                        Dengan partisipasi aktif masyarakat, kita dapat bersama-sama menjaga kualitas infrastruktur
                        jalan demi keselamatan dan kenyamanan bersama.
                    </p>

                    <button
                        type="button"
                        onClick={handleLapor}
                        className="mt-8 w-fit bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-md font-semibold"
                    >
                        LAPORKAN SEKARANG!
                    </button>
                </div>
            </div>

            {/* Kanan: Gambar */}
            <div className="w-full lg:w-1/2 flex justify-center">
                <Image
                    src="/images/banner.png"
                    unoptimized={true}
                    width={600}
                    height={500}
                    className="max-w-full h-auto"
                    alt="Banner Image"
                />
            </div>

            {/* Background blur bawah */}
            <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true"></div>
        </div>
    )
}