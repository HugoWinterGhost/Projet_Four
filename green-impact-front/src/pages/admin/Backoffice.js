import React, { Component, Fragment } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Token, AdminRole } from "api/BaseApi";
import "./Backoffice.scss";

export default class Backoffice extends Component {
  componentDidMount() {
    if (!Token) {
      window.location.href = "/connexion";
    }

    else if (!AdminRole) {
      window.location.href = "/";
    }
  }

  render() {
    return (
      <Fragment>
        <Container id="backoffice" className="spaces-footer">
          <h2 className="title-page text-center">BackOffice</h2>
          <div className="text-center">
            <Row>
              <Col sm={6}>
                <a href="/backoffice/impact-create">
                  <button>
                    <i className="fas fa-plus-circle icons" /> Création d'un impact
                  </button>
                </a>
              </Col>
              <Col sm={6}>
                <a href="/backoffice/impact-list">
                  <button>
                    <i className="fas fa-edit icons" /> Gestion des impacts
                  </button>
                </a>
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm={6}>
                <a href="/backoffice/waste-create">
                  <button>
                    <i className="fas fa-recycle icons" /> Création d'un déchet
                  </button>
                </a>
              </Col>
              <Col sm={6}>
                <a href="/backoffice/waste-list">
                  <button>
                    <i className="fas fa-dumpster icons" /> Gestion des déchets
                  </button>
                </a>
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm={6}>
                <a href="/backoffice/event-create">
                  <button>
                    <i className="fas fa-calendar-plus icons" /> Création d'un évènement
                  </button>
                </a>
              </Col>
              <Col sm={6}>
                <a href="/backoffice/events-list">
                  <button>
                    <i className="fas fa-calendar-times icons" /> Gestion des évènements
                  </button>
                </a>
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm={6}>
                <a href="/backoffice/article-create">
                  <button>
                    <i className="fas fa-cart-plus icons" /> Création d'un article
                  </button>
                </a>
              </Col>
              <Col sm={6}>
                <a href="/backoffice/articles-list">
                  <button>
                    <i className="fas fa-shopping-cart icons" /> Gestion des articles
                  </button>
                </a>
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm={6}>
                <a href="/backoffice/question-create">
                  <button>
                    <i className="fas fa-question-circle icons" /> Création d'une question
                  </button>
                </a>
              </Col>
              <Col sm={6}>
                <a href="/backoffice/questions-list">
                  <button>
                    <i className="fas fa-edit icons" /> Gestion des questions
                  </button>
                </a>
              </Col>
            </Row>
            <br />
            <a href="/backoffice/users-list">
              <button>
                <i className="fas fa-user-circle icons" /> Gestion des utilisateurs
              </button>
            </a>
          </div>
        </Container>
      </Fragment>
    );
  }
}
