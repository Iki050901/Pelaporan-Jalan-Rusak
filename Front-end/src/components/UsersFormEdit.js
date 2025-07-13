
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {AuthService} from "@/services/auth.service";
import {AlertInfo} from "@/components/AlertInfo";
import {getUser, updateUsers} from "@/services/users.service";
import {useRouter} from "next/navigation";
import {getLocationDistrict} from "@/services/report.service";

export default function UsersFormEdit({userId}) {

    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        number_phone: "",
        password: "",
        confirm_password: "",
        role_id: 3,
        district: "",
    });

    const [district, setDistrict] = useState([{}]);
    const [users, setUsers] = useState({});

    const [errors, setErrors] = useState(null);
    const [submitError, setSubmitError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    
    const fetchUser = async () => {
        try {
            setErrors(null)
            setLoading(true)
            const response = await getUser(userId)

            console.log(response)
            setUsers(response)
        } catch (e) {
            setErrors(e.message || 'Failed to fetch Profile')
            console.error('Fetch profile error: ', e)
        } finally {
            setLoading(false)
        }
    }

    const fetchDistrict = async () => {
        try {
            const response = await getLocationDistrict()
            console.log(response)
            setDistrict(response.result);
        } catch (e) {
            console.error('Fetch reports error: ', e)
        }
    }

    useEffect(() => {
        fetchDistrict();
    }, []);

    useEffect(() => {
        fetchUser();
    }, [userId])

    useEffect(() => {
        if (users) {
            setForm({
                name: users.name || "",
                email: users.email || "",
                number_phone: users.number_phone || "",
                password: "",
                confirm_password: "",
                role_id: users?.role?.id || 3,
                district: users.district || "",
            })
        }
    }, [users]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "role_id") {
            setForm(prev => ({ ...prev, role_id: Number(value) }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitError(null);

        try {
            await updateUsers(userId, form);
            await router.push("/users");
        } catch (error) {
            console.error("Submit error: ", error)
            setSubmitError(error)
        }
    };

    if (loading) {
        return <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800 mx-auto"></div>;
    }

    if (errors || submitError) {
        return (
            <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                <AlertInfo
                    title="Terjadi Kesalahan"
                    message={errors || submitError}
                    error={true}
                />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 relative">
                <div className="sm:col-span-4">
                    <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">Nama Pengguna</label>
                    <div className="mt-2">
                        <div
                            className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-800">
                            <input type="text" name="name" id="name" value={form.name}
                                   onChange={handleChange}
                                   className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"/>
                        </div>
                    </div>
                </div>
                <div className="sm:col-span-4 mt-10">
                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email</label>
                    <div className="mt-2">
                        <div
                            className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-800">
                            <input type="email" name="email" id="email" value={form.email}
                                   onChange={handleChange}
                                   className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"/>
                        </div>
                    </div>
                </div>
                <div className="sm:col-span-4 mt-10">
                    <label htmlFor="number_phone" className="block text-sm/6 font-medium text-gray-900">No. HP</label>
                    <div className="mt-2">
                        <div
                            className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-800">
                            <input type="text" name="number_phone" id="number_phone" value={form.number_phone}
                                   onChange={handleChange}
                                   className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"/>
                        </div>
                    </div>
                </div>
                <div className="sm:col-span-4 mt-10">
                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
                    <div className="mt-2">
                        <div
                            className="flex items-center relative rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-800">
                            <input type={showPassword ? 'text' : 'password'} name="password" id="password"
                                   value={form.password}
                                   onChange={handleChange}
                                   autoComplete="true"
                                   className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"/>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1.5 text-black"
                            >
                                {showPassword ? <FontAwesomeIcon icon={faEye}/> : <FontAwesomeIcon icon={faEyeSlash}/>}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="sm:col-span-4 mt-10">
                    <label htmlFor="confirm_password" className="block text-sm/6 font-medium text-gray-900">Confirm
                        Password</label>
                    <div className="mt-2">
                        <div
                            className="relative flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-800">
                            <input type={showPasswordConfirm ? 'text' : 'password'} name="confirm_password"
                                   id="confirm_password"
                                   value={form.confirm_password}
                                   onChange={handleChange}
                                   autoComplete="true"
                                   className="min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"/>
                            <button
                                type="button"
                                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                className="absolute right-2 top-1.5 text-black"
                            >
                                {showPasswordConfirm ? <FontAwesomeIcon icon={faEye}/> :
                                    <FontAwesomeIcon icon={faEyeSlash}/>}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-span-full mt-10">
                    <label htmlFor="role_id" className="block text-sm/6 font-medium text-gray-900">Role</label>
                    <div className="mt-2">
                        <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                            <select id="role_id"
                                    name="role_id"
                                    value={form.role_id}
                                    onChange={handleChange}
                                    aria-label="roles"
                                    className="col-start-1 row-start-1 w-full appearance-none outline-1 -outline-offset-1 outline-gray-300 rounded-md py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6">
                                <option value={3}>User</option>
                                <option value={2}>Kecamatan</option>
                                <option value={1}>PUPR</option>
                            </select>
                            <svg
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path fillRule="evenodd"
                                      d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                                      clipRule="evenodd"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="col-span-full mt-10">
                    {form.role_id === 2 && (
                        <div className="mt-4">
                            <label htmlFor="district_id" className="block text-sm font-medium text-gray-700">Pilih Kecamatan</label>
                            <select
                                id="district"
                                name="district"
                                value={form.district || ""}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 text-base shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">-- Pilih Kecamatan --</option>
                                {district.map((district) => (
                                    <option key={district.id} value={district.text}>
                                        {district.text}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="submit"
                            className="rounded-md bg-blue-800 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Submit
                    </button>
                </div>
            </div>
        </form>
    );
}