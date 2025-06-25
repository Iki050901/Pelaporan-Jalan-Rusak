"use client";

import ReportCard from "@/components/ReportCard";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {listReport} from "@/services/report.service";
import {AlertInfo} from "@/components/AlertInfo";
import {handlePageChange, renderPaginationNumbers} from "@/utils/pagination.utils";

function Dashboard() {

    const router = useRouter();

    const handleView = (reportId) => router.push(`/dashboard/detail/${reportId}`);

    const [reports, setReports] = useState([{}])
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [totalData, setTotalData] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReports()
    }, [page]);

    const fetchReports = async () => {
        try {
            setError(null);
            setLoading(true);
            const response = await listReport(true, page, 10);

            setReports(response.reports);
            setTotalPage(response.total_pages)
            setTotalData(response.total_data)
            setPageSize(response.page_size)
            setCurrentPage(response.current_page)
        } catch (e) {
            setError(e.errors || 'Failed to fetch reports')
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

    if (!loading && reports.length === 0) {
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

    return (
        <main>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {reports.map((report) => (
                    <ReportCard
                        key={report.id}
                        id={report.id}
                        title={report.title}
                        status={report.validation_status.status}
                        status_id={report.validation_status.id}
                        location={report.location}
                        user={report.user.name}
                        description={report.desc}
                        date={report.created_at}
                        number_phone={report.user.number_phone || ""}
                        onView={handleView}
                    />
                ))}
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
        </main>
    )
}

export default Dashboard;