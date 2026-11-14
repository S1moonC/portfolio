import { useLocation } from "react-router-dom";
import * as cs from "./content_option";
import * as en from "./content_option_en";

const interfaceTexts = {
  cs: {
    navigation: { home: "Domů", portfolio: "Portfolio", about: "O mně", contact: "Kontakt" },
    switchLanguage: "Přepnout do angličtiny",
    footer: "Všechna práva vyhrazena",
    followMe: "Sledujte mě",
    home: { portfolio: "Moje portfolio", about: "O mně", contact: "Kontaktujte mě" },
    about: { heading: "O mně", interviews: "Rozhovory", skills: "Dovednosti", services: "Služby", link: "Odkaz" },
    portfolio: { heading: "Portfolio", viewProject: "Zobrazit fotografii" },
    contact: {
      heading: "Kontakt", invitation: "Ozvěte se mi", phone: "Telefon",
      name: "Jméno", email: "E-mail", message: "Zpráva", send: "Odeslat",
      sending: "Odesílám...", success: "Zpráva byla úspěšně odeslána.",
      error: "Zprávu se nepodařilo odeslat. Zkuste to prosím znovu."
    }
  },
  en: {
    navigation: { home: "Home", portfolio: "Portfolio", about: "About", contact: "Contact" },
    switchLanguage: "Switch to Czech",
    footer: "All rights reserved",
    followMe: "Follow me",
    home: { portfolio: "My Portfolio", about: "About Me", contact: "Contact Me" },
    about: { heading: "About Me", interviews: "Interviews", skills: "Skills", services: "Services", link: "Link" },
    portfolio: { heading: "Portfolio", viewProject: "View photo" },
    contact: {
      heading: "Contact", invitation: "Get in Touch", phone: "Phone",
      name: "Name", email: "Email", message: "Message", send: "Send",
      sending: "Sending...", success: "Your message has been sent successfully.",
      error: "Your message could not be sent. Please try again."
    }
  }
};

export function useLocale() {
  const location = useLocation();
  const language = new URLSearchParams(location.search).get("lang") === "en" ? "en" : "cs";
  return {
    language,
    labels: interfaceTexts[language],
    content: language === "en" ? en : cs,
    localizedPath: (pathname) => ({
      pathname,
      search: language === "en" ? "?lang=en" : ""
    })
  };
}
