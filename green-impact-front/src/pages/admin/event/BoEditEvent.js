import React, { Component, Fragment } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { ApiRequests, ErrorTokenMessage, ErrorInfosMessage, Token, AdminRole, Header } from "api/BaseApi";
import Swal from "sweetalert2";
import "../Backoffice.scss";

export default class BoEditEvent extends Component {
  state = {
    title: "",
    city: "",
    addresses: [],
    status: [],
    description: "",
    startAt: "",
    endAt: "",
    id: "",
    image: [],
    event: [],
    hasFetchData: false,
  };

  getEventsById(id) {
    axios
      .get(`${ApiRequests.fetchEvents}/${id}`)
      .then((fetchEvents) => {
        const event = fetchEvents.data;
        event.startAt = moment(event.startAt).format("YYYY-MM-DD");
        event.endAt = moment(event.endAt).format("YYYY-MM-DD");
        this.setState({ event: event, title: event.title, city: event.city, description: event.description, startAt: event.startAt, endAt: event.endAt, addresses: event.addresses[0], status: event.status, id: event.id, hasFetchData: true });
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  updateEventHandler = (e) => {
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
          .patch(`${ApiRequests.fetchEvents}/${this.state.id}`, { title: this.state.title, city: this.state.city, description: this.state.description, startAt: this.state.startAt, endAt: this.state.endAt, addresses: [this.state.addresses], status: [Number(this.state.status)], image: image }, { headers: newHeader })
          .then(() => {
            Swal.fire("", "Votre évènement a bien été modifié", "success").then(() => {
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
      this.getEventsById(id);
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
                <form onSubmit={this.updateEventHandler}>
                  <h4>
                    Modifier l'évènement <b>"{this.state.event.title}"</b>
                  </h4>

                  <label htmlFor="title">Titre de l'évènement</label>
                  <input type="text" id="title" name="title" value={this.state.title} onChange={(e) => this.setState({ title: e.target.value })} required />

                  <Row>
                    <Col sm={6}>
                      <label htmlFor="startAt">Date de début de l'évènement</label>
                      <input type="date" id="startAt" name="startAt" value={this.state.startAt} onChange={(e) => this.setState({ startAt: e.target.value })} required />
                    </Col>
                    <Col sm={6}>
                      <label htmlFor="endAt">Date de fin de l'évènement</label>
                      <input type="date" id="endAt" name="endAt" value={this.state.endAt} onChange={(e) => this.setState({ endAt: e.target.value })} required />
                    </Col>
                  </Row>

                  <label htmlFor="description">Description de l'évènement</label>
                  <textarea id="description" name="description" value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} required />

                  <Row>
                    <Col sm={6}>
                      <label htmlFor="city">Ville de l'évènement</label>
                      <input type="text" id="city" name="city" value={this.state.city} onChange={(e) => this.setState({ city: e.target.value })} required />
                    </Col>
                    <Col sm={6}>
                      <label htmlFor="addresses">Adresse de l'évènement</label>
                      <input type="text" id="addresses" name="addresses" value={this.state.addresses} onChange={(e) => this.setState({ addresses: e.target.value })} required />
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={6}>
                      <label htmlFor="status">Statut de l'évènement</label>
                      <input type="text" id="status" name="status" value={this.state.status} onChange={(e) => this.setState({ status: e.target.value })} required />
                    </Col>
                    <Col sm={6}>
                      <label htmlFor="image">Image de l'évènement</label>
                      <input type="file" id="image" name="image" onChange={(e) => this.setState({ image: [e.target.files[0]] })} required />
                    </Col>
                  </Row>  

                  <Row>
                    <Col sm={6}>
                      <button type="submit" className="add">
                        Modifier "{this.state.event.title}"
                      </button>
                    </Col>
                    <Col sm={6}>
                      <Link to={"/backoffice/events-list"}>
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
