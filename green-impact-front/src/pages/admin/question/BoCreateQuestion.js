import React, { Component, Fragment } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { ApiRequests, Header, Token, AdminRole, ErrorTokenMessage, ErrorInfosMessage } from "api/BaseApi";
import Swal from "sweetalert2";

export default class BoCreateQuestion extends Component {
  state = {
    name: "",
  };

  componentDidMount() {
    if (!Token) {
      window.location.href = "/connexion";
    }

    else if (!AdminRole) {
      window.location.href = "/";
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const question = {
      name: this.state.name,
    };

    Swal.fire({
      title: "Créer une question",
      text: "Êtes-vous sûr de vouloir créer cette question ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: "#7db769",
      denyButtonColor: "#DC143C",
      confirmButtonText: "Créer",
      denyButtonText: "Ne pas créer",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(ApiRequests.fetchQuestions, question, { headers: Header })
          .then(() => {
            Swal.fire("", "Votre question a bien été enregistrée", "success").then(() => {
              window.location.reload(false);
            });
          })
          .catch((error) => {
            console.error(error.message);
            Swal.fire("", ErrorInfosMessage + ".<br/>" + ErrorTokenMessage, "error");
          });
      } else if (result.isDenied) {
        Swal.fire("", "Votre question n'a pas été créée", "error");
      }
    });
  };
  render() {
    return (
      <Fragment>
        <div className="cardBackoffice spaces-card">
          <form onSubmit={this.handleSubmit}>
            <h4>Création d'une question</h4>
            <label htmlFor="name">Question</label>
            <input type="text" id="name" name="name" placeholder="Combien de temps mets une bouteille à se décomposer ?" onChange={(e) => this.setState({ name: e.target.value })} required />
            <Row>
              <Col sm={6}>
                <button type="submit" className="add">
                  Créer cette question
                </button>
              </Col>
              <Col sm={6}>
                <Link to={"/backoffice"}>
                  <button className="backBo">Retour au Backoffice</button>
                </Link>
              </Col>
            </Row>
          </form>
        </div>
      </Fragment>
    );
  }
}
