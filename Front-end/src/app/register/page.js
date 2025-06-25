"use client"

import Banner from "@/components/Banner";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
    return (
        <div>
            <Banner login={true}/>
            <div style={{ backgroundImage: "url('/bg-login.svg')" }}>
                <div className="max-w-4xl mx-auto p-4 space-y-8">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}