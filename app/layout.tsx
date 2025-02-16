import QueryClientWrapper from "@/components/QueryClientWrapper";
import { montserrat } from "../components/ui/fonts";
import "../components/ui/global.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientWrapper>
            {children}
          </QueryClientWrapper>
        </ThemeProvider>
        {/* <footer className="flex justify-center items-center py-10">
          Footer Here!
        </footer> */}
      </body>
    </html>
  );
}
