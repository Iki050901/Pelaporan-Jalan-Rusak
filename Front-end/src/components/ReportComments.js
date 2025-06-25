import Image from "next/image";
import {useEffect, useState} from "react";
import {createComments, deleteComment, listComments} from "@/services/comments.service";
import {AlertInfo} from "@/components/AlertInfo";
import {displayErrorForm, validate, validateField} from "@/validation/validation";
import {createCommentsValidation} from "@/validation/comment.validation";
import {useRouter} from "next/navigation";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar} from "@fortawesome/free-solid-svg-icons";
import {handlePageChange, renderPaginationNumbers} from "@/utils/pagination.utils";
import CommentDropDown from "@/components/CommentDropDown";
import {useUser} from "@/context/UserContext";

export default function ReportComments({reportId}) {

    const [comments, setComments] = useState([{}]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [totalData, setTotalData] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        comment: "",
    })      
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [formError, setFormError] = useState({});
    const [touched, setTouched] = useState({});

    const { userData } = useUser()

    useEffect(() => {
        fetchComments() 
    }, [page, reportId])

    const fetchComments = async () => {
        try {
            setError (null);
            setLoading(true);
            const response = await listComments(reportId, 10, page, true);

            setComments(response.comments);
            setTotalPage(response.total_pages)
            setTotalData(response.total_data)
            setPageSize(response.page_size)
            setCurrentPage(response.current_page)
        } catch (e) {
            setError(e.message || 'Failed to fetch comments')
            console.error('Fetch reports error: ', e)
        } finally {
            setLoading(false)
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

    const handleBlur = (e) => {
        const { name } = e.target;
        const errors = validateField(name, form[name], createCommentsValidation);

        setFormError((prev) => ({ ...prev, [name]: errors }));
        setTouched((prev) => ({ ...prev, [name]: true }));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        const errors = validateField(name, value, createCommentsValidation);
        setFormError((prev) => ({ ...prev, [name]: errors }))
        setTouched((prev) => ({ ...prev, [name]: true }));
    }
    
    const onDeleteHandle = async (e, commentId) => {
        e.preventDefault();
        
        try {
            await deleteComment(commentId);
            await fetchComments();
        } catch (e) {
            console.error("Submit Error: ", e);
            setSubmitError("Failed to post a comment. Please try again!");
        }
    }

    const onSubmitHandle = async (e) => {
        e.preventDefault();
        setTouched(Object.keys(form).reduce((acc, key) => ({...acc, [key]: true}), {}))
        const {value: validateData, errors: validationErrors} = validate(createCommentsValidation, form);

        if (Object.keys(validationErrors).length > 0) return;

        setSubmitError(null);

        try {
            setIsSubmitting(true);

            await createComments(reportId, validateData);
            await fetchComments();
        } catch (e) {
            console.error("Submit Error: ", e);
            setSubmitError("Failed to post a comment. Please try again!");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800 mx-auto"></div>;
    }

    return (
        <div className=" p-6 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Komentar</h3>
            <div className="space-y-6">
                {!loading && comments.length === 0 && (
                    <>
                        <AlertInfo
                            message="Tidak ada Komentar saat ini"
                        />
                    </>
                )}
                {!loading && comments.length > 0 &&  (
                    <>
                        {comments.map((comment) => (
                            <div className="relative flex items-start rounded-md shadow gap-4 px-4 py-4 bg-white" key={comment.id}>
                                <Image
                                    src={comment.user.avatar}
                                    alt="foto laporan"
                                    width={100}
                                    height={100}
                                    className="w-15 h-15 rounded-full shadow border border-black object-contain"
                                    unoptimized
                                />

                                <div className="flex-1">
                                    <div className="flex justify-between items-start w-full">
                                        <p className="text-sm font-semibold text-gray-800">{comment.user.name}</p>
                                        <CommentDropDown onDelete={onDeleteHandle} commentId={comment.id} />
                                    </div>
                                    <p className="text-sm text-gray-700 mt-2">{comment.comment}</p>
                                    {userData && userData.id === comment.user_id && (
                                        <p className="text-xs text-gray-400 mt-4">
                                            <FontAwesomeIcon icon={faCalendar} size="sm" className="me-2" />
                                            {comment.created_at}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                        }
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
                    </>
                )}
                <form onSubmit={onSubmitHandle} className="flex flex-col mt-8 border-t">
                    <div className="flex items-start gap-4 pb-4 mt-8">
                        <textarea id="comment"
                              name="comment"
                              rows="4"
                              value={form.comment}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"></textarea>
                    </div>
                    {displayErrorForm("comment", formError, touched)}
                    <div className="flex items-center justify-end gap-x-6">
                        <button type="submit"
                                className="inline-flex items-end px-4 py-2 bg-blue-800 text-white text-sm font-medium rounded-md shadow hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            {isSubmitting ? 'Sedang Mengirim...' : 'Kirim'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}