import "@/app/globals.css"
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import {UserProvider} from "@/context/UserContext";
import { Rubik } from "next/font/google";
config.autoAddCss = false

export const metadata = {
    title: 'Laporkan Jalan Rusak!',
    description: 'Platform pelaporan publik',
};

const rubik = Rubik({
    subsets: ['latin'],
    variable: '--font-rubik',
});

export default function RootLayout({ children }) {
    return (
        <html lang="id" className={rubik.variable}>
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
            <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
                  rel="stylesheet"/>
            <link rel="shortcut icon" href="/images/ico/"/>

            <link rel="apple-touch-icon-precomposed" sizes="57x57" href="/images/ico/apple-touch-icon-57x57.png" />
            <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/images/ico/apple-touch-icon-114x114.png" />
            <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/images/ico/apple-touch-icon-72x72.png" />
            <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/images/ico/apple-touch-icon-144x144.png" />
            <link rel="apple-touch-icon-precomposed" sizes="60x60" href="/images/ico/apple-touch-icon-60x60.png" />
            <link rel="apple-touch-icon-precomposed" sizes="120x120" href="/images/ico/apple-touch-icon-120x120.png" />
            <link rel="apple-touch-icon-precomposed" sizes="76x76" href="/images/ico/apple-touch-icon-76x76.png" />
            <link rel="apple-touch-icon-precomposed" sizes="152x152" href="/images/ico/apple-touch-icon-152x152.png" />
            <link rel="icon" type="image/png" href="/images/ico/favicon-196x196.png" sizes="196x196" />
            <link rel="icon" type="image/png" href="/images/ico/favicon-96x96.png" sizes="96x96" />
            <link rel="icon" type="image/png" href="/images/ico/favicon-32x32.png" sizes="32x32" />
            <link rel="icon" type="image/png" href="/images/ico/favicon-16x16.png" sizes="16x16" />
            <link rel="icon" type="image/png" href="/images/ico/favicon-128.png" sizes="128x128" />
            <meta name="application-name" content="&nbsp;"/>
            <meta name="msapplication-TileColor" content="#FFFFFF" />
            <meta name="msapplication-TileImage" content="mstile-144x144.png" />
            <meta name="msapplication-square70x70logo" content="mstile-70x70.png" />
            <meta name="msapplication-square150x150logo" content="mstile-150x150.png" />
            <meta name="msapplication-wide310x150logo" content="mstile-310x150.png" />
            <meta name="msapplication-square310x310logo" content="mstile-310x310.png" />

            <title>Lapor Jalan</title>
        </head>
        <body className="bg-gray-50 font-sans">
        <UserProvider>
            {children}
        </UserProvider>
        </body>
        </html>
    );
}