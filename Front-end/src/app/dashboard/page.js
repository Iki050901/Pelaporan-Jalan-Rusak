"use client";

import NavAdmin from "@/components/NavAdmin";
import HeaderAdmin from "@/components/HeaderAdmin";
import Dashboard from "@/components/Dashboard";
import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import axios from "@/config/axios.config";
import {API_CONFIG, getApiUrl} from "@/config/api.config";
import {AuthService} from "@/services/auth.service";
import {withAuth} from "@/components/withAuth";
import {useUser} from "@/context/UserContext";
import dynamic from "next/dynamic";

const MyMap = dynamic(() => import("@/components/Map"), {
    ssr: !!false,
});

function DashboardPage() {

    const { userData, setUserData } = useUser();

    const searchParams =  useSearchParams();
    const router = useRouter();
    const sectionParam = searchParams.get("path");

    const [activeSection, setActiveSection] = useState(sectionParam || "dashboard");

    const handleMenuClick = (sectionName) => {
        setActiveSection(sectionName);
        router.push(`/${sectionName}`);
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(getApiUrl(API_CONFIG.endpoints.user.profile));
                setUserData(response.data);

                console.log(response.data);
                AuthService.setRefreshToken(response.data.data.refresh_token.refresh_token)
            } catch (e) {
                console.error('Fetch user data error: ', e)
            }
        }
        fetchUserData();
    }, [])

    return (
        <div className="min-h-full">
            <NavAdmin onMenuClick={handleMenuClick} active={activeSection}/>
            <HeaderAdmin title={activeSection}/>
            <div className="max-w-7xl mx-auto p-4 space-y-8 ">
                <MyMap />
            </div>
            <Dashboard />
        </div>
    )
}

export default withAuth(DashboardPage);