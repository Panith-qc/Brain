import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import NavItem from "./common/NavItem";
import AuthService from "../services/auth.service";

const Header = () => {
  const [currentUser, setCurrentUser] = useState();
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
    console.log("user", user);
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  return (
    <Menu className="h-[70px] px-16 border-2 drop-shadow-lg">
      {currentUser ? (
        <>
          <div className="float-left mt-3">
            <img
              src="./MetasphereswithTagLine.png"
              style={{ width: 60, height: 45 }}
            />
          </div>
          <div className="float-right flex">
            <NavItem to="/home" title="Home" />
            {/* <NavItem to="/mod" title="Moderator Board" /> */}
            {showAdminBoard && <NavItem to="/admin" title="Knowledge Base" />}
            <NavItem to="/user" title="User" />
            <li className="my-5 ml-24 block text-lg font-normal hover:font-bold hover:text-back-red md:inline-block">
              <a href="/login" onClick={logOut}>
                LogOut
              </a>
            </li>
            <NavItem to="/profile" title={currentUser.username} />
          </div>
        </>
      ) : (
        <>
          <div className="float-left mt-3">
            <img
              src="./MetasphereswithTagLine.png"
              style={{ width: 60, height: 45 }}
            />
          </div>
          <div className="float-right flex">
            <NavItem
              to="/login"
              title="Login"
              addClass="border-2 text-center"
            />
          </div>
        </>
      )}
    </Menu>
  );
};

export default Header;
