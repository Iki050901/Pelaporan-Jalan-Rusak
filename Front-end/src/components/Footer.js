"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPhone,
    faGlobe, faUser
} from '@fortawesome/free-solid-svg-icons';
import {
    faWhatsapp,
    faInstagram
} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-blue-900 text-white">
            <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between gap-8">
                {/* Kolom Kiri */}
                <div className="flex flex-col">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center">
                        <Image
                            src="/images/logo-pupr2.png"
                            unoptimized
                            width={100}
                            height={100}
                            className="w-[100px] h-auto"
                            alt="Logo PUPR With Text"
                        />
                        <h1 className="font-bold text-white text-wrap mt-2 sm:mt-0 sm:ml-3 text-sm sm:text-base">
                            DINAS PEKERJAAN UMUM<br />
                            DAN PENATAAN RUANG<br />
                            KABUPATEN GARUT
                        </h1>
                    </div>
                    <p className="text-sm py-4 leading-relaxed">
                        Jl. Raya Samarang No.117, Sukagalih, Kecamatan Tarogong<br />
                        Kabupaten Garut, Jawa Barat 44151
                    </p>
                    <p className="text-sm mt-auto">
                        © 2025 LAPORKAN JALAN RUSAK!
                    </p>
                </div>

                {/* Kolom Kanan */}
                <div className="flex flex-col">
                    <Image
                        src="/images/logo.png"
                        unoptimized
                        width={120}
                        height={80}
                        className="w-[120px] h-[80px] bg-white object-contain"
                        alt="Logo PUPR"
                    />
                    <h3 className="font-bold pt-4 text-sm sm:text-base">Kontak Kami :</h3>
                    <p className="text-sm mt-1">
                        <FontAwesomeIcon icon={faPhone} /> <span className="ml-2">(0262) 233730</span>
                    </p>

                    <h3 className="font-bold pt-4 text-sm sm:text-base">Ikuti PUPR di Media Sosial :</h3>
                    <div className="py-2">
                        <p className="text-sm mb-2">
                            <FontAwesomeIcon icon={faInstagram} size="lg" /> <span className="ml-2">@puprgarutkab.official</span>
                        </p>
                        <p className="text-sm">
                            <FontAwesomeIcon icon={faGlobe} size="lg" /> <span className="ml-2">pupr.garutkab.go.id</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}