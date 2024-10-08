import QueryClientWrapper from "@/components/QueryClientWrapper";
import { montserrat } from "../components/ui/fonts";
import "../components/ui/global.css";
import corsMiddleware from "./lib/cors";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // corsMiddleware(this);
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <Toaster position="bottom-left" />
        <QueryClientWrapper>{children}</QueryClientWrapper>
        {/* <footer className="flex justify-center items-center py-10">
          Footer Here!
        </footer> */}
      </body>
    </html>
  );
}
