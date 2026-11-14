import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { useLocale } from "../../i18n";

export const Portfolio = () => {
  const { content, labels } = useLocale();
  const { dataportfolio, meta } = content;
  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet><meta charSet="utf-8" /><title>{labels.portfolio.heading} | {meta.title}</title><meta name="description" content={meta.description} /></Helmet>
        <Row className="mb-5 mt-3 pt-md-3"><Col lg="8">
          <h1 className="display-4 mb-4">{labels.portfolio.heading}</h1>
          <hr className="t_border my-4 ml-0 text-left" />
        </Col></Row>
        <div className="mb-5 po_items_ho">
          {dataportfolio.map((item, i) => <div key={i} className="po_item">
            <img src={item.img} alt={item.description} loading="lazy" />
            <div className="content"><p>{item.description}</p>
              <a href={item.img} target="_blank" rel="noopener noreferrer">{labels.portfolio.viewProject}</a>
            </div>
          </div>)}
        </div>
      </Container>
    </HelmetProvider>
  );
};
