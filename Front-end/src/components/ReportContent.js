import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar, faLocationDot, faUser} from "@fortawesome/free-solid-svg-icons";
import ReportComments from "@/components/ReportComments";
import {faWhatsapp} from "@fortawesome/free-brands-svg-icons";


export default function ReportContent() {
    return (
        <div>
            <div className="border-b flex justify-between items-start pb-4 mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-blue-800">Jalan Berlubang di Jl. Merdeka</h1>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"> <FontAwesomeIcon icon={faUser}/> Acull</span>
                        <span className="flex items-center gap-1"> <FontAwesomeIcon icon={faLocationDot} />  Jakarta Timur</span>
                        <span className="flex items-center gap-1"> <FontAwesomeIcon icon={faCalendar}/> Dilaporkan pada 4 Mei 2025</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">Belum ditindak lanjuti</span>
                    <button className="bg-green-400 text-sm px-3 py-2 rounded-full hover:bg-green-800">
                        <a href={`https://wa.me/`} className="text-white font-medium"><FontAwesomeIcon icon={faWhatsapp} size="lg" /></a>
                    </button>
                </div>
            </div>

            <div className="bg-white pb-4 mt-5">
                <h3 className="text-md font-semibold text-gray-800 mb-2">Deskripsi Laporan</h3>
                <p className="text-sm text-gray-700">
                    Lubang berada di jalur utama Jl. Merdeka yang sering dilewati kendaraan roda dua. Lokasi gelap saat
                    malam hari dan sangat rawan kecelakaan.
                </p>

                <div className="mt-4 space-y-2">
                    <h4 className="text-gray-800">Lampiran</h4>
                    <div className="flex flex-wrap gap-4">
                        <img src="foto-jalan.jpg" alt="Foto jalan rusak" className="w-48 rounded shadow border"/>
                        <video controls className="w-64 rounded shadow border">
                            <source src="video-jalan.mp4" type="video/mp4"/>
                            Video tidak dapat diputar.
                        </video>
                    </div>
                </div>
            </div>

            <ReportComments />
        </div>
    )
}