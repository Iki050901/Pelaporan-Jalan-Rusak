"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faListAlt,
    faBars,
    faList,
    faFileAlt,
    faCheckSquare
} from '@fortawesome/free-solid-svg-icons';

const stats = [
    { icon: faListAlt, value: 1564, label: 'Jumlah Laporan' },
    { icon: faBars, value: 129, label: 'Baru' },
    { icon: faList, value: 106, label: 'Proses Verifikasi' },
    { icon: faFileAlt, value: 81, label: 'Terverifikasi' },
    { icon: faCheckSquare, value: 1248, label: 'Penanganan Selesai' },
];

export default function Jumbotron() {
    return (
        <div className="relative isolate px-6 pt-14 lg:px-8">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                 aria-hidden="true">
            </div>
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                <div className="text-center">
                    <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl"><span className="text-gray-500">Statistik</span><span className="text-blue-900">   Pelaporan Jalan</span></h1>
                </div>
                <div className="max-w-6xl mt-24 mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-24 text-center">
                    {stats.map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="bg-yellow-400 text-white p-5 rounded-md mb-2">
                                <FontAwesomeIcon icon={item.icon} className="text-4xl" />
                            </div>
                            <p className="text-2xl font-bold text-blue-900">{item.value}</p>
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