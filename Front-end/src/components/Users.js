import {useRouter} from "next/navigation";
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function Users() {

    const users = [
        {
            name: 'Acull',
            email: 'acull@gmail.com',
            address: 'Surabaya',
            number_phone: '0878822821221',
            roles: 'PUPR',
        },
        {
            name: 'Acull',
            email: 'acull@gmail.com',
            address: 'Surabaya',
            number_phone: '0878822821221',
            roles: 'PUPR',
        },
        {
            name: 'Acull',
            email: 'acull@gmail.com',
            address: 'Surabaya',
            number_phone: '0878822821221',
            roles: 'PUPR',
        },
    ];

    const router = useRouter();

    const handleCreateClick = () => {
        router.push('/users/create');
    }

    const handleDetailClick = () => {
        router.push('/users/detail');
    }

    const handleEditClick = () => {
        router.push('/users/update');
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
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Alamat</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nomor HP</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Aksi</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {users.map((user, idx) => (
                                <tr key={idx}>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">{user.name}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{user.email}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{user.address}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{user.number_phone}</td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{user.roles}</td>
                                    <td className="whitespace-nowrap px-2 py-4 text-right text-sm">
                                        <a href="/users/update" onClick={handleEditClick}  className="text-blue-800 hover:text-blue-900 font-medium">Edit</a>
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-4 text-right text-sm">
                                        <a href="/users/detail" onClick={handleDetailClick}  className="text-blue-800 hover:text-blue-900 font-medium">Detail</a>
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