import React from "react"
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'

import './globals.css'

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Learning Hub',
  description: 'A modern learning management platform for students and educators. Manage courses, assignments, quizzes, and more.',
  icons: {
    icon: '/LearningHub.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a9a8a',
}

const themeScript = `
(function(){
  try {
    var mode = localStorage.getItem('lh-theme-mode');
    var color = localStorage.getItem('lh-theme-color');
    var hc = localStorage.getItem('lh-high-contrast');
    var html = document.documentElement;
    if (mode === '0') html.classList.remove('dark');
    else if (mode === '2') html.classList.add('dark');
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) html.classList.add('dark');
    if (color && color !== 'teal') html.classList.add('theme-' + color);
    if (hc === 'true') html.classList.add('high-contrast');
  } catch(e) {}
})();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={display.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
