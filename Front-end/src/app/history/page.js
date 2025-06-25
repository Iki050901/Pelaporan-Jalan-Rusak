"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import ReportHistory from "@/components/ReportHistory";
import NavAdmin from "@/components/NavAdmin";
import HeaderAdmin from "@/components/HeaderAdmin";

export default function HistoryPage() {

    const searchParams = useSearchParams();
    const router = useRouter();
    const sectionParam = searchParams.get("section");

    const [activeSection, setActiveSection] = useState(sectionParam || "history");

    const handleMenuClick = (sectionName) => {
        setActiveSection(sectionName);
        router.push(`/${sectionName}`);
    }

    return (
        <div className="min-h-full">
            <NavAdmin onMenuClick={handleMenuClick} active={activeSection}/>
            <HeaderAdmin title={activeSection}/>
            <ReportHistory />
        </div>
    )
}