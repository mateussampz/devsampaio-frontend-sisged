
import { Outlet } from "react-router-dom";
import Navbar from "../../components/NavBar/Navbar.component";
import Footer from "../../components/Footer/Footer.component";
import { Confirm } from "@moreirapontocom/npmhelpers";


const PanelView = () => {

  return <>
    <div className="container">

      <Navbar />
      <Confirm />

      <Outlet />
      <Footer />
    </div>

  </>
};

export default PanelView;
