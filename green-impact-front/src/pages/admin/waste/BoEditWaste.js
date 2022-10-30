import React, { Component, Fragment } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { ApiRequests, ErrorTokenMessage, ErrorInfosMessage, Token, AdminRole } from "api/BaseApi";
import Swal from "sweetalert2";
import "../Backoffice.scss";

export default class BoEditWaste extends Component {
  state = {
    name: "",
    id: "",
    waste: [],
    hasFetchData: false,
  };

  getWastesById(id) {
    axios
      .get(`${ApiRequests.fetchWastes}/${id}`)
      .then((fetchWastes) => {
        const waste = fetchWastes.data;
        this.setState({ waste: waste, name: waste.name, id: waste.id, hasFetchData: true });
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  updateWasteHandler = (e) => {
    e.preventDefault();

    const newHeader = {
      Authorization: `Bearer ${Token}`,
      "content-type": "application/merge-patch+json",
    };

    axios
      .patch(`${ApiRequests.fetchWastes}/${this.state.id}`, { name: this.state.name }, { headers: newHeader })
      .then(() => {
        Swal.fire("", "Votre déchet a bien été modifié", "success").then(() => {
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
      this.getWastesById(id);
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
                <form onSubmit={this.updateWasteHandler}>
                  <h4>
                    Modifier le déchet <b>"{this.state.waste.name}"</b>
                  </h4>
                  <label htmlFor="name">Nom du déchet</label>
                  <input type="text" id="name" name="name" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} required />
                  <Row>
                    <Col sm={6}>
                      <button type="submit" className="add">
                        Éditer ce déchet
                      </button>
                    </Col>
                    <Col sm={6}>
                      <Link to={"/backoffice/waste-list"}>
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
