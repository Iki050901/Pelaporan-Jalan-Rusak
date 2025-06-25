import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {AlertInfo} from "@/components/AlertInfo";
import Image from "next/image";
import {listReport, rejectDistrict, rejectPupr, validateDistrict, validatePupr} from "@/services/report.service";
import {handlePageChange, renderPaginationNumbers} from "@/utils/pagination.utils";
import {getStatusClass} from "@/utils/status.utils";
import {faEye, faEdit, faCheck, faX} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useUser} from "@/context/UserContext";
import AlertPopUp from "@/components/AlertPopUp";
import {faWhatsapp} from "@fortawesome/free-brands-svg-icons";


export default function Report() {

    const {userData} = useUser();
    const role = userData?.data?.role.role

    const [reports, setReports] = useState([{}]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [totalData, setTotalData] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const router = useRouter();
    const [error, setError] = useState(null);
    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");

    useEffect(() => {
        if (role) {
            fetchReports();
        }
    }, [page, role])
    
    const fetchReports = async () => {
        try {
            setError(null)
            setLoading(true);

            let response;

            if (role === 'PUPR') {
                response = await listReport(true, page, 10, '3,5,6');
            } else {
                response = await listReport(true, page, 10);
            }

            setReports(response.reports);
            setTotalPage(response.total_pages)
            setTotalData(response.total_data)
            setPageSize(response.page_size)
            setCurrentPage(response.current_page)
        } catch (e) {
            setError(error.response?.data?.message || 'Failed to fetch reports')
            console.error('Fetch reports error: ', e)
        } finally {
            setLoading(false);
        }
    }

    if (error) {
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

    const handleCreateClick = () => {
        router.push('/report/create');
    }

    const handleAccept = (id) => {
        setSelectedReportId(id);
        setShowAcceptDialog(true);
    };

    const handleReject = (id) => {
        setSelectedReportId(id);
        setShowRejectDialog(true);
    };

    const handleValidate = async () => {
        try {
            setShowAcceptDialog(false)
            if (role === "KECAMATAN") {
                await validateDistrict(selectedReportId);
            }

            if (role === "PUPR") {
                await validatePupr(selectedReportId);
            }

            setSubmitSuccess("Success to Validate");
            fetchReports()
        } catch (error) {
            console.error(error);
            setSubmitError(error);
        }
    }

    const handleRejectValidate = async () => {
        try {
            setShowRejectDialog(false)
            if (role === "KECAMATAN") {
                await rejectDistrict(selectedReportId, rejectReason);
            }

            if (role === "PUPR") {
                await rejectPupr(selectedReportId, rejectReason);
            }

            setSubmitSuccess("Success to Validate");
            setRejectReason("")
            await fetchReports()
        } catch (error) {
            console.error(error);
            setSubmitError(error);
        }
    }

    const handleEditClick = (reportId) => {
        router.push(`/report/update/${reportId}`);
    }

    const handleDetailClick = (reportId) => {
        router.push(`/report/detail/${reportId}`);
    }

    if (!loading && reports.length === 0) {
        return (
            <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                {role === 'USER' && (
                    <div className="sm:flex sm:items-center justify-between">
                        <button onClick={handleCreateClick}
                                className="mt-4 sm:mt-0 inline-flex items-center rounded-md bg-blue-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-900">
                            + Tambah Laporan
                        </button>
                    </div>
                )}
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

    return (
        <>
            <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                {(submitError || submitSuccess) && (
                    <AlertPopUp
                        message={submitError || submitSuccess}
                        type={submitError ? "error" : "success"}
                        duration={5000}
                        onClose={() => {
                            setSubmitError("");
                            setSubmitSuccess("");
                        }}
                    />
                )}
                {role === 'USER' && (
                    <div className="sm:flex sm:items-center justify-between">
                        <button onClick={handleCreateClick}
                                className="mt-4 sm:mt-0 inline-flex items-center rounded-md bg-blue-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-900">
                            + Tambah Laporan
                        </button>
                    </div>
                )}
                <div className="mt-6 flow-root">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Laporan
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Lokasi</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Foto</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
                                { ['PUPR', 'KECAMATAN'].includes(role) ? <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Validasi</th> : ''}
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {reports.map((report) => (
                                <tr key={report.id}>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">{report.title}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{report.location}</td>
                                    <td className="whitespace-nowrap px-4 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ${getStatusClass(report.validation_status.id)} ring-inset`}>
                                            {report.validation_status.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4">
                                        {report.report_images && report.report_images[0] && (
                                            <Image
                                                src={report.report_images[0].image_url}
                                                alt="foto laporan"
                                                width={100}
                                                height={100}
                                                className="rounded object-cover"
                                            />
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-4 text-right text-sm">
                                        <button
                                            onClick={() => handleDetailClick(report.id)}
                                            className="mt-4 me-2 sm:mt-0 inline-flex items-center rounded-md bg-blue-800 p-2 text-sm text-white shadow-sm hover:bg-blue-900"
                                        >
                                            <FontAwesomeIcon icon={faEye} size="sm" />
                                        </button>
                                        { role === 'USER' && (
                                            <button
                                                onClick={() => handleEditClick(report.id)}
                                                className="mt-4 me-2 sm:mt-0 inline-flex items-center rounded-md bg-yellow-400 p-2 text-sm text-white shadow-sm hover:bg-yellow-800"
                                            >
                                                <FontAwesomeIcon icon={faEdit} size="sm" />
                                            </button>
                                        ) }
                                        { ['PUPR', 'KECAMATAN'].includes(role) ? (
                                            <button
                                                onClick={() => window.open(`https://wa.me/${report.number_phone}`, '_blank')}
                                                className="mt-4 me-2 sm:mt-0 inline-flex items-center rounded-md bg-green-400 p-2 text-sm text-white shadow-sm hover:bg-green-800"
                                            >
                                                <FontAwesomeIcon icon={faWhatsapp} size="sm" />
                                            </button>
                                        ) : '' }
                                    </td>
                                    { ['PUPR', 'KECAMATAN'].includes(role) ? (
                                        <td className="whitespace-nowrap px-2 py-4 text-right text-sm">
                                            <button
                                                onClick={() => handleAccept(report.id)}
                                                disabled={report.is_district_validate || report.is_pupr_validate}
                                                className={`mt-4 me-2 sm:mt-0 inline-flex items-center rounded-md  p-2 text-sm text-white shadow-sm  ${report.is_district_validate || report.is_pupr_validate ? 'bg-green-100 hover:bg-green-300 cursor-not-allowed' : 'bg-green-400 hover:bg-green-900'}`}
                                            >
                                                <FontAwesomeIcon icon={faCheck} size="sm" />
                                            </button>
                                            <button
                                                onClick={() => handleReject(report.id)}
                                                disabled={report.is_district_validate || report.is_pupr_validate}
                                                className={`mt-4 me-2 sm:mt-0 inline-flex items-center rounded-md  p-2 text-sm text-white shadow-sm  ${report.is_district_validate || report.is_pupr_validate ? 'bg-red-100 hover:bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-900'}`}
                                            >
                                                <FontAwesomeIcon icon={faX} size="sm" />
                                            </button>
                                        </td>
                                        ) : ''
                                    }

                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <a href="#"
                           className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
                        <a href="#"
                           className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between mt-4">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing
                                <span className="font-medium"> {((currentPage - 1) * pageSize) + 1} </span>
                                to
                                <span className="font-medium"> {Math.min(currentPage * pageSize, totalData)} </span>
                                of
                                <span className="font-medium"> {totalData} </span>
                                results
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
                                <a href="#"
                                   onClick={(e) => {
                                       e.preventDefault();
                                       handlePageChange(currentPage - 1, totalPage, setPage);
                                   }}
                                   className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                                       currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
                                   }`}>
                                    <span className="sr-only">Previous</span>
                                    <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd"
                                              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </a>

                                {renderPaginationNumbers(currentPage, totalPage, setPage)}

                                <a href="#"
                                   onClick={(e) => {
                                       e.preventDefault();
                                       handlePageChange(currentPage + 1, totalPage, setPage);
                                   }}
                                   className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                                       currentPage === totalPage ? 'cursor-not-allowed opacity-50' : ''
                                   }`}>
                                    <span className="sr-only">Next</span>
                                    <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd"
                                              d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
                {showAcceptDialog && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-700 ease-in-out">
                        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-700 scale-95 animate-fadeIn">
                            <h2 className="text-lg font-bold mb-4 text-gray-800">Konfirmasi</h2>
                            <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menyetujui laporan ini?</p>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowAcceptDialog(false)}
                                    className="px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleValidate}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                >
                                    Ya, Setujui
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showRejectDialog && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-700 ease-in-out">
                        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-700 scale-95 animate-fadeIn">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Alasan Penolakan</h2>
                            <textarea
                                className="w-100 p-2 border border-gray-300 rounded-md mb-4 text-sm"
                                rows={4}
                                placeholder="Tuliskan alasan penolakan..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowRejectDialog(false)}
                                    className="px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleRejectValidate}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                >
                                    Tolak
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}