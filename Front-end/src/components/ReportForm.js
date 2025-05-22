"use client";

import {useEffect, useState} from "react";
import L from "leaflet";
import dynamic from "next/dynamic";
import { useMapEvents } from 'react-leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), {
    ssr: false,
});
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), {
    ssr: false,
});
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), {
    ssr: false,
});

function LocationPicker({setLat, setLong}) {
    useMapEvents({
        click(e) {
            setLat(e.latlng.lat);
            setLong(e.latlng.lng);
        },
    });
    return null;
}

export default function ReportForm({ initialData = null, onSubmit }) {

    const [lat, setLat] = useState(initialData?.lat || -7.227906);
    const [long, setLong] = useState(initialData?.long || 107.908699);
    const [form, setForm] = useState({
        report_name: "",
        description: "",
        damage_level: "ringan",
        lat: -7.227906,
        long:  107.908699,
        location: "",
        images: [],
        video: null
    });
    const [imagePreviews, setImagePreviews] = useState([]);
    const [videoPreview, setVideoPreview] = useState(null);

    useEffect(() => {
        if (initialData) {
            setForm({
                report_name: initialData.report_name || "",
                description: initialData.description || "",
                damage_level: initialData.damage_level || "ringan",
                lat: -7.227906,
                long:  107.908699,
                location: initialData.location || "",
                images: [],
                video: null
            });

            if (initialData.imageUrls && initialData.imageUrls.length > 0) {
                setImagePreviews(initialData.imageUrls);
            }

            if (initialData.videoUrl) {
                setVideoPreview(initialData.videoUrl);
            }

            if (initialData.lat && initialData.long) {
                setLat(initialData.lat);
                setLong(initialData.long);
            }
        }
    }, [initialData]);

    useEffect(() => {
        if (lat && long) {
            setForm(prev => ({ ...prev, lat: lat }));
            setForm(prev => ({ ...prev, long: long }));
        }
    }, [lat, long]);

    useEffect(() => {
        if (!lat && !long) return;

        const fetchLocationName = async () => {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`);
                const data = await res.json();
                const displayName = data.display_name || "";
                setForm(prev => ({ ...prev, location: displayName }));
            } catch (err) {
                console.error("Gagal mengambil nama lokasi:", err);
            }
        };

        fetchLocationName();
    }, [lat, long]);

    const handleChange = (e) => {
        const { name, files } = e.target;

        if (name === "images") {
            const selectedImages = Array.from(files);

            if (selectedImages.length > 5) {
                alert("You can only upload up to 5 images.");
                return;
            }

            const previews = selectedImages.map((file) => URL.createObjectURL(file));

            setForm((prev) => ({ ...prev, images: selectedImages }));
            setImagePreviews(previews);

        } else if (name === "video") {
            const videoFile = files[0];

            if (videoFile) {
                const preview = URL.createObjectURL(videoFile);
                setForm((prev) => ({ ...prev, video: videoFile }));
                setVideoPreview(preview);
            }
        } else if (name === "damage_level") {
            setForm(prev => ({ ...prev, damage_level: value }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setLat(pos.coords.latitude);
            setLong(pos.coords.longitude);
        }, (err) => {
            alert("Gagal mendapatkan lokasi otomatis.");
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="sm:col-span-4">
                    <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">Nama
                        Laporan</label>
                    <div className="mt-2">
                        <div
                            className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-800">
                            <input type="text" name="report_name" id="report_name" value={form.report_name} onChange={(e) => setForm(prev => ({ ...prev, report_name: e.target.value }))}
                                   className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"/>
                        </div>
                    </div>
                </div>
                <div className="col-span-full mt-10">
                    <label htmlFor="images" className="block text-sm/6 font-medium text-gray-900">Photo</label>
                    <div
                        className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                            <svg className="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor"
                                 aria-hidden="true" data-slot="icon">
                                <path fillRule="evenodd"
                                      d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                                      clipRule="evenodd"/>
                            </svg>
                            <div className="mt-4 flex items-center justify-center  text-sm/6 text-gray-600">
                                <label htmlFor="images"
                                       className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-blue-800">
                                    <span>Upload an image</span>
                                    <input id="images" type="file" className="sr-only" accept="image/*"
                                           multiple={true} name="images" onChange={handleChange}/>
                                </label>
                            </div>
                            <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB (Max 5)</p>
                        </div>
                    </div>
                </div>
                {imagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreviews.map((src, idx) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                key={idx}
                                src={src}
                                alt={`Preview ${idx}`}
                                className="h-32 w-full object-cover rounded border border-blue-800"
                            />
                        ))}
                    </div>
                )}
                <div className="col-span-full mt-10">
                    <label htmlFor="video" className="block text-sm/6 font-medium text-gray-900">Video</label>
                    <div
                        className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                            <svg className="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor"
                                 aria-hidden="true" data-slot="icon">
                                <path fillRule="evenodd"
                                      d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                                      clipRule="evenodd"/>
                            </svg>
                            <div className="mt-4 flex text-sm/6 items-center justify-center text-gray-600">
                                <label htmlFor="video"
                                       className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-blue-500">
                                    <span>Upload a video</span>
                                    <input id="video" type="file" className="sr-only" accept="video/*"
                                           name="video" onChange={handleChange}/>
                                </label>
                            </div>
                            <p className="text-xs/5 text-gray-600">mp4 up to 10MB</p>
                        </div>
                    </div>
                </div>
                {videoPreview && (
                    <div className="mt-4">
                        <video
                            src={videoPreview}
                            controls
                            className="w-full max-w-md rounded border"
                        />
                    </div>
                )}
                <div className="col-span-full mt-10">
                    <label htmlFor="about" className="block text-sm/6 font-medium text-gray-900">Deskripsi
                        Kerusakan</label>
                    <div className="mt-2">
                            <textarea name="description" id="description" rows="3" value={form.description}
                                      onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} required
                                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"></textarea>
                    </div>
                </div>
                <fieldset className="col-span-full mt-10">
                    <legend className="text-sm/6 font-semibold text-gray-900">Tingkat Kerusakan</legend>
                    <div className="mt-2 space-y-6">
                        <div className="flex items-center gap-x-3">
                            <input id="ringan" name="damage_level" type="radio" checked={form.damage_level === "ringan"}
                                   onChange={(e) => setForm(prev => ({ ...prev, damage_level: e.target.value }))}
                                   className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-blue-800 checked:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"/>
                            <label htmlFor="ringan"
                                   className="block text-sm/6 font-medium text-gray-900">Ringan</label>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <input id="sedang" name="damage_level" type="radio" onChange={(e) => setForm(prev => ({ ...prev, damage_level: e.target.value }))}
                                   className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-blue-800 checked:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"/>
                            <label htmlFor="sedang" className="block text-sm/6 font-medium text-gray-900">Sedang</label>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <input id="berat" name="damage_level" type="radio" onChange={(e) => setForm(prev => ({ ...prev, damage_level: e.target.value }))}
                                   className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"/>
                            <label htmlFor="berat" className="block text-sm/6 font-medium text-gray-900">Berat</label>
                        </div>
                    </div>
                </fieldset>
                <div className="col-span-full mt-10">
                    <label className="text-sm/6 font-medium text-gray-900">Lokasi (via GPS/manual)</label>
                    <button type="button" onClick={getCurrentLocation}
                            className="rounded-md bg-blue-800 px-4 py-2 mx-2 my-2 text-sm text-white shadow-sm hover:bg-blue-900">
                        Gunakan Lokasi Otomatis
                    </button>
                    <MapContainer
                        center={[lat, long] || [-7.227906, 107.908699]}
                        zoom={13}
                        scrollWheelZoom={true}
                        style={{height: "500px", width: "100%"}}
                        className="rounded border"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationPicker setLat={setLat} setLong={setLong} />
                        {lat && long && <Marker position={[lat, long]}
                                           icon={L.icon({iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"})}/>}
                    </MapContainer>
                    <div className="mt-6 flex items-center justify-start gap-x-6">
                        <div className="sm:col-span-4">
                            <label htmlFor="lat" className="block text-sm/6 font-medium text-gray-900">Lat</label>
                            <div className="mt-2">
                                <div
                                    className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-800">
                                    <input type="text" name="lat" id="lat"
                                           onChange={handleChange}
                                           value={form.lat ? `${lat.toFixed(5)}` : "Belum dipilih"} readOnly={true}
                                           className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"/>
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-4">
                            <label htmlFor="long" className="block text-sm/6 font-medium text-gray-900">Long</label>
                            <div className="mt-2">
                                <div
                                    className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-800">
                                    <input type="text" name="long" id="long"
                                           onChange={handleChange}
                                           value={form.long ? `${long.toFixed(5)}` : "Belum dipilih"} readOnly={true}
                                           className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"/>
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-4 w-4xl">
                            <label htmlFor="location" className="block text-sm/6 font-medium text-gray-900">Lokasi</label>
                            <div className="mt-2">
                                <div
                                    className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-800">
                                    <input type="text" name="location" id="location"
                                           value={form.location ? form.location : "Belum dipilih" }
                                           onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))} readOnly={true}
                                           className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="submit"
                            className="rounded-md bg-blue-800 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Submit
                    </button>
                </div>
            </div>
        </form>
    );
}