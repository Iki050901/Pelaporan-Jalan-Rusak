"use client";

import {useEffect, useRef, useState} from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import { useMapEvents } from 'react-leaflet';
import {createReportValidation, updateReportValidation} from "@/validation/report.validation";
import {displayErrorForm, validate, validateField, validateForm} from "@/validation/validation";
import {createReport, getReport, updateReport} from "@/services/report.service";
import {router} from "next/client";
import {AlertInfo} from "@/components/AlertInfo";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {useRouter} from "next/navigation";
import Image from "next/image";
import AlertPopUp from "@/components/AlertPopUp";

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => {
    return {
        default: function Map({center, children}) {
            const { MapContainer } = mod;
            return (
                <MapContainer
                    center={center || [-7.227906, 107.908699]}
                    zoom={13}
                    scrollWheelZoom={true}
                    style={{height: "500px", width: "100%"}}
                    className="rounded border">
                    {children}
                </MapContainer>
            )
        }
    }
}), {
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

const DEFAULT_COORDINATES = {
    latitude: -7.227906,
    longitude: 107.908699
};

export default function ReportFormEdit({ reportId }) {

    const router = useRouter();
    const videoInputRef = useRef(null);

    const [report, setReport] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lat, setLat] = useState(DEFAULT_COORDINATES.latitude);
    const [long, setLong] = useState(DEFAULT_COORDINATES.longitude);
    const [form, setForm] = useState({
        title: "",
        desc: "",
        damage_level_id: "ringan",
        lat: DEFAULT_COORDINATES.latitude,
        long: DEFAULT_COORDINATES.longitude,
        location: "",
        images: [],
        video: null,
        image_to_keep: []
    });
    const [district, setDistrict] = useState("");
    const [imagePreviews, setImagePreviews] = useState([{}]);
    const [videoPreview, setVideoPreview] = useState("");
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [zoomSrc, setZoomSrc] = useState("");

    const [success, setSuccess] = useState("");

    const editorConfiguration = {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo'],
        placeholder: 'Masukkan deskripsi kerusakan...',
    };

    useEffect(() => {
        if (reportId) {
            fetchReport();
        }
    }, [reportId])

    useEffect(() => {
        if (report) {
            setForm({
                title: report.title || "",
                desc: report.desc || "",
                damage_level_id: report.damage_level?.level || "ringan",
                lat: parseFloat(report.lat),
                long: parseFloat(report.long),
                location: report.location || "",
                images: [],
                video: null
            });

            if (report.district) {
                setDistrict(report.district)
            }

            if (report.lat && report.long) {
                setLat(parseFloat(report.lat));
                setLong(parseFloat(report.long));
            }

            // Preview image/video jika tersedia
            if (report.ReportImages && report.ReportImages.length > 0) {
                const imageUrls = report.ReportImages.map(img => img);
                setImagePreviews(imageUrls);

                const existingIds = report.ReportImages.map(img => img.id);
                setForm((prev) => ({
                    ...prev,
                    image_to_keep: existingIds,
                }));
            }

            if (report.video_url) {
                setVideoPreview(report.video_url);
            }
        }
    }, [report]);

    useEffect(() => {
        if (!lat || !long) return;

        const updateCoordinatesAndLocation = async () => {
            setForm(prev => ({
                ...prev,
                lat,
                long
            }));

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}api/reverse-geocode?lat=${lat}&long=${long}`
                );
                const data = await response.json();
                const locationName = data.data.display_name ?? "";
                setDistrict(data.data.municipality ?? "")
                
                setForm(prev => ({
                    ...prev,
                    location: locationName
                }));
            } catch (error) {
                console.error("Failed to fetch location name:", error);
            }
        };

        updateCoordinatesAndLocation();
    }, [lat, long]);

    const fetchReport = async () => {
        try {
            setError(null)
            setLoading(true);

            const response = await getReport(reportId)
            setReport(response);
            console.log(response);
        } catch (e) {
            setError(e.errors || 'Failed to fetch reports')
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveImage = (imageIdToRemove) => {
        console.log(form.image_to_keep)
        setForm((prev) => ({
            ...prev,
            image_to_keep: prev.image_to_keep.filter(id => id !== imageIdToRemove),
        }));

        setImagePreviews((prev) => prev.filter(image => image.id !== imageIdToRemove));
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "images") {
            const selectedImages = Array.from(files);

            const previews = selectedImages.map((file) => URL.createObjectURL(file));

            // Gabungkan dengan nilai saat ini
            const updatedImages = [...form.images, ...selectedImages];

            // Set state
            setForm((prev) => ({
                ...prev,
                images: updatedImages
            }));

            setImagePreviews((prev) => [...prev, ...previews]);
            setTouched((prev) => ({ ...prev, images: true }));

            // Validasi langsung dengan updatedImages
            validateForm({ ...form, images: updatedImages }, setErrors, updateReportValidation);
        } else if (name === "video") {
            const videoFile = files[0];

            if (videoPreview) {
                URL.revokeObjectURL(videoPreview);
            }


            if (videoFile) {
                const preview = URL.createObjectURL(videoFile);

                setVideoPreview("");
                setTimeout(() => setVideoPreview(preview), 0);

                setForm((prev) => ({ ...prev, video: videoFile }));
                setTouched(prev => ({ ...prev, video: true }));
                validateForm({ ...form, video: videoFile }, setErrors, updateReportValidation);

                if (videoInputRef.current) {
                    videoInputRef.current.value = "";
                }
            }
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
            const error = validateField(name, value, updateReportValidation);
            setErrors((prev) => ({ ...prev, [name]: error }))
        }
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        const error = validateField(name, form[name], updateReportValidation);
        setErrors((prev) => ({ ...prev, [name]: error }));
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched(Object.keys(form).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

        const { value: validatedData, errors: validationErrors } = validate(updateReportValidation, form);
        console.log(form)

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSubmitError(null);
        setErrors({});

        try {
            setIsSubmitting(true);
            const damageLevelMap = {
                ringan: 1,
                sedang: 2,
                berat: 3
            };
            const formData = new FormData();
            formData.append("report_data", JSON.stringify({
                title: validatedData.title,
                desc: validatedData.desc,
                lat: validatedData.lat.toString(),
                long: validatedData.long.toString(),
                location: validatedData.location,
                damage_level_id: damageLevelMap[validatedData.damage_level_id],
                image_to_keep: validatedData.image_to_keep,
                district: validatedData.district,
            }));

            if (validatedData.images) {
                if (Array.isArray(validatedData.images)) {
                    validatedData.images.forEach((image) => {
                        formData.append("images", image);
                    });
                } else {
                    formData.append("images", validatedData.images);
                }
            }

            if (validatedData.video) {
                formData.append("video", validatedData.video);
            }

            console.log(formData)

            await updateReport(formData, reportId);

            setSuccess("Laporan Berhasil di Update!");

            setTimeout(() => {
                router.push("/report");
            }, 2000);
        } catch (error) {
            console.error("Submit error:", error);
            setSubmitError(`Failed to update report. ${error}` );
        } finally {
            setIsSubmitting(false);
        }
    };

    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setLat(pos.coords.latitude);
            setLong(pos.coords.longitude);
        }, (err) => {
            alert("Gagal mendapatkan lokasi otomatis.");
        });
    };

    if (loading) {
        return <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800 mx-auto"></div>;
    }

    return (
        <>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {submitError && typeof submitError === "string" && (
                        <AlertInfo
                            title="Terjadi Kesalahan"
                            message={submitError}
                            error={true}
                        />
                    )}
                    {success && (
                        <AlertPopUp
                            message={success}
                            type="success"
                            duration={2000}
                            onClose={() => setSuccess("")}
                        />
                    )}
                    <div className="sm:col-span-4">
                        <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">Nama Laporan</label>
                        <div className="mt-2">
                            <div
                                className={`flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 ${
                                    errors.title && touched.title
                                        ? 'outline-red-500' : 'outline-gray-300'
                                } focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-800`}>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"/>
                            </div>
                            {displayErrorForm("title", errors, touched)}
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
                                           className={`relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 ${
                                               errors.images && touched.images
                                                   ? 'outline-red-500' : 'outline-gray-300'
                                           } focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-blue-800`}>
                                        <span>Upload an image</span>
                                        <input id="images"
                                               type="file"
                                               className="sr-only"
                                               accept="image/*"
                                               multiple={true}
                                               name="images"
                                               onBlur={handleBlur}
                                               onChange={handleChange}/>
                                    </label>
                                </div>
                                <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB (Max 5)</p>
                                {displayErrorForm("images", errors, touched)}
                            </div>
                        </div>
                    </div>
                    {imagePreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
                            {imagePreviews.map((preview, idx) => {
                                const isObject = typeof preview === 'object' && preview !== null;
                                const previewUrl = isObject ? preview.image_url : preview;
                                return (
                                    <div key={isObject ? preview.id : idx}  className="relative w-42 h-42 group overflow-hidden">
                                        <Image
                                            src={previewUrl}
                                            onClick={() => setZoomSrc(previewUrl)}
                                            alt="foto laporan"
                                            width={100}
                                            height={100}
                                            className="w-42 h-42 rounded shadow border border-black object-contain"
                                            unoptimized
                                        />
                                        {isObject && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(preview.id)}
                                                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
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
                                           className={`relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 ${
                                               errors.video && touched.video
                                                   ? 'outline-red-500' : 'outline-gray-300'
                                           } focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-blue-500`}>
                                        <span>Upload a video</span>
                                        <input id="video"
                                               type="file"
                                               className="sr-only"
                                               accept="video/*"
                                               name="video"
                                               onBlur={handleBlur}
                                               onChange={handleChange}
                                               ref={videoInputRef}/>
                                    </label>
                                </div>
                                <p className="text-xs/5 text-gray-600">MP4 up to 10MB</p>
                                {displayErrorForm("video", errors, touched)}
                            </div>
                        </div>
                    </div>
                    {videoPreview && (
                        <div className="mt-4 relative w-64 h-64">
                            <video
                                controls
                                className="w-full h-full rounded shadow border object-contain">
                                <source src={videoPreview} type="video/mp4" />
                                Video tidak dapat diputar.
                            </video>
                        </div>
                    )}
                    <div className="col-span-full mt-10">
                        <label htmlFor="about" className="block text-sm/6 font-medium text-gray-900">Deskripsi
                            Kerusakan</label>
                        <div className="mt-2">
                            <CKEditor
                                editor={ClassicEditor}
                                config={editorConfiguration}
                                data={form.desc}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    const syntheticEvent = {
                                        target: {
                                            name: 'desc',
                                            value: data
                                        }
                                    };
                                    handleChange(syntheticEvent);
                                }}
                                onBlur={(event, editor) => {
                                    const syntheticEvent = {
                                        target: {
                                            name: 'desc'
                                        }
                                    };
                                    handleBlur(syntheticEvent);
                                }}
                            />
                        </div>
                        {displayErrorForm("desc", errors, touched)}
                    </div>
                    <fieldset className="col-span-full mt-10">
                        <legend className="text-sm/6 font-semibold text-gray-900">Tingkat Kerusakan</legend>
                        <div className="mt-2 space-y-6">
                            {[
                                { id: "ringan", label: "Ringan", value: "ringan" },
                                { id: "sedang", label: "Sedang", value: "sedang" },
                                { id: "berat", label: "Berat", value: "berat" }
                            ].map((option) => (
                                <div key={option.id} className="flex items-center gap-x-3">
                                    <input
                                        className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-blue-800 checked:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                                        id={option.id}
                                        name="damage_level_id"
                                        type="radio"
                                        value={option.value}
                                        checked={form.damage_level_id === option.value}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <label
                                        htmlFor={option.id}
                                        className="block text-sm/6 font-medium text-gray-900 cursor-pointer"
                                    >
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {displayErrorForm("damage_level_id", errors, touched)}
                    </fieldset>
                    <div className="col-span-full mt-10">
                        <label className="text-sm/6 font-medium text-gray-900">Lokasi (via GPS/manual)</label>
                        <button type="button" onClick={getCurrentLocation}
                                className="rounded-md bg-blue-800 px-4 py-2 mx-2 my-2 text-sm text-white shadow-sm hover:bg-blue-900">
                            Gunakan Lokasi Otomatis
                        </button>
                        <MapContainer center={[lat, long]}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            <LocationPicker setLat={setLat} setLong={setLong} />
                            {lat && long && <Marker position={[lat, long]}
                                                    icon={L.icon({iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"})}/>}
                        </MapContainer>
                        <div className="mt-6 flex flex-col lg:flex-row justify-start gap-x-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="lat" className="block text-sm/6 font-medium text-gray-900">Lat</label>
                                <div className="mt-2">
                                    <div
                                        className={`flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 ${
                                            errors.lat && touched.lat ? 'outline-red-500' : 'outline-gray-300'
                                        } focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-800`}>
                                        <input
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                            type="text"
                                            name="lat"
                                            id="lat"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={form.lat ? `${lat.toFixed(5)}` : "Belum dipilih"} readOnly={true}
                                        />
                                    </div>
                                    {displayErrorForm("lat", errors, touched)}
                                </div>
                            </div>
                            <div className="sm:col-span-4">
                                <label htmlFor="long" className="block text-sm/6 font-medium text-gray-900">Long</label>
                                <div className="mt-2">
                                    <div
                                        className={`flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 ${
                                            errors.long && touched.long ? 'outline-red-500' : 'outline-gray-300'
                                        } focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-800`}>
                                        <input
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                            type="text"
                                            name="long"
                                            id="long"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={form.long ? `${long.toFixed(5)}` : "Belum dipilih"} readOnly={true}
                                        />
                                    </div>
                                    {displayErrorForm("long", errors, touched)}
                                </div>
                            </div>
                            <div className="sm:col-span-4 lg:w-4xl">
                                <label htmlFor="location" className="block text-sm/6 font-medium text-gray-900">Lokasi</label>
                                <div className="mt-2">
                                    <div
                                        className={`flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 ${
                                            errors.location && touched.location ? 'outline-red-500' : 'outline-gray-300'
                                        } focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-800`}>
                                        <input
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                            type="text"
                                            name="location"
                                            id="location"
                                            value={form.location ? form.location : "Belum dipilih" }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            readOnly={true}
                                        />
                                    </div>
                                    {displayErrorForm("location", errors, touched)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                            type="submit"
                            className={"rounded-md bg-blue-800 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"}>
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </form>
            {zoomSrc !== "" && (
                <div
                    className="fixed inset-0 z-50 bg-black opacity-80 flex items-center justify-center"
                    onClick={() => setZoomSrc("")}
                >
                    {zoomSrc.endsWith('.mp4') ? (
                        <video src={zoomSrc} controls className="w-auto h-auto rounded  shadow border border-black object-contain" />
                    ) : (
                        <Image
                            src={zoomSrc}
                            alt="foto laporan"
                            width={100}
                            height={100}
                            className="w-auto h-auto rounded  shadow border border-black object-contain"
                            unoptimized
                        />
                    )}
                </div>
            )}
        </>
    );
}