import Banner from "@/components/Banner";
import StatisticReport from "@/components/StatisticReport";
import Footer from "@/components/Footer";

import dynamic from "next/dynamic"
import Hero from "@/components/Hero";
import About from "@/components/About";
import HowTo from "@/components/HowTo";
import PuprAbout from "@/components/PuprAbout";

const MyMap = dynamic(() => import("@/components/Map"), {
    ssr: !!false,
});


export default function Home() {
    return (
        <div>
            <Banner isLogin={false}/>
            <div className="bg-yellow-000 px-4 py-10 sm:px-6 lg:px-20">
                <div className="mx-auto space-y-8">
                    <About />
                </div>
            </div>
            <div className="bg-gray-100 px-4 py-10 sm:px-6 lg:px-20">
                <div className="max-w-8xl mx-auto space-y-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-10 text-center">
                        <span className="text-gray-400">Sekilas Mengenai</span>
                        <br />
                        <span className="text-blue-900">PUPR Kabupaten Garut</span>
                    </h1>
                    <PuprAbout/>
                </div>
            </div>
            <Footer />
        </div>
    )
}