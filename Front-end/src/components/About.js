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

export default function About() {

    return (
        <div className="flex flex-col justify-center items-center w-auto px-4 pt-26 lg:px-8 ">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                 aria-hidden="true">
            </div>
            <div className="flex flex-col justify-center items-center max-w-2xl mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl text-center font-semibold tracking-tight text-balance text-gray-900">
                    <span className="text-gray-500">Tentang </span><span className="text-blue-900"> Laporkan Jalan Rusak</span>
                </h1>
                <div className="mt-5 mb-5">
                    <Image
                        src="/images/logo.png"
                        unoptimized={true}
                        width={200}
                        height={200}
                        className="w-[200px] h-auto lg:w-[300px]"
                        alt="Banner Image"
                    />
                </div>
            </div>
            <div className="w-full text-left font-light max-w-7xl mx-auto">
                <p className="tracking-tight text-wrap text-gray-900 sm:text-xl">
                    Website Laporkan Jalan merupakan platform resmi yang dikelola oleh Dinas Pekerjaan Umum dan Penataan Ruang (PUPR) Kabupaten Garut. Website ini bertujuan untuk menampung laporan masyarakat terkait kerusakan jalan di wilayah Kabupaten Garut.
                </p>
                <p className="tracking-tight text-wrap text-gray-900 mt-2 sm:text-xl">
                    Melalui website ini, masyarakat dapat menyampaikan laporan kerusakan jalan dengan menyertakan informasi lokasi, deskripsi kerusakan, dan foto pendukung. Laporan yang masuk akan diverifikasi oleh pihak kecamatan, kemudian diteruskan ke Dinas PUPR Kabupaten Garut untuk pemeriksaan lebih lanjut.
                </p>
                <p className="tracking-tight text-wrap text-gray-900 mt-2 sm:text-xl">
                    Website ini juga dilengkapi dengan statistik laporan, peta sebaran jalan rusak, dan informasi alur proses laporan, sehingga masyarakat dapat mengetahui tahapan yang dilalui setiap laporan.
                </p>
                <p className="tracking-tight text-wrap text-gray-900 mt-2 sm:text-xl">
                    Dengan adanya website ini, diharapkan dapat meningkatkan peran serta masyarakat dalam menjaga kondisi jalan serta mendukung upaya pemerintah dalam perbaikan infrastruktur di Kabupaten Garut.
                </p>
                <p className="tracking-tight text-wrap font-bold text-gray-900 text-center mt-12 sm:text-2xl">
                    “Mari bersama-sama menjaga jalan di Kabupaten Garut<br/>dengan melaporkan setiap kerusakan yang ditemukan”
                </p>
            </div>
            <div
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                aria-hidden="true">
            </div>
        </div>
    )
}