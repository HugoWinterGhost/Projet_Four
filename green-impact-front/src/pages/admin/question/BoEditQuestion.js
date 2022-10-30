import React, { Component, Fragment } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { ApiRequests, ErrorTokenMessage, ErrorInfosMessage, Token, AdminRole } from "api/BaseApi";
import Swal from "sweetalert2";
import "../Backoffice.scss";

export default class BoEditQuestion extends Component {
  state = {
    name: "",
    id: "",
    question: [],
    hasFetchData: false,
  };

  getQuestionsById(id) {
    axios
      .get(`${ApiRequests.fetchQuestions}/${id}`)
      .then((fetchQuestions) => {
        const question = fetchQuestions.data;
        this.setState({ question: question, name: question.name, id: question.id, hasFetchData: true });
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  updateQuestionHandler = (e) => {
    e.preventDefault();

    const newHeader = {
      Authorization: `Bearer ${Token}`,
      "content-type": "application/merge-patch+json",
    };

    axios
      .patch(`${ApiRequests.fetchQuestions}/${this.state.id}`, { name: this.state.name }, { headers: newHeader })
      .then(() => {
        Swal.fire("", "Votre question a bien été modifié", "success").then(() => {
          window.location.reload(false);
        });
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorInfosMessage + ".<br/>" + ErrorTokenMessage, "error");
      });
  };

  componentDidMount() {
    if (!Token) {
      window.location.href = "/connexion";
    } else if (!AdminRole) {
      window.location.href = "/";
    } else {
      const id = this.props.match.params.id;
      this.getQuestionsById(id);
    }
  }

  render() {
    return (
      <Fragment>
        <div>
          {!this.state.hasFetchData ? (
            <div>Chargement…</div>
          ) : (
            <Fragment>
              <div className="cardBackoffice">
                <form onSubmit={this.updateQuestionHandler}>
                  <h4>
                    Modifier la question <b>"{this.state.question.name}"</b>
                  </h4>
                  <label htmlFor="name">Nom de la question</label>
                  <input type="text" id="name" name="name" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} required />
                  <Row>
                    <Col sm={6}>
                      <button type="submit" className="add">
                        Éditer cette question
                      </button>
                    </Col>
                    <Col sm={6}>
                      <Link to={"/backoffice/questions-list"}>
                        <button className="backBo">Retour à la liste</button>
                      </Link>
                    </Col>
                  </Row>
                </form>
              </div>
            </Fragment>
          )}
        </div>
      </Fragment>
    );
  }
}
