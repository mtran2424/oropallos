import Header from "@/components/header/Header";
import AdminNavbar from "@/components/navigation/AdminNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`font-serif`}>
      <Header />
      <AdminNavbar />
      {children}
    </div>
  );
}