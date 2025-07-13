
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {AuthService} from "@/services/auth.service";
import {AlertInfo} from "@/components/AlertInfo";
import AlertPopUp from "@/components/AlertPopUp";
import {validateForm} from "@/validation/validation";
import {createReportValidation} from "@/validation/report.validation";
import Image from "next/image";

export default function ProfileForm() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        number_phone: "",
        password: "",
        confirm_password: "",
        avatar: null
    });

    const [profile, setProfile] = useState({});

    const [errors, setErrors] = useState(null);
    const [submitError, setSubmitError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [success, setSuccess] = useState("");

    const [avatarPreview, setAvatarPreview] = useState("");
    
    const fetchProfile = async () => {
        try {
            setErrors(null)
            setLoading(true)
            const response = await AuthService.getUser()

            console.log(response)
            setProfile(response)
        } catch (e) {
            setErrors(e.message || 'Failed to fetch Profile')
            console.error('Fetch profile error: ', e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfile();
    }, [])

    useEffect(() => {
        if (profile) {
            setForm({
                name: profile.name || "",
                email: profile.email || "",
                number_phone: profile.number_phone || "",
                password: "",
                confirm_password: "",
                avatar: profile.avatar || "",
            })
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "avatar") {
            const avatar = files[0];

            if (avatar) {
                const preview = URL.createObjectURL(avatar);
                setForm((prev) => ({ ...prev, avatar: avatar }));
                setAvatarPreview(preview)
            }
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitError(null);

        try {
            const formData = new FormData();
            formData.append("profile_data", JSON.stringify({
                ...form
            }))

            await AuthService.updateUser(formData);
            await fetchProfile()
            setSuccess("Profile berhasil di update")
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
                {success && (
                    <AlertPopUp
                        message={success}
                        type="success"
                        duration={5000}
                        onClose={() => setSuccess("")}
                    />
                )}
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
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-900">Photo</label>
                    <div className="mt-2 flex items-center gap-x-3">
                        <Image
                            className="size-12 rounded-full border"
                            src={avatarPreview || profile.avatar || "/images/default-avatar.png"}
                            width={48}
                            height={48}
                            alt="Preview"
                            unoptimized
                        />
                        <label
                            htmlFor="avatar"
                            className="rounded-md cursor-pointer bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                        >
                            Change
                            <input
                                id="avatar"
                                name="avatar"
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                className="sr-only"
                            />
                        </label>
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
                                   id="confirm_password" value={form.confirm_password}
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
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="submit"
                            className="rounded-md bg-blue-800 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Submit
                    </button>
                </div>
            </div>
        </form>
    );
}