import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'OfferOrbit | Make your next move count.',description:'Your personal command center for remote opportunities, meaningful outreach, and the next chapter of your career.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
