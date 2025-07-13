"use client"

import Image from "next/image";

export default function TutorialCard({title, desc, icon}) {

    return (
        <div className="max-w-xl px-3 lg:px-4">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                 aria-hidden="true">
            </div>
            <div className="flex flex-col ">
                <div className="flex flex-col bg-white rounded-xl shadow-md p-6 h-full min-h-[240px]">
                    {/* Judul + Icon */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-gray-900">{title}</h2>
                        <div className="bg-yellow-400 p-3 text-white rounded-md">
                            <Image
                                src={icon}
                                unoptimized
                                width={35}
                                height={35}
                                className="w-[35px] h-auto"
                                alt="Icon"
                            />
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="text-sm text-gray-600">
                        <div className="tracking-tight prose" dangerouslySetInnerHTML={{ __html: desc }} />
                    </div>
                </div>
            </div>
            <div
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                aria-hidden="true">
            </div>
        </div>
    )
}
