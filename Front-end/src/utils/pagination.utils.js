

export const handlePageChange = (newPage, totalPage, setPage) => {
    if (newPage > 0 && newPage <= totalPage) {
        setPage(newPage);
    }
}

export const renderPaginationNumbers = (currentPage, totalPage, setPage) => {
    const pages = []
    const maxVisitePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisitePages / 2));
    let endPage = Math.min(totalPage, startPage + maxVisitePages - 1);

    if (endPage - startPage + 1 > maxVisitePages) {
        startPage = Math.max(1, totalPage - maxVisitePages + 1);
    }

    if (startPage > 1) {
        pages.push(
            <a key={1} href="#" onClick={() => {
                e.preventDefault()
                handlePageChange(1, totalPage, setPage)
            }} className="relative inline-flex items-center
               px-4 py-2 text-sm font-semibold text-gray-900 ring-1
               ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20
               focus:outline-offset-0">1</a>
        );
        if (startPage > 2) {
            pages.push(
                <span key="start-ellipsis" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0">
                        ...
                    </span>
            );
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(
            <a key={i} href="#" onClick={(e) => {
                e.preventDefault()
                handlePageChange(i, totalPage, setPage)
            }} aria-current={currentPage === i ? "page" : undefined}
               className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                   currentPage === i
                       ? 'z-10 bg-indigo-600 text-white focus-visible:outline-indigo-600'
                       : 'text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50'
               } focus:z-20 focus:outline-offset-0`}>
                {i}
            </a>
        )
    }

    if (endPage < totalPage) {
        if (endPage < totalPage - 1) {
            pages.push(
                <span key="end-ellipsis" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0">
                        ...
                   </span>
            );
        }
        pages.push(
            <a key={totalPage} href="#" onClick={(e) => {
                e.preventDefault();
                handlePageChange(totalPage, totalPage, setPage);
            }}
               className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                {totalPage}
            </a>
        );
    }
    return pages;
}