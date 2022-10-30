import React, { Component, Fragment } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { ApiRequests, Header, Token, AdminRole, ErrorTokenMessage, ErrorInfosMessage } from "api/BaseApi";
import Swal from "sweetalert2";

export default class BoCreateWaste extends Component {
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

    const waste = {
      name: this.state.name,
    };

    Swal.fire({
      title: "Créer un déchet",
      text: "Êtes-vous sûr de vouloir créer ce déchet ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: "#7db769",
      denyButtonColor: "#DC143C",
      confirmButtonText: "Créer",
      denyButtonText: "Ne pas créer",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(ApiRequests.fetchWastes, waste, { headers: Header })
          .then(() => {
            Swal.fire("", "Votre déchet a bien été enregistré", "success").then(() => {
              window.location.reload(false);
            });
          })
          .catch((error) => {
            console.error(error.message);
            Swal.fire("", ErrorInfosMessage + ".<br/>" + ErrorTokenMessage, "error");
          });
      } else if (result.isDenied) {
        Swal.fire("", "Votre déchet n'a pas été créé", "error");
      }
    });
  };
  render() {
    return (
      <Fragment>
        <div className="cardBackoffice spaces-card">
          <form onSubmit={this.handleSubmit}>
            <h4>Création d'un déchet</h4>
            <label htmlFor="name">Nom du déchet</label>
            <input type="text" placeholder="Bouteille en plastique" id="name" name="name" onChange={(e) => this.setState({ name: e.target.value })} required />
            <Row>
              <Col sm={6}>
                <button type="submit" className="add">
                  Créer ce déchet
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
