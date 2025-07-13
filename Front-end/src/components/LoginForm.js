'use client';

import { useState } from 'react';
import {
    faEye,
    faEyeSlash,
    faLock,
} from '@fortawesome/free-solid-svg-icons';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/navigation";
import axios from "axios";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {API_CONFIG, getApiUrl} from "@/config/api.config";
import {AuthService} from "@/services/auth.service";
import AlertPopUp from "@/components/AlertPopUp";
import {errorFormater} from "@/utils/error-utils";

export default function LoginForm() {

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleLoginClick = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(getApiUrl(API_CONFIG.endpoints.auth.login), form);
            AuthService.setToken(response.data.data.token.token);

            setSuccess("Login Berhasil!");

            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        } catch (e) {
            console.error('Login error: ', e)
            const errorFormated = errorFormater(e.response?.data?.errors)
            console.error(errorFormated)
            setError(errorFormated)
        }
    }

    const handleGoogleLogin = () => {
        localStorage.setItem('returnUrl', window.location.pathname);
        window.location.href = getApiUrl(API_CONFIG.endpoints.auth.google);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    }

    const handleRegisterClick = () => {
        router.push('/register');
    }

    return (
        <div >
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
            <div className="bg-indigo-20 text-white rounded-3xl p-8 w-full max-w-md shadow-lg relative">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
                <form onSubmit={handleLoginClick}>
                    <div className="mb-4">
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Masukkan email"
                            name="email"
                            required
                            className="w-full px-4 py-2 rounded-md text-white focus:outline-none"
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label className="block mb-1">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Masukkan Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            name="password"
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
                        className="w-full bg-yellow-400 hover:bg-yellow-500 py-2 rounded-md font-semibold">
                        Masuk
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <FontAwesomeIcon className="mr-2" icon={faGoogle} />
                    <a href="#" onClick={handleGoogleLogin} className=" text-white hover:underline font-bold">
                         Login With Google
                    </a>
                    <span className="block mt-2">Not have an account ?<a href="#" onClick={handleRegisterClick} className=" text-white font-bold hover:underline"> Register
                    </a></span>
                </div>
            </div>
        </div>
    );
}