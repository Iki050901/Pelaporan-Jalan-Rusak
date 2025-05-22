"use client";

import {useEffect, useState} from "react";
import L from "leaflet";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";

export default function ProfileForm({ initialData = null }) {

    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
        confirm_password: "",
        number_phone: "",
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || "",
                email: initialData.email || "",
                address: initialData.address || "",
                password: initialData.password || "",
                confirm_password: initialData.confirm_password || "",
                number_phone: initialData.number_phone || "",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name } = e.target;

        setForm(prev => ({ ...prev, [name]: value }));
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 relative">
                <div className="sm:col-span-4">
                    <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">Nama
                        Pengguna</label>
                    <div className="mt-2">
                        <div
                            className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-800">
                            <input type="text" name="name" id="name" value={form.name}
                                   onChange={(e) => setForm(prev => ({...prev, name: e.target.value}))}
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
                                   onChange={(e) => setForm(prev => ({...prev, password: e.target.value}))}
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
                                   onChange={(e) => setForm(prev => ({...prev, confirm_password: e.target.value}))}
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
                    <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900">Alamat</label>
                    <div className="mt-2">
                            <textarea name="address" id="address" rows="3" value={form.address}
                                      onChange={(e) => setForm(prev => ({...prev, address: e.target.value}))} required
                                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"></textarea>
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