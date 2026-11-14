import React from "react";
import "./style.css";
import { FaGithub, FaInstagram, FaFacebookF } from "react-icons/fa";
import { useLocale } from "../../i18n";

export const Socialicons = () => {
  const { labels, content } = useLocale();
  const social = content.socialprofils;
  return (
    <div className="stick_follow_icon">
      <ul>
        {social.instagram && <li><a href={social.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram /></a></li>}
        {social.github && <li><a href={social.github} aria-label="GitHub" target="_blank" rel="noopener noreferrer"><FaGithub /></a></li>}
        {social.facebook && <li><a href={social.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a></li>}
      </ul>
      <p>{labels.followMe}</p>
    </div>
  );
};
