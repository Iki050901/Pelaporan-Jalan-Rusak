import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {AlertInfo} from "@/components/AlertInfo";
import Image from "next/image";
import {
    deleteReport, exportReport,
    listReport,
    rejectDistrict,
    rejectPupr,
    validateDistrict,
    validatePupr, validatePuprDone
} from "@/services/report.service";
import {handlePageChange, renderPaginationNumbers} from "@/utils/pagination.utils";
import {getStatusClass} from "@/utils/status.utils";
import {faEye, faEdit, faCheck, faX, faTrash, faSort, faFilter} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useUser} from "@/context/UserContext";
import AlertPopUp from "@/components/AlertPopUp";
import {faWhatsapp} from "@fortawesome/free-brands-svg-icons";
import {API_CONFIG, getApiUrl} from "@/config/api.config";


export default function Report() {

    const {userData} = useUser();
    const role = userData?.data?.role.role
    const number_phone = userData?.data?.number_phone
    const district = userData?.data?.district

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

    const [validation, setValidation] = useState("");
    const [latest, setLatest] = useState("latest");
    const [damageLevel, setDamageLevel] = useState("");

    const [statValidation, setStatValidation] = useState(null);

    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState('');


    useEffect(() => {
        if (role) {
            fetchReports();
        }
    }, [page, role, validation, damageLevel, latest])
    
    const fetchReports = async () => {
        try {
            setError(null)
            setLoading(true);

            let response;

            if (role === 'PUPR') {
                response = await listReport(true, page, 10, '3,5,6', "", damageLevel, latest);
            } else if (role === 'KECAMATAN') {
                response = await listReport(true, page, 10, '1,2,3,4,5,6', district, damageLevel, latest);
            } else {
                response = await listReport(true, page, 10, validation, "", damageLevel, latest);
            }

            setReports(response.reports);
            console.log(response.reports)
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

    const downloadPDF = async () => {
       try {
           const query = new URLSearchParams();
           if (!year) {
               alert("Tahun wajib diisi.");
               return;
           }

           if (year) query.append('year', year.toString());
           if (month) query.append('month', month);

           const url = `${getApiUrl(API_CONFIG.endpoints.report.export)}?${query.toString()}`;
           window.open(url, '_blank');
       } catch (e) {
           console.error("Error saat mengunduh PDF:", e);
           alert("Terjadi kesalahan saat mengunduh PDF.");
       }
    };

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

    const handleAccept = (id, validation_stat_id) => {
        setSelectedReportId(id);
        setStatValidation(validation_stat_id);
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
                if (statValidation === 3) {
                    await validatePupr(selectedReportId);
                } else {
                    await validatePuprDone(selectedReportId);
                }
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

    const handleDeleteClick = async (reportId) => {
        try {
            await deleteReport(reportId);

            setSubmitSuccess("Success to delete report");
            await fetchReports();
        } catch (error) {
            console.error(error);
            setSubmitError(error);
        }
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
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 py-4">
                    {/* Sort by Date */}
                    <div className="font-semibold text-gray-400">
                        <span><FontAwesomeIcon icon={faSort} className="mr-2"/>Urutkan berdasarkan : </span>
                    </div>
                    <div className="relative inline-block">
                        <select
                            name="latest"
                            value={latest}
                            onChange={(e) => setLatest(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="latest">Terbaru</option>
                            <option value="oldest">Terlama</option>
                        </select>
                    </div>

                    {/* Filter by Validation */}
                    <div className="font-semibold text-gray-400">
                        <span><FontAwesomeIcon icon={faFilter} className="mr-2"/>Filter berdasarkan : </span>
                    </div>
                    { role === 'USER' && (
                        <div className="relative inline-block">
                            <select
                                name="validation"
                                value={validation}
                                onChange={(e) => setValidation(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Semua Validasi</option>
                                <option value="1">Belum di Validasi</option>
                                <option value="3">Validasi oleh Kecamatan</option>
                                <option value="5">Validasi oleh PUPR</option>
                                <option value="7">Selesai</option>
                            </select>
                        </div>
                    )}

                    {/* Filter by Damage Level */}
                    <div className="relative inline-block">
                        <select
                            name="damage_level"
                            value={damageLevel}
                            onChange={(e) => setDamageLevel(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tingkat Kerusakan</option>
                            <option value="1">Ringan</option>
                            <option value="2">Sedang</option>
                            <option value="3">Berat</option>
                        </select>
                    </div>

                    {/* Download PDF */}

                </div>
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
                {
                    (number_phone === null && (
                        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                            <AlertInfo
                                title="Tambahkan No. HP"
                                message={"Tambahkan No. Hp agar admin mudah untuk mengghubungi anda, tambahkan pada menu profile"}
                                error={false}
                            />
                        </div>
                    ))
                }
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
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 py-4">
                            {/* Sort by Date */}
                            <div className="font-semibold text-gray-400">
                                <span><FontAwesomeIcon icon={faSort} className="mr-2"/>Urutkan berdasarkan : </span>
                            </div>
                            <div className="relative inline-block">
                                <select
                                    name="latest"
                                    value={latest}
                                    onChange={(e) => setLatest(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="latest">Terbaru</option>
                                    <option value="oldest">Terlama</option>
                                </select>
                            </div>

                            {/* Filter by Validation */}
                            <div className="font-semibold text-gray-400">
                                <span><FontAwesomeIcon icon={faFilter} className="mr-2"/>Filter berdasarkan : </span>
                            </div>
                            { role === 'USER' && (
                                <div className="relative inline-block">
                                    <select
                                        name="validation"
                                        value={validation}
                                        onChange={(e) => setValidation(e.target.value)}
                                        className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Semua Validasi</option>
                                        <option value="1">Belum di Validasi</option>
                                        <option value="3">Validasi oleh Kecamatan</option>
                                        <option value="5">Validasi oleh PUPR</option>
                                        <option value="7">Selesai</option>
                                    </select>
                                </div>
                            )}

                            {/* Filter by Damage Level */}
                            <div className="relative inline-block">
                                <select
                                    name="damage_level"
                                    value={damageLevel}
                                    onChange={(e) => setDamageLevel(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tingkat Kerusakan</option>
                                    <option value="1">Ringan</option>
                                    <option value="2">Sedang</option>
                                    <option value="3">Berat</option>
                                </select>
                            </div>

                            { role === 'PUPR' && (
                                <div className="flex flex-row h-9">
                                    <select
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                        className="border border-gray-300 rounded-md"
                                    >
                                        <option value="">Semua Bulan</option>
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('id-ID', { month: 'long' })}</option>
                                        ))}
                                    </select>

                                    <input
                                        type="number"
                                        min="2020"
                                        max={new Date().getFullYear()}
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        placeholder="(ex: 2025)"
                                        className="border border-gray-300 ml-2 rounded-md"
                                    />

                                    <button
                                        onClick={downloadPDF}
                                        className="bg-blue-900 ml-2 text-white rounded-md hover:bg-blue-800 w-30"
                                    >
                                        Unduh PDF
                                    </button>
                                </div>
                            )}
                        </div>
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
                                        { role === 'USER' && !report.is_district_validate && (
                                            <>
                                                <button
                                                    onClick={() => handleEditClick(report.id)}
                                                    className="mt-4 me-2 sm:mt-0 inline-flex items-center rounded-md bg-yellow-400 p-2 text-sm text-white shadow-sm hover:bg-yellow-800"
                                                >
                                                    <FontAwesomeIcon icon={faEdit} size="sm" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(report.id)}
                                                    className="mt-4 me-2 sm:mt-0 inline-flex items-center rounded-md bg-red-500 p-2 text-sm text-white shadow-sm hover:bg-yellow-800"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} size="sm" />
                                                </button>
                                            </>
                                        ) }
                                        { role === 'PUPR' && (
                                            <button
                                                onClick={() => handleDeleteClick(report.id)}
                                                className="mt-4 me-2 sm:mt-0 inline-flex items-center rounded-md bg-red-500 p-2 text-sm text-white shadow-sm hover:bg-yellow-800"
                                            >
                                                <FontAwesomeIcon icon={faTrash} size="sm" />
                                            </button>
                                        )}
                                        { ['PUPR', 'KECAMATAN'].includes(role) ? (
                                            <button
                                                onClick={() => window.open(`https://wa.me/${number_phone}`, '_blank')}
                                                className="mt-4 me-2 sm:mt-0 inline-flex items-center rounded-md bg-green-400 p-2 text-sm text-white shadow-sm hover:bg-green-800"
                                            >
                                                <FontAwesomeIcon icon={faWhatsapp} size="sm" />
                                            </button>
                                        ) : '' }
                                    </td>
                                    {['PUPR', 'KECAMATAN'].includes(role) && (
                                        <td className="whitespace-nowrap px-2 py-4 text-right text-sm">
                                            <button
                                                onClick={() => handleAccept(report.id, report.validation_status.id)}
                                                disabled={
                                                    (role === 'PUPR' && report.is_pupr_validate && report.validation_status.id === 7) ||
                                                    (role === 'KECAMATAN' && report.is_district_validate)
                                                }
                                                className={`mt-4 me-2 sm:mt-0 inline-flex items-center rounded-md p-2 text-sm text-white shadow-sm ${
                                                    (role === 'PUPR' && report.is_pupr_validate && report.validation_status.id === 7) ||
                                                    (role === 'KECAMATAN' && report.is_district_validate)
                                                        ? 'bg-green-100 hover:bg-green-300 cursor-not-allowed'
                                                        : 'bg-green-400 hover:bg-green-900'
                                                }`}
                                            >
                                                <FontAwesomeIcon icon={faCheck} size="sm" />
                                            </button>

                                            <button
                                                onClick={() => handleReject(report.id)}
                                                disabled={
                                                    (role === 'PUPR' && report.is_pupr_validate) ||
                                                    (role === 'KECAMATAN' && report.is_district_validate)
                                                }
                                                className={`mt-4 me-2 sm:mt-0 inline-flex items-center rounded-md p-2 text-sm text-white shadow-sm ${
                                                    (role === 'PUPR' && report.is_pupr_validate) ||
                                                    (role === 'KECAMATAN' && report.is_district_validate)
                                                        ? 'bg-red-100 hover:bg-red-300 cursor-not-allowed'
                                                        : 'bg-red-500 hover:bg-red-900'
                                                }`}
                                            >
                                                <FontAwesomeIcon icon={faX} size="sm" />
                                            </button>
                                        </td>
                                    )}
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