import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar, faLocationDot, faUser, faFile} from "@fortawesome/free-solid-svg-icons";
import ReportComments from "@/components/ReportComments";
import {faWhatsapp} from "@fortawesome/free-brands-svg-icons";
import {useEffect, useState} from "react";
import axios from "axios";
import {listComments} from "@/services/comments.service";
import {getReport} from "@/services/report.service";
import {AlertInfo} from "@/components/AlertInfo";
import DOMPurify from "dompurify";
import Image from "next/image";
import {getStatusClass} from "@/utils/status.utils";
import {useUser} from "@/context/UserContext";


export default function ReportContent({reportId}) {

    const {userData} = useUser();
    const role = userData?.data?.role.role

    const [report, setReport] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReport()
    }, [])

    const fetchReport = async () => {
        try {
            setError(null)
            setLoading(true);
            const response = await getReport(reportId)

            setReport(response);
        } catch (e) {
            setError(e.errors || 'Failed to fetch reports')
        } finally {
            setLoading(false)
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
        <div>
            <div className="border-b flex justify-between items-start pb-4 mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-blue-800">{report.title}</h1>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-1 text-xs text-gray-400"> <FontAwesomeIcon icon={faUser} size="sm" className="me-1"/> {report.user.name}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400"> <FontAwesomeIcon icon={faLocationDot} size="sm" className="me-1"/> {report.location}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400"> <FontAwesomeIcon icon={faCalendar} size="sm" className="me-1"/> {`Dilaporkan pada ${report.created_at}`}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-md text-xs ring-1 ${getStatusClass(report.validation_status.id)} ring-inset font-semibold`}>{report.validation_status.status}</span>
                    {['PUPR', 'KECAMATAN'].includes(role) ? (
                        <button className="bg-green-400 text-sm px-3 py-2 rounded-full hover:bg-green-800">
                            <a href={`https://wa.me/${report.number_phone ? report.number_phone : ""}`} className="text-white font-medium"><FontAwesomeIcon icon={faWhatsapp} size="lg" /></a>
                        </button>
                    ) : ""}
                </div>
            </div>

            <div className="bg-white pb-4 mt-5">
                <div className="text-md text-gray-700 prose" dangerouslySetInnerHTML={{ __html: safeHtml }} />

                <div className="mt-24 space-y-2">
                    <h4 className="text-gray-400 text-xs"><FontAwesomeIcon icon={faFile} size="sm" className="me-1"/> Lampiran</h4>
                    <div className="flex flex-wrap gap-4">
                        {report.ReportImages.map((image) => (
                            <Image
                                key={image.id}
                                src={image.image_url}
                                alt="foto laporan"
                                width={100}
                                height={100}
                                className="w-42 h-42 rounded shadow border border-black object-contain"
                                unoptimized
                            />
                        ))}
                        <video controls className="w-42 h-42 rounded shadow border">
                            <source src={report.video_url} type="video/mp4"/>
                            Video tidak dapat diputar.
                        </video>
                    </div>
                </div>
            </div>

            <ReportComments reportId={reportId}/>
        </div>
    )
}