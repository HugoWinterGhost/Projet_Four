import React, { Fragment, Component } from "react";
import { Container, Table } from "react-bootstrap";
import Moment from "react-moment";
import axios from "axios";
import { ApiRequests, Header, Token, AdminRole, ErrorTokenMessage } from "api/BaseApi";
import Swal from "sweetalert2";
import "../Backoffice.scss";
import "moment/locale/fr";

export default class BoGetEvents extends Component {
  state = {
    events: [],
  };

  statusEvent = ["Créer", "En cours", "Dépassé"];

  componentDidMount() {
    if (!Token) {
      window.location.href = "/connexion";
    } else if (!AdminRole) {
      window.location.href = "/";
    } else {
      axios
        .get(ApiRequests.fetchEvents)
        .then((fetchEvents) => {
          const events = fetchEvents.data["hydra:member"];
          this.setState({ events });
        })
        .catch((error) => {
          console.error(error.message);
          Swal.fire("", ErrorTokenMessage, "error");
        });
    }
  }

  deleteEvent(id, e) {
    Swal.fire({
      title: "Supprimer",
      text: "Êtes-vous sûr de vouloir supprimer cet évènement ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: "#DC143C",
      denyButtonColor: "#7db769",
      confirmButtonText: "Supprimer",
      denyButtonText: "Ne pas supprimer",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${ApiRequests.fetchEvents}/${id}`, {
            headers: Header,
          })
          .then(() => {
            Swal.fire("", "Votre évènement a bien été supprimé", "success").then(() => {
              window.location.reload(false);
            });
          })
          .catch((error) => {
            console.error(error.message);
            Swal.fire("", ErrorTokenMessage, "error");
          });
      } else if (result.isDenied) {
        Swal.fire("", "Votre évènement n'a pas été supprimé", "error");
      }
    });
  }

  render() {
    Moment.globalLocale = "fr";

    return (
      <Fragment>
        <h2 className="title-page text-center">Gestion des Évènements</h2>
        <Container className="spaces-footer">
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Évènement</th>
                <th>Lieu</th>
                <th>Date de début</th>
                <th>Date de fin</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            {this.state.events.map((event) => (
              <tbody key={event.id.toString()}>
                <tr>
                  <td>{event.id}</td>
                  <td>{event.title}</td>
                  <td>{event.city}</td>
                  <td>
                    <Moment format="D MMMM YYYY">{event.startAt}</Moment>
                  </td>
                  <td>
                    <Moment format="D MMMM YYYY">{event.endAt}</Moment>
                  </td>
                  <td>{this.statusEvent[event.status]}</td>
                  <td>
                    <a href={`/backoffice/event-edit/${event.id}`}>
                      <button className="btn-edit mx-1">
                        <i className="fas fa-pen" />
                      </button>
                    </a>
                    <button className="btn-delete mx-1" onClick={(e) => this.deleteEvent(event.id, e)}>
                      <i className="fas fa-trash-alt" />
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
          </Table>
          <div className="text-center">
            <a href="/backoffice">
              <button className="btn-back-menu">Retour au BackOffice</button>
            </a>
          </div>
        </Container>
      </Fragment>
    );
  }
}
