'use client';

import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import axios from "@/config/axios.config";
import {AuthService} from "@/services/auth.service";

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams =  useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            AuthService.setToken(token);

            router.push('/dashboard')
        } else {
            router.push('/login')
        }
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-900">
            <div className="text-white text-center">
                <h2 className="text-2xl mb-4">Processing authentication...</h2>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
            </div>
        </div>

    )
}