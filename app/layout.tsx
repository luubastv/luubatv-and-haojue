import type {Metadata} from "next";import "./globals.css";
export const metadata:Metadata={title:"Luuba Connect",description:"Uganda's home for stories, conversations and creators."};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
