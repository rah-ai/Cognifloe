import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { TopNav } from "./dashboard/TopNav";

export default function Layout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Top Navigation */}
            <TopNav handleLogout={handleLogout} />

            {/* Main Content - Full Width */}
            <main className="max-w-[1800px] mx-auto p-6">
                <Outlet />
            </main>
        </div>
    );
}
