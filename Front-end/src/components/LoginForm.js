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

export default function LoginForm() {

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
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
            router.push('/dashboard');
        } catch (e) {
            console.error('Login error: ', e)
            setError(e.response.data.errors)
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
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4">
            {error && (
                <AlertPopUp
                    message={error}
                    type="error"
                    duration={5000}
                    onClose={() => setError("")}
                />
            )}
            <div className="bg-indigo-900 text-white rounded-3xl p-8 w-full max-w-md shadow-lg relative">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
                <form>
                    <div className="mb-4">
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Masukkan email"
                            name="email"
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
                        onClick={handleLoginClick}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 py-2 rounded-md font-semibold"
                    >
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