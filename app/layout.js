
import "./globals.css";

export const metadata = {
  title: "TinyLink",
  description: "Simple URL shortener",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-900">
        <div className="min-h-screen flex flex-col items-center py-10">
          {children}
        </div>
      </body>
    </html>
  );
}
