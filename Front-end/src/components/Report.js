import {useRouter} from "next/navigation";


export default function Report() {

    const reports = [
        {
            name: 'Jalan Berlubang di Jl. Melati',
            location: 'Surabaya',
            status: 'Belum Ditangani',
            image: 'https://source.unsplash.com/100x100/?road,hole',
        },
        {
            name: 'Trotoar Rusak Dekat Pasar',
            location: 'Bandung',
            status: 'Diproses',
            image: 'https://source.unsplash.com/100x100/?sidewalk,damage',
        },
        {
            name: 'Aspal Mengelupas',
            location: 'Jakarta Selatan',
            status: 'Selesai',
            image: 'https://source.unsplash.com/100x100/?pothole,asphalt',
        },
    ];

    const router = useRouter();

    const handleCreateClick = () => {
        router.push('/report/create');
    }

    const handleEditClick = () => {
        router.push('/report/update');
    }

    const handleDetailClick = () => {
        router.push('/report/detail');
    }

    return (
        <>
            <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center justify-between">
                    <button onClick={handleCreateClick} className="mt-4 sm:mt-0 inline-flex items-center rounded-md bg-blue-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-900">
                        + Tambah Laporan
                    </button>
                </div>

                <div className="mt-6 flow-root">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Laporan</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Lokasi</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Foto</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Aksi</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {reports.map((report, idx) => (
                                <tr key={idx}>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">{report.name}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{report.location}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                        <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                report.status === 'Selesai'
                                    ? 'bg-green-100 text-green-800'
                                    : report.status === 'Diproses'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {report.status}
                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4">
                                        <img src={report.image} alt="foto jalan" className="w-16 h-16 rounded object-cover" />
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-4 text-right text-sm">
                                        <a href="#" onClick={handleEditClick}  className="text-blue-800 hover:text-blue-900 font-medium">Edit</a>
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-right text-sm">
                                        <a href="#" onClick={handleDetailClick}  className="text-blue-800 hover:text-blue-900 font-medium">Detail</a>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}