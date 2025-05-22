"use client";

import 'leaflet/dist/leaflet.css';
import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import NavAdmin from "@/components/NavAdmin";
import HeaderAdmin from "@/components/HeaderAdmin";
import ProfileForm from "@/components/ProfileForm";


export default function ReportFormPage() {

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
            <NavAdmin onMenuClick={handleMenuClick}/>
            <HeaderAdmin title={"Update Profile"}/>
            <ProfileForm />
        </div>
    );
}