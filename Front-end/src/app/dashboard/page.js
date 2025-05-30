"use client";

import NavAdmin from "@/components/NavAdmin";
import HeaderAdmin from "@/components/HeaderAdmin";
import Dashboard from "@/components/Dashboard";
import {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";

export default function DashboardPage() {

    const searchParams =  useSearchParams();
    const router = useRouter();
    const sectionParam = searchParams.get("path");

    const [activeSection, setActiveSection] = useState(sectionParam || "dashboard");

    const handleMenuClick = (sectionName) => {
        setActiveSection(sectionName);
        router.push(`/${sectionName}`);
    }

    return (
        <div className="min-h-full">
            <NavAdmin onMenuClick={handleMenuClick} active={activeSection}/>
            <HeaderAdmin title={activeSection}/>
            <Dashboard />
        </div>
    )
}