import React, { Component, Fragment } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ApiRequests,
  Header,
  Token,
  AdminRole,
  ErrorTokenMessage,
  ErrorInfosMessage,
} from "api/BaseApi";
import Swal from "sweetalert2";

export default class BoCreateImpact extends Component {
  state = {
    title: "",
    description: "",
    image: [],
    recycling: 0,
    waste: null,
    wastes: [],
  };

  componentDidMount() {
    if (!Token) {
      window.location.href = "/connexion";
    } else if (!AdminRole) {
      window.location.href = "/";
    }

    axios
      .get(`${ApiRequests.fetchWastes}`)
      .then((fetchWastes) => {
        const wastes = fetchWastes.data["hydra:member"];
        this.setState({ wastes: wastes });
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const pushData = async (impact) => {
      let formData = new FormData();
      formData.append("file", this.state.image[0]);

      axios
        .post(ApiRequests.fetchMediaObjects, formData, { headers: Header })
        .then((fetchMediaObjects) => {
          impact.image = fetchMediaObjects.data["@id"];

          axios
            .post(ApiRequests.fetchImpacts, impact, { headers: Header })
            .then(() => {
              Swal.fire("", "Votre impact a bien été enregistré", "success").then(() => {
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

    const impact = {
      title: this.state.title,
      description: this.state.description,
      image: this.state.image,
      recycling: Number(this.state.recycling),
      waste: this.state.waste,
    };

    Swal.fire({
      title: "Créer un impact",
      text: "Êtes-vous sûr de vouloir créer cet impact ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: "#7db769",
      denyButtonColor: "#DC143C",
      confirmButtonText: "Créer",
      denyButtonText: "Ne pas créer",
    }).then((result) => {
      if (result.isConfirmed) {
        pushData(impact);
      } else if (result.isDenied) {
        Swal.fire("", "Votre impact n'a pas été créé", "error");
      }
    });
  };
  render() {
    return (
      <Fragment>
        <div className="cardBackoffice spaces-card">
          <form onSubmit={this.handleSubmit}>
            <h4>Création d'un impact</h4>
            <Row>
              <Col sm>
                <label htmlFor="title">Impact</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Bouteille en plastique"
                  onChange={(e) => this.setState({ title: e.target.value })}
                  required
                />
              </Col>
              <Col sm>
                <label htmlFor="recycling">Durée de recyclage (en années)</label>
                <input
                  type="number"
                  id="recycling"
                  name="recycling"
                  min="1"
                  placeholder="1000 ans"
                  onChange={(e) => this.setState({ recycling: e.target.value })}
                  required
                />
              </Col>
            </Row>

            <label htmlFor="description">Description de l'impact</label>
            <textarea
              id="description"
              name="description"
              placeholder="La bouteille plastique est tout de même problématique en matière de recyclage que le sac plastique puisque 60% des bouteilles plastiques ont été recyclées en 2017."
              onChange={(e) => this.setState({ description: e.target.value })}
              required
            />

            <Row>
              <Col sm={6}>
                <label htmlFor="waste">Déchet</label>
                <select
                  style={{ cursor: "pointer" }}
                  id="waste"
                  name="waste"
                  onChange={(e) => this.setState({ waste: e.target.value })}
                  required
                >
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
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={(e) => this.setState({ image: [e.target.files[0]] })}
                  required
                />
              </Col>
            </Row>

            <Row>
              <Col sm={6}>
                <button type="submit" className="add">
                  Poursuivre
                </button>
              </Col>
              <Col sm={6}>
                <Link to={"/backoffice"}>
                  <button className="backBo">Retour au BackOffice</button>
                </Link>
              </Col>
            </Row>
          </form>
        </div>
      </Fragment>
    );
  }
}
