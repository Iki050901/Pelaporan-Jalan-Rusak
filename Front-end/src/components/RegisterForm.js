'use client';

import { useState } from 'react';
import {
    faEye,
    faEyeSlash,
    faLock,
} from '@fortawesome/free-solid-svg-icons';

import { faGoogle } from '@fortawesome/free-brands-svg-icons';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/navigation";
import {getApiUrl} from "@/config/api.config";
import {AuthService} from "@/services/auth.service";
import AlertPopUp from "@/components/AlertPopUp";
import {errorFormater} from "@/utils/error-utils";

export default function RegisterForm() {

    const router = useRouter();

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "",
        number_phone: "",
        email: "",
        password: "",
        confirm_password: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            form.number_phone = form.number_phone?.toString()
            const response = await AuthService.registerUser(form);
            AuthService.setToken(response.token.token);

            setSuccess("Akun berhasil dibuat!");

            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        } catch (e) {
            console.error('Register error: ', e);
            const errorFormatted = errorFormater(e)
            setError(errorFormatted);
        }
    }

    const handleGotoLoginClick = (e) => {
        e.preventDefault();
        router.push('/login');
    }


    const [showPassword, setShowPassword] = useState(false);

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center p-4">
            {error && (
                <AlertPopUp
                    message={error}
                    type="error"
                    duration={5000}
                    onClose={() => setError("")}
                />
            )}
            {success && (
                <AlertPopUp
                    message={success}
                    type="success"
                    duration={2000}
                    onClose={() => setSuccess("")}
                />
            )}
            <div className="bg-indigo-900 text-white rounded-3xl p-8 w-full max-w-md shadow-lg relative">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Masukkan email"
                            name="email"
                            onChange={handleChange}
                            value={form.email}
                            required={true}
                            className="w-full px-4 py-2 rounded-md text-white focus:outline-none"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1">Nama</label>
                        <input
                            type="text"
                            placeholder="Masukkan Nama"
                            name="name"
                            onChange={handleChange}
                            value={form.name}
                            required={true}
                            className="w-full px-4 py-2 rounded-md text-white focus:outline-none"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1">No. HP</label>
                        <input
                            type="number"
                            placeholder="Masukan No. HP"
                            name="number_phone"
                            onChange={handleChange}
                            value={form.number_phone}
                            required={true}
                            className="w-full px-4 py-2 rounded-md text-white focus:outline-none"
                        />
                    </div>

                    <div className="mb-4 relative">
                        <label className="block mb-1">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Masukkan Password"
                            name="password"
                            onChange={handleChange}
                            value={form.password}
                            required={true}
                            className="w-full px-4 py-2 rounded-md text-white pr-10 focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-9 text-white"
                        >
                            {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                        </button>
                    </div>

                    <div className="mb-4 relative">
                        <label className="block mb-1">Confirm Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Masukkan Confirm Password"
                            name="confirm_password"
                            onChange={handleChange}
                            value={form.confirm_password}
                            required={true}
                            className="w-full px-4 py-2 rounded-md text-white pr-10 focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-9 text-white"
                        >
                            {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-yellow-400 hover:bg-yellow-500 py-2 rounded-md font-semibold"
                    >
                        Masuk
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <FontAwesomeIcon className="mr-2" icon={faGoogle} />
                    <a href="#" className=" text-white hover:underline font-bold">
                         Register With Google
                    </a>
                    <span className="block mt-2">Have an account ?<a href="#" onClick={handleGotoLoginClick} className=" text-white font-bold hover:underline"> Login
                    </a></span>
                </div>
            </div>
        </div>
    );
}