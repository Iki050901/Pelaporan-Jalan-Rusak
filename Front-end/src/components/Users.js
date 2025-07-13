import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {deleteUser, listUsers} from "@/services/users.service";
import {AlertInfo} from "@/components/AlertInfo";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faEye, faTrash} from "@fortawesome/free-solid-svg-icons";
import {handlePageChange, renderPaginationNumbers} from "@/utils/pagination.utils";
import {deleteReport} from "@/services/report.service";
import AlertPopUp from "@/components/AlertPopUp";

export default function Users() {

    const [users, setUsers] = useState([{}]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [totalData, setTotalData] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);

    const [submitSuccess, setSubmitSuccess] = useState("");
    const [success, setSuccess] = useState("");

    const router = useRouter();

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const fetchUsers = async () => {
        try {
            setError(null);
            setLoading(true);
            const response = await listUsers(10, page, true)

            setUsers(response.users);
            console.log(response);
            setTotalPage(response.total_pages)
            setTotalData(response.total_data)
            setPageSize(response.page_size)
            setCurrentPage(response.current_page)
        } catch (e) {
            setError(e || 'Failed to fetch reports')
            console.error('Fetch reports error: ', e)
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteClick = async (userId) => {
        try {
            await deleteUser(userId);

            setSuccess("Success to delete user");
            await fetchUsers();
        } catch (error) {
            console.error(error);
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

    if (!loading && users.length === 0) {
        return (
            <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center justify-between mb-6">
                    <button onClick={handleCreateClick}
                            className="mt-4 sm:mt-0 inline-flex items-center rounded-md bg-blue-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-900">
                        + Tambah Akun Pengguna
                    </button>
                </div>
                <AlertInfo
                    title="404"
                    message="Data tidak ditemukan"
                />
            </div>
        );
    }

    const handleCreateClick = () => {
        router.push('/users/create');
    }

    const handleDetailClick = (userId) => {
        router.push(`/users/detail/${userId}`);
    }

    const handleEditClick = (userId) => {
        router.push(`/users/update/${userId}`);
    }

    if (loading) {
        return <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800 mx-auto"></div>;
    }

    return (
        <>
            <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                {success && (
                    <AlertPopUp
                        message={success}
                        type="success"
                        duration={2000}
                        onClose={() => setSuccess("")}
                    />
                )}
                <div className="sm:flex sm:items-center justify-between">
                    <button onClick={handleCreateClick} className="mt-4 sm:mt-0 inline-flex items-center rounded-md bg-blue-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-900">
                        + Tambah Akun Pengguna
                    </button>
                </div>

                <div className="mt-6 flow-root">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nomor HP</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Aksi</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {users.map((user, idx) => (
                                <tr key={user.id}>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">{user.name}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{user.email}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{user.number_phone}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{user.role.role}</td>
                                    <td className="whitespace-nowrap px-2 py-4 text-right text-sm">
                                        <button
                                            onClick={() => handleDetailClick(user.id)}
                                            className="mt-4 me-2 sm:mt-0 inline-flex items-center rounded-md bg-blue-800 p-2 text-sm text-white shadow-sm hover:bg-blue-900"
                                        >
                                            <FontAwesomeIcon icon={faEye} size="sm" />
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(user.id)}
                                            className="mt-4 me-2 sm:mt-0 inline-flex items-center rounded-md bg-yellow-400 p-2 text-sm text-white shadow-sm hover:bg-yellow-800"
                                        >
                                            <FontAwesomeIcon icon={faEdit} size="sm" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(user.id)}
                                            className="mt-4 me-2 sm:mt-0 inline-flex items-center rounded-md bg-red-500 p-2 text-sm text-white shadow-sm hover:bg-yellow-800"
                                        >
                                            <FontAwesomeIcon icon={faTrash} size="sm" />
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
        </>
    )
}