import Banner from "@/components/Banner";
import StatisticReport from "@/components/StatisticReport";
import Footer from "@/components/Footer";

import dynamic from "next/dynamic"
import Hero from "@/components/Hero";
import About from "@/components/About";
import HowTo from "@/components/HowTo";
import PuprAbout from "@/components/PuprAbout";
import TutorialCard from "@/components/TutorialCard";
import {faBars, faCheckSquare, faList, faListAlt} from "@fortawesome/free-solid-svg-icons";

export default function Home() {

    const data = [
        {
            icon: '/icons/web.png',
            title: "1. Masuk ke Website Laporkan Jalan Rusak",
            desc: 'Jumlah Laporan'
        },
        {
            icon: '/icons/login.png',
            title: "2️. Klik Menu Login",
            desc: 'Pilih menu Login di halaman utama untuk masuk ke akun Anda.'
        },
        {
            icon: '/icons/register.png',
            title: "3. Login atau Daftar",
            desc: 'Jika sudah memiliki akun, silakan login dengan email dan kata sandi Anda. Jika belum memiliki akun, silakan daftar terlebih dahulu.'
        },
        {
            icon: '/icons/report-menu.png',
            title: "4. Pergi ke Menu Laporan",
            desc: 'Setelah berhasil login, klik menu Laporan, lalu pilih Tambah Laporan.'
        },
        {
            icon: '/icons/report-fill.png',
            title: "5. Lengkapi Formulir Laporan",
            desc: "Isi data yang diminta secara lengkap, seperti:<br/><ul class='list-disc ml-5'><li>Foto kerusakan jalan Video kondisi (jika tersedia)</li> <li>Deskripsi kerusakan</li> <li>Tingkat kerusakan (ringan, sedang, atau berat)</li> <li>Titik lokasi kerusakan (bisa ditandai di peta)</li></ul>"
        },
        {
            icon: '/icons/report-done.png',
            title: "6. Kirim Laporan",
            desc: 'Klik tombol Submit untuk mengirim laporan Anda.'
        },
    ];

    return (
        <div className="flex flex-col">
            {/* Banner */}
            <Banner isLogin={false} />

            {/* Judul */}
            <div className="max-w-3xl px-4 py-28 sm:py-28 lg:py-28 mx-auto text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
                    <span className="text-gray-500">Cara</span>{" "}
                    <span className="text-blue-900">Melaporkan Jalan Rusak</span>
                </h1>
            </div>

            {/* Kartu Panduan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
                {data.map((item, index) => (
                    <TutorialCard
                        key={index}
                        title={item.title}
                        desc={item.desc}
                        icon={item.icon}
                    />
                ))}
            </div>

            {/* Video + Buku Panduan */}
            <div className="max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 mx-auto">
                <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Video Tutorial</h2>
                    </div>

                    {/* Deskripsi */}
                    <p className="text-sm text-gray-600 tracking-tight">
                        Untuk memudahkan, Anda dapat menonton video tutorial yang tersedia di halaman ini.
                    </p>

                    {/* Video */}
                    <div className="mt-4 aspect-w-16 aspect-h-9 w-full">
                        <video
                            controls
                            className="w-full h-full rounded shadow border object-contain"
                        >
                            <source src={null} type="video/mp4" />
                            Video tidak dapat diputar.
                        </video>
                    </div>

                    {/* Buku Panduan */}
                    <div className="mt-6">
                        <h2 className="text-base font-bold text-gray-900 mb-2">
                            Atau Download Buku Panduan (PDF)
                        </h2>
                        <p className="text-sm text-gray-600 tracking-tight">
                            Unduh buku panduan lengkap pelaporan di sini:{" "}
                            <a
                                href="#"
                                className="text-blue-900 hover:text-blue-800 font-bold"
                            >
                                Unduh Buku Panduan (PDF)
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}