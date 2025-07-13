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
            <div className="max-w-7xl p-4 mx-auto space-y-8">
                <Hero />
            </div>
            <div className="max-w-4xl mx-auto space-y-8">
                <StatisticReport />
            </div>
            <div className="bg-gray-300">
                <div className="max-w-7xl mx-auto p-4 space-y-8 ">
                    <MyMap />
                </div>
            </div>
            <div className="mx-auto px-4 py-10 sm:px-6 lg:px-20 space-y-8">
                <HowTo/>
            </div>
            <Footer />
        </div>
    )
}