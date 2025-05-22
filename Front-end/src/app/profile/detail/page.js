"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import NavAdmin from "@/components/NavAdmin";
import HeaderAdmin from "@/components/HeaderAdmin";
import ReportDetail from "@/components/ReportDetail";



export default function DetailReportPage() {
    const searchParams =  useSearchParams();
    const router = useRouter();
    const sectionParam = searchParams.get("path");

    const [activeSection, setActiveSection] = useState(sectionParam || "users");

    const handleMenuClick = (sectionName) => {
        setActiveSection(sectionName);
        router.push(`/${sectionName}`);
    }

    return (
        <div className="min-h-full">
            <NavAdmin onMenuClick={handleMenuClick}/>
            <HeaderAdmin title={"Detail Pengguna"}/>
            <ReportDetail />
        </div>
    );

}