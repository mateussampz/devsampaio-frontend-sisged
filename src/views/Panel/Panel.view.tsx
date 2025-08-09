
import { Outlet } from "react-router-dom";
import Navbar from "../../components/NavBar/Navbar.component";


const PanelView = () => {

  return <>
    <div className="container">
      <Navbar />
      <Outlet />
    </div>

  </>
};

export default PanelView;
