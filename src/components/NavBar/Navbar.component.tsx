import { Link, useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import { getAuth } from "firebase/auth";

const Navbar = () => {
  const navigate: any = useNavigate();

  const CustomLink = (props: any) => {
    const { to, children } = props;
    const resolved: any = useResolvedPath(to);
    const match: any = useMatch({ path: resolved.pathname, end: true });

    return (
      <Link data-testid={`navbar-${to.replace("/","")}`} className={`nav-link ${match ? "active" : ""}`} to={to}>
        {children}
      </Link>
    );
  };

  const doLogout = async () => {
    await getAuth()
      .signOut()
      .then(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      })
      .catch((error: any) => {
        console.log("Error during logout", error);
      });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return <>
    <nav className="navbar navbar-expand-lg mt-3 mb-3">
      <div className="container">
        <a className="navbar-brand" href="/">
          <img src="../../../public/assets/logo-2-sesi-senai.png" alt="Sesi-Senai" className="img-fluid" />
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-lg-0 text-center">
            <li className="nav-item me-3">
              <CustomLink to="/panel">
                <i className="fas fa-id-card me-2"></i> Cadastros
              </CustomLink>
            </li>
            <li className="nav-item me-3">
              <CustomLink to="/panel">
                <i className="fas fa-walking me-2"></i> Movimentação
              </CustomLink>
            </li>
            <li className="nav-item me-3">
              <CustomLink to="/panel">
                <i className="fas fa-search me-2"></i> Consultas
              </CustomLink>
            </li>
            <li className="nav-item me-3">
              <CustomLink to="/panel">
                <i className="fas fa-book me-2"></i> Relatórios
              </CustomLink>
            </li>
            <li className="nav-item">
              <button type="button" className="nav-link" onClick={() => doLogout()}>
                <i className="fas fa-sign-out-alt me-2"></i> Sair
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </>
};

export default Navbar;
