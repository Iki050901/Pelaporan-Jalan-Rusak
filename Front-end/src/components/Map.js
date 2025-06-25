"use client";

import { MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import greenIconUrl from 'leaflet-color-markers/img/marker-icon-2x-green.png';
import yellowIconUrl from 'leaflet-color-markers/img/marker-icon-2x-yellow.png';
import redIconUrl from 'leaflet-color-markers/img/marker-icon-2x-red.png';
import shadowIconUrl from 'leaflet-color-markers/img/marker-shadow.png';
import {useEffect, useState} from "react";
import {getDashboardReport, getDashboardReportByDamageLevel} from "@/services/report.service";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

export default function Map() {
    const garutCoords = [-7.227906, 107.908699];

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [dataMap, setDataMap] = useState({});

    useEffect(() => {
        setTimeout(() => {
            fetchDataMap();
        }, 2000);
    }, [])

    const fetchDataMap = async () => {
        try {
            setError("")
            const response = await getDashboardReportByDamageLevel();

            setDataMap(response);
            console.log(response);
        } catch (e) {
            console.error("Failed to fetch data: ", e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    const markerIcons = {
        ringan: new L.Icon({
            iconUrl: '/icons/marker-icon-2x-green.png',
            shadowUrl: '/icons/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
        }),
        sedang: new L.Icon({
            iconUrl: '/icons/marker-icon-2x-yellow.png',
            shadowUrl: '/icons/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
        }),
        berat: new L.Icon({
            iconUrl: '/icons/marker-icon-2x-red.png',
            shadowUrl: '/icons/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
        }),
    };

    const stats = [
        {
            label: "Ringan",
            marker: markerIcons.ringan,
            color: "bg-green-500",
            data: dataMap.report_by_damage_level_1 || [],
        },
        {
            label: "Sedang",
            marker: markerIcons.sedang,
            color: "bg-yellow-500",
            data: dataMap.report_by_damage_level_2 || [],
        },
        {
            label: "Berat",
            marker: markerIcons.berat,
            color: "bg-red-500",
            data: dataMap.report_by_damage_level_3 || [],
        },
    ];

    return (
        <div className="flex flex-col lg:flex-col gap-6 p-6">
            {/* MAP */}
            <div className="w-full lg:w-full bg-white rounded-lg shadow p-8">
                <MapContainer
                    center={garutCoords}
                    zoom={12}
                    scrollWheelZoom={false}
                    className="h-100 w-full rounded-md z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {stats.map(({ label, marker, data }) =>
                        data.map((item, idx) => (
                            <Marker
                                key={`${label}-${idx}`}
                                position={[parseFloat(item.lat), parseFloat(item.long)]}
                                icon={marker}
                            >
                                <Popup>
                                    <p className="text-sm font-semibold">Tingkat Kerusakan: {label}</p>
                                    <p className="text-xs">{item.location}</p>
                                </Popup>
                            </Marker>
                        ))
                    )}
                </MapContainer>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-full lg:w-full bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-gray-700 ">Deskripsi</h2>
                </div>

                {stats.map(({ label, color, data }, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${color}`}></div>
                            <span className="text-sm text-gray-700">{label}</span>
                        </div>
                        <span className="text-blue-900 font-semibold">{data.length}</span>
                    </div>
                ))}

            </div>
        </div>
    );
}