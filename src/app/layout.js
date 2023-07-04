import './globals.css'
import { Chewy } from 'next/font/google'

const chewy = Chewy({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})
export const metadata = {
  title: 'GeoBook',
  description: 'Discuss The Fun of Traveling',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={chewy.className}>{children}</body>
    </html>
  )
}
