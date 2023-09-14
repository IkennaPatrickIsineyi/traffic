/* 'use client' */

import LandingLayout from "./LandingLayout"

//import { Inter } from 'next/font/google' 


//const inter = Inter({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'] })



export const metadata = {
    title: 'VeheDaTrack',
    description: 'VeheDaTrack watches',
}

export default function RootLayout({ children }) {
    return (
        <html  >
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" /* crossOrigin */ />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&family=Open+Sans:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet" />
            </head>
            <body /* className={inter.className} */ style={{ padding: 0, margin: 0 }}>
                <LandingLayout>{children}</LandingLayout>
            </body>
        </html>
    )
}
