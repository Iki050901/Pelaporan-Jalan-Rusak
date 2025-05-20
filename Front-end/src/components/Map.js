"use client";

import { MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

    const stats = [
        ["", "Laporan Masuk", 1564],
        ["", "Baru", 129],
        ["", "Proses Verifikasi", 106],
        ["", "Terverifikasi", 81],
        ["", "Penanganan Selesai", 1248],
    ]

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
                </MapContainer>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-full lg:w-full bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-gray-700 ">Ringkasan Laporan Tahun 2025</h2>
                </div>

                {stats.map(([icon, label, count], idx) => (
                    <div key={idx} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" />
                            <span className="text-xl">{icon}</span>
                            <span className="text-sm text-gray-700">{label}</span>
                        </div>
                        <span className="text-blue-900 font-semibold">{count}</span>
                    </div>
                ))}

            </div>
        </div>
    );
}