"use client";

import NavAdmin from "@/components/NavAdmin";
import HeaderAdmin from "@/components/HeaderAdmin";
import Dashboard from "@/components/Dashboard";
import Report from "@/components/Report";
import {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import ReportHistory from "@/components/ReportHistory";


export default function DashboardPage() {

    const searchParams =  useSearchParams();
    const router = useRouter();
    const sectionParam = searchParams.get("section");

    const [activeSection, setActiveSection] = useState(sectionParam || "Dashboard");

    const handleMenuClick = (sectionName) => {
        setActiveSection(sectionName);
        router.push(`?section=${sectionName}`);
    }

    const renderSection = () => {
        switch (activeSection) {
            case "Dashboard":
                return <Dashboard />;
            case "Report":
                return <Report />;
            case "History":
                return <ReportHistory />;
            default:
                return <Dashboard />;
        }
    }

    return (
        <div className="min-h-full">
            <NavAdmin onMenuClick={handleMenuClick} active={activeSection}/>
            <HeaderAdmin title={activeSection}/>
            {renderSection()}
        </div>
    )
}