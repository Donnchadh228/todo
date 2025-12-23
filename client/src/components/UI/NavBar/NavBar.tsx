import { Link } from "react-router-dom";
import cl from "./NavBar.module.css";
const NavBar = () => {
  return (
    <div className={`${cl.wrapper}`}>
      <nav className={`${cl.navBar} container`}>
        <div className={cl.left}>
          <Link className={`${cl.link} customHover`} to="/home">
            HOME
          </Link>
        </div>
        <div className={cl.right}>
          <Link className={`${cl.link} customHover`} to="/auth">
            LOGIN
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
