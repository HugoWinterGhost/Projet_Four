import React, { Component, Fragment } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { ApiRequests, Header, Token, AdminRole, ErrorTokenMessage, ErrorInfosMessage } from "api/BaseApi";
import Swal from "sweetalert2";

export default class BoCreateEvent extends Component {
  state = {
    title: "",
    description: "",
    startAt: "",
    endAt: "",
    city: "",
    addresses: [],
    status: [],
    nbWorkshop: 0,
    nbVolunteer: 0,
    nbStand: 0,
    image: [],
    users: [],
  };

  componentDidMount() {
    if (!Token) {
      window.location.href = "/connexion";
    }

    else if (!AdminRole) {
      window.location.href = "/";
    }

    const currentDate = new Date();
    const currentDateFromatted = moment(currentDate).format("YYYY-MM-DD");
    this.setState({ startAt: currentDateFromatted, endAt: currentDateFromatted });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const pushData = async (event) => {
      let formData = new FormData();
      formData.append("file", this.state.image[0]);

      axios
        .post(ApiRequests.fetchMediaObjects, formData, { headers: Header })
        .then((fetchMediaObjects) => {
          event.image = fetchMediaObjects.data["@id"];

          axios
            .post(ApiRequests.fetchEvents, event, { headers: Header })
            .then(() => {
              Swal.fire("", "Votre évènement a bien été enregistré", "success").then(() => {
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

    const event = {
      title: this.state.title,
      description: this.state.description,
      startAt: this.state.startAt,
      endAt: this.state.endAt,
      city: this.state.city,
      addresses: [this.state.addresses],
      status: [Number(this.state.status)],
      nbWorkshop: this.state.nbWorkshop,
      nbVolunteer: this.state.nbVolunteer,
      nbStand: this.state.nbStand,
      image: this.state.image,
      users: this.state.users,
    };

    Swal.fire({
      title: "Créer un évènement",
      text: "Êtes-vous sûr de vouloir créer cet évènement ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: "#7db769",
      denyButtonColor: "#DC143C",
      confirmButtonText: "Créer",
      denyButtonText: "Ne pas créer",
    }).then((result) => {
      if (result.isConfirmed) {
        pushData(event);
      } else if (result.isDenied) {
        Swal.fire("", "Votre évènement n'a pas été créé", "error");
      }
    });
  };
  render() {
    return (
      <Fragment>
        <div className="cardBackoffice spaces-card">
          <form onSubmit={this.handleSubmit}>
            <h4>Création d'un évènement</h4>

            <label htmlFor="title">Titre de l'évènement</label>
            <input type="text" id="title" name="title" placeholder="Grand nettoyage à la Tour Eiffel" onChange={(e) => this.setState({ title: e.target.value })} required />

            <Row>
              <Col sm={6}>
                <label htmlFor="startAt">Date de début</label>
                <input type="date" id="startAt" name="startAt" value={this.state.startAt} onChange={(e) => this.setState({ startAt: e.target.value })} required />
              </Col>
              <Col sm={6}>
                <label htmlFor="endAt">Date de fin</label>
                <input type="date" id="endAt" name="endAt" value={this.state.endAt} onChange={(e) => this.setState({ endAt: e.target.value })} required />
              </Col>
            </Row>

            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" placeholder="Les Hautes Vertus Écologiques sont prêts pour passer une après midi de convivialité tout en faisant un geste pour la planète..." onChange={(e) => this.setState({ description: e.target.value })} required />

            <Row>
              <Col sm={6}>
                <label htmlFor="city">Ville de l'évènement</label>
                <input type="text" id="city" name="city" placeholder="Paris" onChange={(e) => this.setState({ city: e.target.value })} required />
              </Col>
              <Col sm={6}>
                <label htmlFor="addresses">Addresse de l'évènement</label>
                <input type="text" id="addresses" name="addresses" placeholder="75 rue des Champs-Élysées" onChange={(e) => this.setState({ addresses: e.target.value })} required />
              </Col>
            </Row>

            <Row>
              <Col sm={6}>
                <label htmlFor="status">Statut de l'évènement</label>
                <input type="text" id="status" name="status" placeholder="Statut Créer : 0" onChange={(e) => this.setState({ status: e.target.value })} required />
              </Col>
              <Col sm={6}>
                <label htmlFor="image">Image de l'évènement</label>
                <input type="file" id="image" name="image" onChange={(e) => this.setState({ image: [e.target.files[0]] })} required />
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
