import "@/app/globals.css"
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export const metadata = {
    title: 'Lapor Clone',
    description: 'Platform pelaporan publik',
};

export default function RootLayout({ children }) {
    return (
        <html lang="id">
        <body className="bg-gray-50 font-sans">{children}</body>
        </html>
    );
}