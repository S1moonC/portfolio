import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { useLocale } from "../../i18n";

export const About = () => {
  const { content, labels } = useLocale();
  const { dataabout, meta, worktimeline, skills, services } = content;
  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet><meta charSet="utf-8" /><title>{labels.about.heading} | {meta.title}</title><meta name="description" content={meta.description} /></Helmet>
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8"><h1 className="display-4 mb-4">{labels.about.heading}</h1><hr className="t_border my-4 ml-0 text-left" /></Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="5"><h3 className="color_sec py-4">{dataabout.title}</h3></Col>
          <Col lg="7" className="d-flex align-items-center">
            <div className="about-description">
              {dataabout.aboutme.trim().split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph.trim()}</p>)}
            </div>
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="5"><h3 className="color_sec py-4">{labels.about.interviews}</h3></Col>
          <Col lg="7"><table className="table caption-top"><tbody>
            {worktimeline.map((item, i) => (
              <tr key={i}><th scope="row">{item.jobtitle}</th><td>{item.where}</td>
              <td><a href={item.link} target="_blank" rel="noopener noreferrer">{labels.about.link}</a></td></tr>
            ))}
          </tbody></table></Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="5"><h3 className="color_sec py-4">{labels.about.skills}</h3></Col>
          <Col lg="7">{skills.map((item, i) => <div key={i}>
            <h3 className="progress-title">{item.name}</h3><div className="progress">
              <div className="progress-bar" style={{ width: `${item.value}%` }}>
                <div className="progress-value">{item.value}%</div>
              </div></div>
          </div>)}</Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="5"><h3 className="color_sec py-4">{labels.about.services}</h3></Col>
          <Col lg="7">{services.map((item, i) => <div className="service_ py-4" key={i}>
            <h5 className="service__title">{item.title}</h5><p className="service_desc">{item.description}</p>
          </div>)}</Col>
        </Row>
      </Container>
    </HelmetProvider>
  );
};
