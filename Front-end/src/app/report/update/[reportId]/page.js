"use client";

import 'leaflet/dist/leaflet.css';
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import NavAdmin from "@/components/NavAdmin";
import HeaderAdmin from "@/components/HeaderAdmin";
import ReportForm from "@/components/ReportForm";
import ReportFormEdit from "@/components/ReportFormEdit";


export default function ReportFormPage() {

    const searchParams =  useSearchParams();
    const router = useRouter();
    const sectionParam = searchParams.get("path");

    const [activeSection, setActiveSection] = useState(sectionParam || "report");

    const handleMenuClick = (sectionName) => {
        setActiveSection(sectionName);
        router.push(`/${sectionName}`);
    }

    const { reportId } = useParams();

    return (
        <div className="min-h-full">
            <NavAdmin onMenuClick={handleMenuClick} active={activeSection}/>
            <HeaderAdmin title={"Edit Laporan"}/>
            <ReportFormEdit reportId={reportId} />
        </div>
    );
}