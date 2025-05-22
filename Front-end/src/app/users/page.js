"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import Dashboard from "@/components/Dashboard";
import Report from "@/components/Report";
import ReportHistory from "@/components/ReportHistory";
import NavAdmin from "@/components/NavAdmin";
import HeaderAdmin from "@/components/HeaderAdmin";
import Users from "@/components/Users";


export default function ReportPage() {

    const searchParams =  useSearchParams();
    const router = useRouter();
    const sectionParam = searchParams.get("section");

    const [activeSection, setActiveSection] = useState(sectionParam || "users");

    const handleMenuClick = (sectionName) => {
        setActiveSection(sectionName);
        router.push(`/${sectionName}`);
    }

    return (
        <div className="min-h-full">
            <NavAdmin onMenuClick={handleMenuClick} active={activeSection}/>
            <HeaderAdmin title={activeSection}/>
            <Users />
        </div>
    )
}