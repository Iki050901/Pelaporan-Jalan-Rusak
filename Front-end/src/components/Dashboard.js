import ReportCard from "@/components/ReportCard";

export default function Dashboard() {

    const handleView = () => alert('Lihat detail laporan');
    const handleComment = () => alert('Komentar pada laporan');

    return (
        <main>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <ReportCard
                    title="Jalan Berlubang di Jl. Merdeka"
                    status="Belum ditindak lanjuti"
                    location="Jakarta Timur"
                    user="Acull"
                    description='Terdapat lubang besar di tengah jalan yang sangat membahayakan pengendara motor saat malam hari...'
                    date="4 Mei 2025"
                    onView={handleView}
                    onComment={handleComment}
                />
            </div>
        </main>
    )
}