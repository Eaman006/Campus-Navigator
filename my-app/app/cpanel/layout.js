import { Geist, Geist_Mono } from "next/font/google";
import Adminnav from "../Components/Adminnav";
import Adminside from "../Components/Adminside";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Campus Navigator | VIT Bhopal",
  description: "This is a campus navigator app for the students of vit bhopal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Adminnav />
        <Adminside />                
        {children}
      </body>
    </html>
  );
}
