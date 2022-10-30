import React, { Component, Fragment } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { ApiRequests, ErrorTokenMessage, ErrorInfosMessage, Token, AdminRole, Header } from "api/BaseApi";
import Swal from "sweetalert2";
import "../Backoffice.scss";

export default class BoEditImpact extends Component {
  state = {
    id: "",
    title: "",
    description: "",
    image: [],
    recycling: 0,
    waste: null,
    wastes: [],
    impact: [],
    hasFetchData: false,
  };

  getImpactsById(id) {
    axios
      .get(`${ApiRequests.fetchImpacts}/${id}`)
      .then((fetchImpacts) => {
        const impact = fetchImpacts.data;

        axios
          .get(`${ApiRequests.fetchWastes}`)
          .then((fetchWastes) => {
            const wastes = fetchWastes.data["hydra:member"];
            this.setState({ impact: impact, wastes: wastes, title: impact.title, recycling: impact.recycling, description: impact.description, waste: impact.waste, id: impact.id, hasFetchData: true });
          })
          .catch((error) => {
            console.error(error.message);
            Swal.fire("", ErrorTokenMessage, "error");
          });
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  updateImpactHandler = (e) => {
    e.preventDefault();

    const newHeader = {
      Authorization: `Bearer ${Token}`,
      "content-type": "application/merge-patch+json",
    };

    let formData = new FormData();
    formData.append("file", this.state.image[0]);

    axios
      .post(ApiRequests.fetchMediaObjects, formData, { headers: Header })
      .then((fetchMediaObjects) => {
        const image = fetchMediaObjects.data["@id"];

        axios
        .patch(`${ApiRequests.fetchImpacts}/${this.state.id}`, { title: this.state.title, recycling: Number(this.state.recycling), description: this.state.description, waste: this.state.waste, image: image }, { headers: newHeader })
        .then(() => {
          Swal.fire("", "Votre impact a bien été modifié", "success").then(() => {
            window.location.reload(false);
          });
        })
        .catch((error) => {
          console.error(error.message);
          Swal.fire("", ErrorInfosMessage + ".<br/>" + ErrorTokenMessage, "error");
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
      this.getImpactsById(id);
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
                <form onSubmit={this.updateImpactHandler}>
                  <h4>
                    Modifier l'impact <b>"{this.state.impact.title}"</b>
                  </h4>

                  <Row>
                    <Col sm={6}>
                      <label htmlFor="title">Titre de l'impact</label>
                      <input type="text" id="title" name="title" value={this.state.title} onChange={(e) => this.setState({ title: e.target.value })} required />
                    </Col>
                    <Col sm={6}>
                      <label htmlFor="recycling">Durée de recyclage (en années)</label>
                      <input type="number" id="recycling" name="recycling" min="1" value={this.state.recycling} onChange={(e) => this.setState({ recycling: e.target.value })} required />
                    </Col>
                  </Row>

                  <label htmlFor="description">Description de l'impact</label>
                  <textarea id="description" name="description" value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} required />

                  <Row>
                    <Col sm={6}>
                      <label htmlFor="waste">Déchet</label>
                      <select style={{ cursor: "pointer" }} id="waste" name="waste" value={this.state.waste} onChange={(e) => this.setState({ waste: e.target.value })} required>
                        <option value="">Non défini</option>
                        {this.state.wastes.map((waste) => (
                          <option key={waste.id.toString()} value={waste["@id"]}>
                            {waste.name}
                          </option>
                        ))}
                      </select>
                    </Col>
                    <Col sm={6}>
                      <label htmlFor="image">Image de l'impact</label>
                      <input type="file" id="image" name="image" onChange={(e) => this.setState({ image: [e.target.files[0]] })} required />
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={6}>
                      <button type="submit" className="add">
                        Éditer cet impact
                      </button>
                    </Col>
                    <Col sm={6}>
                      <Link to={"/backoffice/impact-list"}>
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
