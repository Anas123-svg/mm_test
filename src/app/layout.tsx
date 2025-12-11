import '@/styles/tailwind.css'
import { Metadata } from 'next'
// ⚠️ CHANGE: Added Google fonts using next/font/google
import { Agdasima, Poppins, Smooch_Sans } from 'next/font/google'
import 'rc-slider/assets/index.css'
import CustomizeControl from './customize-control'
import ThemeProvider from './theme-provider'

// ⚠️ CHANGE: Added Smooch Sans via next/font/google
const smoochSans = Smooch_Sans({
  subsets: ['latin'],
  weight: '700',
  display: 'swap',
})

// ⚠️ CHANGE: Added Agdasima via next/font/google
const agdasima = Agdasima({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    template: '%s - Chisfis',
    default: 'Chisfis - Booking online React Next.js template',
  },
  description: 'Booking online & rental online Next.js Template',
  keywords: ['Chisfis', 'Booking online', 'Rental online', 'React Next.js template'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // ⚠️ CHANGE: All fonts applied here. Removed multiple <link> loads.
    <html lang="en" className={` ${smoochSans.className} ${agdasima.className}`}>
      <head>
        {/* ⚠️ CHANGE: Removed Google Fonts <link> tags to prevent duplicate loading */}
        {/* ✅ Add Smooch Sans font here */}
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Smooch+Sans:wght@700&display=swap"
          rel="stylesheet"
        /> */}
      </head>

      <body className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
        <ThemeProvider>
          <div>
            {children}

            {/* For Chisfis's demo  -- you can remove it  */}
            <CustomizeControl />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
