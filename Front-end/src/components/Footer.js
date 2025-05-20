"use client"

export default function Footer() {
    return (
        <footer className="bg-blue-900 text-white text-sm">
            <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center">
                <p>&copy; {new Date().getFullYear()} Dinas Pekerjaan Umum. All rights reserved.</p>
                <div className="flex space-x-4 mt-2 sm:mt-0">
                    <h1 className="font-bold text-white">LAPOR!</h1>
                </div>
            </div>
        </footer>
    )
}