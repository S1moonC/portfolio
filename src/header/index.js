import React, {useState} from "react";
import "./style.css";
import { VscGrabber, VscClose } from "react-icons/vsc";
import {Link, useNavigate} from "react-router-dom";
import { logotext ,socialprofils } from "../content_option";
import Themetoggle from "../components/themetoggle";

const Headermain = () => {
  const [isActive, setActive] = useState("false");

  const handleToggle = () => {
    setActive(!isActive);
    document.body.classList.toggle("ovhidden");
  };

  const navigate = useNavigate();

  const handleClick = () => {
    let queryParameters = new URLSearchParams(window.location.search);
    let params = queryParameters.get("lang");

    if (params === "en") {
      queryParameters.delete("lang");
      document.location.href = window.location.pathname + (queryParameters.toString() ? "?" + queryParameters.toString() : "");
    } else {
      document.location.href = window.location.href + (window.location.search ? "&" : "?") + "lang=en";
    }
  };


  return (
      <>
        <header className="fixed-top site__header">
          <div className="d-flex align-items-center justify-content-between">
            <Link  className="navbar-brand nav_ac" to="/">
              {logotext}
            </Link>
            <div className="d-flex align-items-center">
              <button onClick={handleClick}>
                Switch lang
              </button>
              <Themetoggle />
              <button className="menu__button  nav_ac" onClick={handleToggle}>
                {!isActive ? <VscClose /> : <VscGrabber />}
              </button>

            </div>
          </div>

          <div className={`site__navigation ${!isActive ? "menu__opend" : ""}`}>
            <div className="bg__menu h-100">
              <div className="menu__wrapper">
                <div className="menu__container p-3">
                  <ul className="the_menu">
                    <li className="menu_item ">
                      <Link  onClick={handleToggle} to="/" className="my-3">Home</Link>
                    </li>
                    <li className="menu_item">
                      <Link  onClick={handleToggle} to="/portfolio" className="my-3"> Portfolio</Link>
                    </li>
                    <li className="menu_item">
                      <Link onClick={handleToggle} to="/about" className="my-3">About</Link>
                    </li>
                    <li className="menu_item">
                      <Link onClick={handleToggle} to="/contact" className="my-3"> Contact</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="menu_footer d-flex flex-column flex-md-row justify-content-between align-items-md-center position-absolute w-100 p-3">
              <div className="d-flex">
                <a href={socialprofils.facebook}>Facebook</a>
                <a href={socialprofils.github}>Github</a>
                <a href={socialprofils.twitter}>Twitter</a>
              </div>
              <p className="copyright m-0">copyright __ {logotext}</p>
            </div>
          </div>
        </header>
        <div className="br-top"></div>
        <div className="br-bottom"></div>
        <div className="br-left"></div>
        <div className="br-right"></div>

      </>
  );
};

export default Headermain;
