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

export default function LoginForm() {

    const router = useRouter();

    const handleLoginClick = () => {
        router.push('/dashboard');
    }

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center p-4">
            <div className="bg-indigo-900 text-white rounded-3xl p-8 w-full max-w-md shadow-lg relative">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

                <form>
                    <div className="mb-4">
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Masukkan email"
                            className="w-full px-4 py-2 rounded-md text-white focus:outline-none"
                        />
                    </div>

                    <div className="mb-4 relative">
                        <label className="block mb-1">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Masukkan Password"
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
                    <a href="#" className=" text-white hover:underline font-bold">
                         Login With Google
                    </a>
                    <span className="block mt-2">Not have an account ?<a href="#" className=" text-white font-bold hover:underline"> Register
                    </a></span>
                </div>
            </div>
        </div>
    );
}