import Image from "next/image";
import profileImage  from "../../public/profile.png";

export default function ReportComments() {
    return (
        <div className=" p-6 border-t bg-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Komentar</h3>

            <div className="space-y-6">

                <div className="flex items-start gap-4 pb-4">
                    <img src={profileImage} alt="User1" className="w-10 h-10 rounded-full"/>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">User1</p>
                        <p className="text-sm text-gray-700">Saya juga sempat hampir terjatuh di lokasi ini. Mohon
                            segera diperbaiki.</p>
                    </div>
                </div>


                <div className="flex items-start gap-4 pb-4">
                    <img src={profileImage} alt="User1" className="w-10 h-10 rounded-full"/>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">User1</p>
                        <p className="text-sm text-gray-700">Saya juga sempat hampir terjatuh di lokasi ini. Mohon
                            segera diperbaiki.</p>
                    </div>
                </div>


                <div className="flex items-start gap-4 pb-4">
                    <img src={profileImage} alt="User1" className="w-10 h-10 rounded-full"/>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">User1</p>
                        <p className="text-sm text-gray-700">Saya juga sempat hampir terjatuh di lokasi ini. Mohon
                            segera diperbaiki.</p>
                    </div>
                </div>

                <form className="flex flex-col">
                    <div className="flex items-start gap-4 pb-4">
                        <img src={profileImage} alt="User1" className="w-10 h-10 rounded-full"/>
                        <textarea id="comment" name="comment" rows="4" required
                                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"></textarea>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="submit"
                                className="inline-flex mt-4 items-end px-4 py-2 bg-blue-800 text-white text-sm font-medium rounded-md shadow hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Kirim Komentar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}