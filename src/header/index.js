import React, { useState } from "react";
import "./style.css";
import { VscGrabber, VscClose } from "react-icons/vsc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLocale } from "../i18n";
import Themetoggle from "../components/themetoggle";

const Headermain = () => {
  const [isActive, setActive] = useState(false);
  const { language, labels, content, localizedPath } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = () => {
    setActive((value) => !value);
    document.body.classList.toggle("ovhidden", !isActive);
  };
  const closeMenu = () => {
    setActive(false);
    document.body.classList.remove("ovhidden");
  };
  const handleLanguageSwitch = () => {
    const query = new URLSearchParams(location.search);
    if (language === "en") query.delete("lang");
    else query.set("lang", "en");
    navigate({ pathname: location.pathname, search: query.toString() ? "?" + query.toString() : "" });
    closeMenu();
  };
  const navigation = [
    ["/", labels.navigation.home], ["/portfolio", labels.navigation.portfolio],
    ["/about", labels.navigation.about], ["/contact", labels.navigation.contact]
  ];

  return (
    <>
      <header className="fixed-top site__header">
        <div className="d-flex align-items-center justify-content-between">
          <Link className="navbar-brand nav_ac" to={localizedPath("/")} onClick={closeMenu}>
            {content.logotext}
          </Link>
          <div className="d-flex align-items-center">
            <button className="language-switch nav_ac" onClick={handleLanguageSwitch} title={labels.switchLanguage} aria-label={labels.switchLanguage}>
              {language === "en" ? "EN" : "CZ"} <span aria-hidden="true">↔</span>
            </button>
            <Themetoggle />
            <button className="menu__button nav_ac" onClick={handleToggle} aria-label={isActive ? "Close menu" : "Open menu"} aria-expanded={isActive}>
              {isActive ? <VscClose /> : <VscGrabber />}
            </button>
          </div>
        </div>
        <div className={`site__navigation ${isActive ? "menu__opend" : ""}`}>
          <div className="bg__menu h-100">
            <div className="menu__wrapper">
              <div className="menu__container p-3">
                <ul className="the_menu">
                  {navigation.map(([path, label]) => (
                    <li className="menu_item" key={path}>
                      <Link onClick={closeMenu} to={localizedPath(path)} className="my-3">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="menu_footer d-flex flex-column flex-md-row justify-content-between align-items-md-center position-absolute w-100 p-3">
            <div className="d-flex">
              <a href={content.socialprofils.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href={content.socialprofils.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href={content.socialprofils.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
            <p className="copyright m-0">© {new Date().getFullYear()} {content.logotext} · {labels.footer}</p>
          </div>
        </div>
      </header>
      <div className="br-top"></div><div className="br-bottom"></div>
      <div className="br-left"></div><div className="br-right"></div>
    </>
  );
};
export default Headermain;
