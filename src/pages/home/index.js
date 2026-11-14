import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Typewriter from "typewriter-effect";
import { Link } from "react-router-dom";
import { useLocale } from "../../i18n";

export const Home = () => {
  const { content, labels, localizedPath, language } = useLocale();
  const { introdata, meta } = content;
  const buttons = [
    ["/portfolio", labels.home.portfolio, "button_p"],
    ["/about", labels.home.about, "button_h"],
    ["/contact", labels.home.contact, "button_h"]
  ];
  return (
    <HelmetProvider>
      <section id="home" className="home">
        <Helmet><meta charSet="utf-8" /><title>{meta.title}</title><meta name="description" content={meta.description} /></Helmet>
        <div className="intro_sec d-block d-lg-flex align-items-center">
          <div className="h_bg-image order-1 order-lg-2 h-100" style={{ backgroundImage: `url(${introdata.your_img_url})` }}></div>
          <div className="text order-2 order-lg-1 h-100 d-lg-flex justify-content-center">
            <div className="align-self-center"><div className="intro mx-auto">
              <h2 className="mb-1x desktop-intro-name">{introdata.title}</h2>
                  <div className="cinematic-mobile-copy">
                    <p className="cinematic-eyebrow">
                      {language === "en" ? "SOUND · MUSIC · PRODUCTION" : "ZVUK · HUDBA · PRODUKCE"}
                    </p>
                    <h1 className="cinematic-name">Šimon<span>Čada.</span></h1>
                    <p className="cinematic-role">
                      {language === "en" ? "Sound engineer / Event host" : "Zvukař / Moderátor"}
                      <br />
                      {language === "en" ? "Music & event production" : "Hudební a eventová produkce"}
                    </p>
                  </div>
              <h1 className="fluidz-48 mb-1x desktop-intro-typewriter">
                <Typewriter key={labels.home.about} options={{
                  strings: Object.values(introdata.animated), autoStart: true, loop: true, deleteSpeed: 10
                }} />
              </h1>
              {introdata.description && <p className="mb-1x">{introdata.description}</p>}
              <div className="intro_btn-action pb-5">
                {buttons.map(([path, label, id]) => (
                  <Link to={localizedPath(path)} className="text_2" key={path}>
                    <div id={id} className="ac_btn btn">
                      <span className="cta-desktop-label">{label}</span>
                      <span className="cta-mobile-label">
                        {path === "/portfolio" ? labels.navigation.portfolio : path === "/about" ? labels.navigation.about : labels.navigation.contact}
                      </span>
                      <div className="ring one"></div><div className="ring two"></div><div className="ring three"></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div></div>
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
};
