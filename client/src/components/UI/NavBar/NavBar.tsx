import { Link } from "react-router-dom";
import cl from "./NavBar.module.css";

import { privateRoutesConfig, publicRoutesConfig } from "../../../utils/const.ts";

import { logout } from "../../../store/actionCreators/auth/logout.ts";
import { useAppDispatch, useTypedSelector } from "../../../hooks/redux.ts";

const NavBar = () => {
  const { user } = useTypedSelector(state => state.user);
  const dispatch = useAppDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <div className={`${cl.wrapper}`}>
      <nav className={`${cl.navBar} container`}>
        {user && (
          <div className={cl.left}>
            <Link className={`${cl.link} customHover`} to={privateRoutesConfig.TODOS}>
              TODOS
            </Link>
            <Link className={`${cl.link} customHover`} to={privateRoutesConfig.GROUPS}>
              GROUPS
            </Link>
          </div>
        )}
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
