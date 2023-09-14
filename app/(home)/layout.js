/* 'use client' */

import LandingLayout from './LandingLayout'

export const metadata = {
    title: 'VeheDaTrack',
    description: 'VeheDaTrack watches',
}

export default function RootLayout({ children }) {
    return (
        <html  >
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&family=Open+Sans:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet" />
            </head>
            <body style={{ padding: 0, margin: 0 }}>
                <LandingLayout>{children}</LandingLayout>
            </body>
        </html>
    )
}
