import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "./Footer";

function MainLayout() {
    return (
        <>
            <Header />
            <main><Outlet /></main>
            <Footer />
        </>
    )

}
export default MainLayout;