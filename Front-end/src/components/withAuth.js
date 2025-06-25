'use client';

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {AuthService} from "@/services/auth.service";

export function withAuth(WrappedComponent) {
    return function ProtectedRouter(props) {
        const router = useRouter();
        const [isLoading, setIsLoading] = useState(true);


        useEffect(() => {
            const token = AuthService.getToken();
            if (!token) {
                localStorage.setItem('returnUrl', window.location.pathname);
                router.push('/login');
            } else {
                setIsLoading(false);
            }
        }, [router]);

        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-indigo-900">
                    <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
                    </div>
                </div>
            );
        }

        return <WrappedComponent {...props} />
    }
}