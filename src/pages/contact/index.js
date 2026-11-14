import React, { useState } from "react";
import * as emailjs from "emailjs-com";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useLocale } from "../../i18n";

export const ContactUs = () => {
  const { content, labels } = useLocale();
  const { contactConfig, meta } = content;
  const t = labels.contact;
  const [formData, setFormData] = useState({ email: "", name: "", message: "" });
  const [status, setStatus] = useState({ loading: false, show: false, message: "", variant: "success" });
  const handleChange = (event) => setFormData((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, show: false, message: "", variant: "success" });
    try {
      await emailjs.send(contactConfig.YOUR_SERVICE_ID, contactConfig.YOUR_TEMPLATE_ID, {
        from_name: formData.email, user_name: formData.name,
        to_name: contactConfig.YOUR_EMAIL, message: formData.message
      }, contactConfig.YOUR_USER_ID);
      setStatus({ loading: false, show: true, message: t.success, variant: "success" });
      setFormData({ email: "", name: "", message: "" });
    } catch (error) {
      setStatus({ loading: false, show: true, message: t.error, variant: "danger" });
    }
  };
  return (
    <HelmetProvider>
      <Container>
        <Helmet><meta charSet="utf-8" /><title>{meta.title} | {t.heading}</title><meta name="description" content={meta.description} /></Helmet>
        <Row className="mb-5 mt-3 pt-md-3"><Col lg="8">
          <h1 className="display-4 mb-4">{t.heading}</h1><hr className="t_border my-4 ml-0 text-left" />
        </Col></Row>
        <Row className="sec_sp">
          <Col lg="12">
            <Alert show={status.show} variant={status.variant} className="rounded-0 co_alert"
              onClose={() => setStatus((previous) => ({ ...previous, show: false }))} dismissible>
              <p className="my-0">{status.message}</p>
            </Alert>
          </Col>
          <Col lg="5" className="mb-5">
            <h3 className="color_sec py-4">{t.invitation}</h3>
            <address><strong>{t.email}:</strong> <a href={`mailto:${contactConfig.YOUR_EMAIL}`}>{contactConfig.YOUR_EMAIL}</a>
              {contactConfig.YOUR_FONE && <p className="mt-3"><strong>{t.phone}:</strong> {contactConfig.YOUR_FONE}</p>}
            </address>
            <p>{contactConfig.description}</p>
          </Col>
          <Col lg="7" className="d-flex align-items-center">
            <form onSubmit={handleSubmit} className="contact__form w-100">
              <Row><Col lg="6" className="form-group"><input className="form-control" name="name" placeholder={t.name}
                aria-label={t.name} value={formData.name} type="text" required onChange={handleChange} /></Col>
                <Col lg="6" className="form-group"><input className="form-control rounded-0" name="email"
                  placeholder={t.email} aria-label={t.email} type="email" value={formData.email} required onChange={handleChange} /></Col></Row>
              <textarea className="form-control rounded-0" name="message" placeholder={t.message} aria-label={t.message}
                rows="5" value={formData.message} onChange={handleChange} required></textarea>
              <br /><Row><Col lg="12" className="form-group">
                <button className="btn ac_btn" type="submit" disabled={status.loading}>{status.loading ? t.sending : t.send}</button>
              </Col></Row>
            </form>
          </Col>
        </Row>
      </Container>
      <div className={status.loading ? "loading-bar" : "d-none"}></div>
    </HelmetProvider>
  );
};
