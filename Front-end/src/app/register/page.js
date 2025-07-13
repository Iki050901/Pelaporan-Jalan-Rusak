"use client"

import Banner from "@/components/Banner";
import RegisterForm from "@/components/RegisterForm";

export default function LoginPage() {
    return (
        <div>
            <Banner login={true}/>
            <div style={{ backgroundImage: "url('/bg-login.svg')" }}>
                <div className="max-w-4xl mx-auto p-4 space-y-8">
                    <RegisterForm />
                </div>
            </div>
        </div>
    )
}