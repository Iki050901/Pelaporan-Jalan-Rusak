"use client";

import {useEffect, useState} from "react";
import L from "leaflet";
import dynamic from "next/dynamic";

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), {
    ssr: false,
});
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), {
    ssr: false,
});
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), {
    ssr: false,
});

export default function ReportDetail({initialData = null}) {

    const [lat, setLat] = useState(initialData?.lat || -7.227906);
    const [long, setLong] = useState(initialData?.long || 107.908699);

    const [data, setData] = useState({
        report_name: "",
        description: "",
        damage_level: "ringan",
        lat: -7.227906,
        long:  107.908699,
        location: "",
        images: [],
        video: null
    });

    useEffect(() => {
        if (initialData) {
            setData({
                report_name: initialData.report_name || "",
                description: initialData.description || "",
                damage_level: initialData.damage_level || "ringan",
                lat: -7.227906,
                long:  107.908699,
                location: initialData.location || "",
                images: [],
                video: null
            });

            if (initialData.lat && initialData.long) {
                setLat(initialData.lat);
                setLong(initialData.long);
            }
        }
    }, [initialData]);

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0">
                <h3 className="text-base/7 font-semibold text-gray-900">Informasi Laporan</h3>
                <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium mt-2 bg-green-100 text-green-800 ">Selesai</span>
            </div>
            <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Nama pelapor</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">Margot Foster</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Nama Laporan</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">Kerusakan Jalan</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">No. HP Pelapor</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">margotfoster@example.com</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Foto</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0"> </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Video</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Lokasi</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                            Jln. Merdeka, Jakarta Timur, Indonesia
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Kordinat</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <p className="block"> Lat: {lat}</p>
                            <p className="block py-2">Long: {long} </p>
                            {isClient && (
                                <MapContainer
                                    center={[lat, long]}
                                    zoom={13}
                                    scrollWheelZoom={true}
                                    style={{ height: "500px", width: "100%" }}
                                    className="rounded border"
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker
                                        position={[lat, long]}
                                        icon={L.icon({
                                            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
                                        })}
                                    />
                                </MapContainer>
                            )}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    )
}