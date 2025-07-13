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

export default function PuprAbout() {

    return (
        <>
            <div className="relative w-full bg-gray-100 px-4 py-16 sm:px-6 lg:px-8">
                {/* Background Blur */}
                <div
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    aria-hidden="true"
                ></div>

                {/* Content Container */}
                <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-10">

                    {/* Text Section */}
                    <div className="w-full lg:w-1/2 text-left text-black">

                        <p className="text-base sm:text-lg md:text-xl mb-6 max-w-xl">
                            Dinas Pekerjaan Umum dan Penataan Ruang (PUPR) Kabupaten Garut adalah instansi pemerintah daerah yang bertanggung jawab dalam pembangunan, pemeliharaan, serta perbaikan infrastruktur publik, termasuk jalan, jembatan, drainase, dan tata ruang wilayah.
                        </p>

                        <p className="text-base sm:text-lg md:text-xl max-w-xl">
                            PUPR Kabupaten Garut berkomitmen untuk mendukung terciptanya infrastruktur yang aman, layak, dan nyaman digunakan masyarakat, serta mendorong pembangunan daerah yang berkelanjutan.
                            <br /><br />
                            Untuk informasi lebih lanjut mengenai PUPR Kabupaten Garut, silakan kunjungi: <br />
                            📷 Instagram: <span className="font-semibold">@puprgarutkab.official</span><br />
                            🌐 Website: <a href="https://pupr.garutkab.go.id/" className="underline text-yellow-300" target="_blank">pupr.garutkab.go.id</a>
                        </p>
                    </div>

                    {/* Image Section */}
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <Image
                            src="/images/logo_pupr.png"
                            alt="Banner PUPR"
                            width={300}
                            height={300}
                            className="w-64 sm:w-72 md:w-80 lg:w-[400px] h-auto"
                            unoptimized
                        />
                    </div>
                </div>

                {/* Bottom Blur Decoration */}
                <div
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                    aria-hidden="true"
                ></div>
            </div>
        </>
    )
}