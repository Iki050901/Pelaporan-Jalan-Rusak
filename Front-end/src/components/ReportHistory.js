import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {listReport} from "@/services/report.service";
import {AlertInfo} from "@/components/AlertInfo";
import {getStatusClass} from "@/utils/status.utils";
import Image from "next/image";
import {useUser} from "@/context/UserContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faFilter, faSort} from "@fortawesome/free-solid-svg-icons";
import {handlePageChange, renderPaginationNumbers} from "@/utils/pagination.utils";

export default function ReportHistory() {

    const { userData } = useUser();
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

    const [validation, setValidation] = useState("");
    const [latest, setLatest] = useState("latest");
    const [damageLevel, setDamageLevel] = useState("");

    useEffect(() => {
        if (role) {
            fetchReports();
        }
    }, [role, page, validation, damageLevel, latest])

    const fetchReports = async () => {
        try {
            setError(null)
            setLoading(true);

            let response;

            if (role === 'PUPR') {
                response = await listReport(true, page, 10, '5,6,7', "", damageLevel, latest);
            } else if (role === 'KECAMATAN') {
                response = await listReport(true, page, 10, '2,3', "", damageLevel, latest);
            } else if (role === 'USER') {
                response = await listReport(true, page, 10, validation, "", damageLevel, latest);
            } else {
                console.warn("Unknown role:", role);
            }

            console.log(response);
            setReports(response.reports);
            setTotalPage(response.total_pages)
            setTotalData(response.total_data)
            setPageSize(response.page_size)
            setCurrentPage(response.current_page)
        } catch (e) {
            // setError(e.response?.data?.message || 'Failed to fetch reports')
            console.error('Fetch reports error: ', e)
        } finally {
            setLoading(false);
        }
    }

    const handleDetailClick = (reportId) => {
        router.push(`/report/detail/${reportId}`);
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

    if (!loading && reports.length === 0) {
        return (
            <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
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
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
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
                    </div>
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Laporan</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Lokasi</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Foto</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
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
                                <td>
                                    <button
                                        onClick={() => handleDetailClick(report.id)}
                                        className="mt-4 me-2 sm:mt-0 inline-flex items-center rounded-md bg-blue-800 p-2 text-sm text-white shadow-sm hover:bg-blue-900"
                                    >
                                        <FontAwesomeIcon icon={faEye} size="sm" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
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
            </div>
        </div>
    )
}