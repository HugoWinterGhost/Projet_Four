import React, { Fragment, Component } from "react";
import { Container, Table } from "react-bootstrap";
import axios from "axios";
import { ApiRequests, Header, Token, AdminRole, ErrorTokenMessage } from "api/BaseApi";
import Swal from "sweetalert2";
import "../Backoffice.scss";

export default class BoGetWastes extends Component {
  state = {
    wastes: [],
  };

  componentDidMount() {
    if (!Token) {
      window.location.href = "/connexion";
    } else if (!AdminRole) {
      window.location.href = "/";
    } else {
      axios
        .get(ApiRequests.fetchWastes)
        .then((fetchWastes) => {
          const wastes = fetchWastes.data["hydra:member"];
          this.setState({ wastes });
        })
        .catch((error) => {
          console.error(error.message);
          Swal.fire("", ErrorTokenMessage, "error");
        });
    }
  }

  deleteWaste(id, e) {
    Swal.fire({
      title: "Supprimer",
      text: "Êtes-vous sûr de vouloir supprimer ce déchet ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: "#DC143C",
      denyButtonColor: "#7db769",
      confirmButtonText: "Supprimer",
      denyButtonText: "Ne pas supprimer",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${ApiRequests.fetchWastes}/${id}`, {
            headers: Header,
          })
          .then(() => {
            Swal.fire("", "Votre déchet a bien été supprimé", "success").then(() => {
              window.location.reload(false);
            });
          })
          .catch((error) => {
            console.error(error.message);
            Swal.fire("", ErrorTokenMessage, "error");
          });
      } else if (result.isDenied) {
        Swal.fire("", "Votre déchet n'a pas été supprimé", "error");
      }
    });
  }

  render() {
    return (
      <Fragment>
        <h2 className="title-page text-center">Gestion des déchets</h2>
        <Container className="spaces-footer">
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Actions</th>
              </tr>
            </thead>
            {this.state.wastes.map((waste) => (
              <tbody key={waste.id.toString()}>
                <tr>
                  <td>{waste.id}</td>
                  <td>{waste.name}</td>
                  <td>
                    <a href={`/backoffice/waste-edit/${waste.id}`}>
                      <button className="btn-edit mx-1">
                        <i className="fas fa-pen" />
                      </button>
                    </a>
                    <button className="btn-delete mx-1" onClick={(e) => this.deleteWaste(waste.id, e)}>
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
