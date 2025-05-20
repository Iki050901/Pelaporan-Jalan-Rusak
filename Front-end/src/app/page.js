import Banner from "@/components/Banner";
import Jumbotron from "@/components/Jumbotron";
import Footer from "@/components/Footer";

import dynamic from "next/dynamic"

const MyMap = dynamic(() => import("@/components/Map"), {
    ssr: !!false,
});


export default function Home() {
    return (
        <div>
            <Banner isLogin={false}/>
            <div className="max-w-4xl mx-auto p-4 space-y-8">
                <Jumbotron />
            </div>
            <div className="bg-gray-300">
                <div className="max-w-7xl mx-auto p-4 space-y-8 ">
                    <MyMap />
                </div>
            </div>
            <Footer />
        </div>
    )
}