import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { dataabout as dataaboutEn, meta as metaEn, worktimeline as worktimelineEn, skills as skillsEn, services as servicesEn, introdata as introdataEn } from "../../content_option_en";
import { dataabout as dataaboutCs, meta as metaCs, worktimeline as worktimelineCs, skills as skillsCs, services as servicesCs, introdata as introdataCs} from "../../content_option";

export const About = () => {
  const queryParameters = new URLSearchParams(window.location.search)
  const type = queryParameters.get("lang")
  const data = type === 'en' ? { dataabout: dataaboutEn, introdata: introdataEn, meta: metaEn, worktimeline: worktimelineEn, skills: skillsEn, services: servicesEn } : {dataabout: dataaboutCs, introdata: introdataCs, meta: metaCs, worktimeline: worktimelineCs, skills: skillsCs, services: servicesCs };

  return (
      <HelmetProvider>
        <Container className="About-header">
          <Helmet>
            <meta charSet="utf-8" />
            <title> About | {data.meta.title}</title>
            <meta name="description" content={data.meta.description} />
          </Helmet>
          <Row className="mb-5 mt-3 pt-md-3">
            <Col lg="8">
              <h1 className="display-4 mb-4">O mně</h1>
              <hr className="t_border my-4 ml-0 text-left" />
            </Col>
          </Row>
          <Row className="sec_sp">
            <Col lg="5">
              <h3 className="color_sec py-4">{data.dataabout.title}</h3>
            </Col>
            <Col lg="7" className="d-flex align-items-center">
              <div>
                <p>{data.dataabout.aboutme}</p>
              </div>
            </Col>
          </Row>
          <Row className=" sec_sp">
            <Col lg="5">
              <h3 className="color_sec py-4">Rozhovory</h3>
            </Col>
            <Col lg="7">
              <table className="table caption-top">
                <tbody>
                {data.worktimeline.map((data, i) => {
                  return (
                      <tr key={i}>
                        <th scope="row">{data.jobtitle}</th>
                        <td>{data.where}</td>
                        <td><a href={data.link} target="_blank" rel="noopener noreferrer">Odkaz</a></td>
                      </tr>
                  );
                })}
                </tbody>
              </table>
            </Col>
          </Row>
          <Row className="sec_sp">
            <Col lg="5">
              <h3 className="color_sec py-4">Skills</h3>
            </Col>
            <Col lg="7">
              {data.skills.map((data, i) => {
                return (
                    <div key={i}>
                      <h3 className="progress-title">{data.name}</h3>
                      <div className="progress">
                        <div
                            className="progress-bar"
                            style={{
                              width: `${data.value}%`,
                            }}
                        >
                          <div className="progress-value">{data.value}%</div>
                        </div>
                      </div>
                    </div>
                );
              })}
            </Col>
          </Row>
          <Row className="sec_sp">
            <Col lang="5">
              <h3 className="color_sec py-4">Služby</h3>
            </Col>
            <Col lg="7">
              {data.services.map((data, i) => {
                return (
                    <div className="service_ py-4" key={i}>
                      <h5 className="service__title">{data.title}</h5>
                      <p className="service_desc">{data.description}</p>
                    </div>
                );
              })}
            </Col>
          </Row>
        </Container>
      </HelmetProvider>
  );
};
