import { Link } from "react-router-dom";
import cl from "./NavBar.module.css";

import { privateRoutesConfig, publicRoutesConfig } from "../../../utils/const.ts";
import { useTypedSelector } from "../../../hooks/useTypedSelector.ts";

import { logout } from "../../../store/action-creators/auth/logout.ts";
import { useAppDispatch } from "../../../store/index.ts";
const NavBar = () => {
  const { user } = useTypedSelector(state => state.user);
  const dispatch = useAppDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <div className={`${cl.wrapper}`}>
      <nav className={`${cl.navBar} container`}>
        <div className={cl.left}>
          <Link className={`${cl.link} customHover`} to={privateRoutesConfig.TODOS}>
            TODOS
          </Link>
        </div>
        <div className={cl.right}>
          {!user ? (
            <>
              <Link className={`${cl.link} customHover`} to={publicRoutesConfig.LOGIN}>
                LOGIN
              </Link>
              <Link className={`${cl.link} customHover`} to={publicRoutesConfig.REGISTER}>
                REGISTER
              </Link>
            </>
          ) : (
            <div className={`${cl.link} customHover`} onClick={logoutHandler}>
              LOGOUT <span className={cl.login}>({user.login})</span>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
