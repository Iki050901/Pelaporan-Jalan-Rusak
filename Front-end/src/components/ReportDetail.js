"use client";

import {useEffect, useState} from "react";
import L from "leaflet";
import dynamic from "next/dynamic";
import {getReport} from "@/services/report.service";
import {AlertInfo} from "@/components/AlertInfo";
import DOMPurify from "dompurify";
import Image from "next/image";
import {getStatusClass} from "@/utils/status.utils";

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), {
    ssr: false,
});
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), {
    ssr: false,
});
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), {
    ssr: false,
});

export default function ReportDetail({ reportId }) {
    
    const [report, setReport] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const [zoomSrc, setZoomSrc] = useState("");

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    useEffect(() => {
        fetchReport();
    }, [reportId]);
    
    const fetchReport = async () => {
        try {
            setError(null);
            setLoading(true);
            const response = await getReport(reportId);

            setReport(response);
        } catch (e) {
            setError(e.errors || 'Failed to fetch report');
        } finally {
            setLoading(false);
        }
    }

    if (error && !report) {
        return (
            <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                <AlertInfo
                    title="Terjadi Kesalahan"
                    message={error}
                    error={true}
                />
            </div>
        );
    }

    if (!loading && !report) {
        return (
            <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                <AlertInfo
                    title="404"
                    message="Data tidak ditemukan"
                />
            </div>
        );
    }

    if (loading) {
        return <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800 mx-auto"></div>;
    }

    const safeHtml = DOMPurify.sanitize(report.desc)

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0">
                <h3 className="text-base/7 font-semibold text-gray-900">Informasi Laporan</h3>
                <span className={`inline-flex rounded-md px-2 py-1 text-xs items-center font-medium mt-2 ring-1 ${getStatusClass(report.validation_status.id)} ring-inset`}>{report.validation_status.status}</span>
            </div>
            <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Catata Penolakan</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{report.notes}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Nama pelapor</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{report.user.name}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Nama Laporan</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{report.title}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Tanggal Laporan</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{report.created_at}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">No. HP Pelapor</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{report.user.number_phone}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Foto</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {report.ReportImages.map((image) => (
                                <Image
                                    key={image.id}
                                    src={image.image_url}
                                    onClick={() => setZoomSrc(image.image_url)}
                                    alt="foto laporan"
                                    width={100}
                                    height={100}
                                    className="w-42 h-42 rounded shadow border border-black object-contain"
                                    unoptimized
                                />
                            ))}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Video</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <video controls className="w-42 h-42 rounded shadow border">
                                <source src={report.video_url} type="video/mp4"/>
                                Video tidak dapat diputar.
                            </video>
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Tingkat Kerusakan</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 capitalize">
                            {report.damage_level.level}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Lokasi</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {report.location}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Kecamatan</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {report.district ?? ""}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm/6 font-medium text-gray-900">Kordinat</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <p className="block"> Lat: {report.lat}</p>
                            <p className="block py-2">Long: {report.long} </p>
                            {isClient && (
                                <MapContainer
                                    center={[parseFloat(report.lat), parseFloat(report.long)]}
                                    zoom={13}
                                    scrollWheelZoom={true}
                                    style={{ height: "500px", width: "100%" }}
                                    className="rounded border"
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker
                                        position={[parseFloat(report.lat), parseFloat(report.long)]}
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
            {zoomSrc !== "" && (
                <div
                    className="fixed inset-0 z-50 bg-black flex items-center justify-center"
                    onClick={() => setZoomSrc("")}>
                    <Image
                        src={zoomSrc}
                        alt="foto laporan"
                        width={100}
                        height={100}
                        className="w-auto h-auto rounded  shadow border border-black object-contain"
                        unoptimized
                    />
                </div>
            )}
        </div>
    )
}