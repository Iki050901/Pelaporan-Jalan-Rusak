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

export default function StatisticReport() {

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});

    useEffect(() => {
        setTimeout(() => {
            fetchData();
        }, 2000);
    }, [])

    const fetchData = async () => {
        try {
            setError("")
            const response = await getDashboardReport();

            setData(response);
        } catch (e) {
          console.error("Failed to fetch data: ", e);
          setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    const stats = [
        { icon: faListAlt, value: data?.total_report, label: 'Jumlah Laporan' },
        { icon: faBars, value: data?.total_active_report, label: 'Verifikasi Kecamatan' },
        { icon: faList, value: data?.total_report_process, label: 'Diteruskan PUPR' },
        { icon: faCheckSquare, value: data?.total_report_done, label: 'Laporan Selesai' },
    ];

    return (
        <div className="relative isolate px-6 lg:px-8">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                 aria-hidden="true">
            </div>
            <div className="mx-auto max-w-2xl py-14 sm:py-28 lg:py-36">
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance text-gray-900"><span className="text-gray-500">Statistik</span><span className="text-blue-900">   Pelaporan Jalan</span></h1>
                </div>
                <div className="max-w-6xl mt-24 mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-24 text-center">
                    {stats.map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="bg-yellow-400 text-white p-5 rounded-md mb-2">
                                <FontAwesomeIcon icon={item.icon} className="text-4xl" />
                            </div>
                            <p className={`${loading ? "animate-pulse col-span-2 h-5 w-8 rounded bg-gray-300 text-transparent" : "text-2xl font-bold text-blue-900 "}`}>{item.value}</p>
                            <p className="text-gray-400 text-sm">{item.label}</p>
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