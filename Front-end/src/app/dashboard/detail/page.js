"use client";

import ReportContent from "@/components/ReportContent";
import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import NavAdmin from "@/components/NavAdmin";
import HeaderAdmin from "@/components/HeaderAdmin";

export default function DetailPage() {

    const searchParams =  useSearchParams();
    const router = useRouter();
    const sectionParam = searchParams.get("path");

    const [activeSection, setActiveSection] = useState(sectionParam || "dashboard");

    const handleMenuClick = (sectionName) => {
        setActiveSection(sectionName);
        router.push(`/${sectionName}`);
    }

    return (
        <div className="bg-gray-100 min-h-full ">
            <NavAdmin onMenuClick={handleMenuClick} active={activeSection}/>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 mt-10 shadow-lg bg-white ">
                <ReportContent />
            </div>
        </div>

    )
}