import React, { Fragment, Component } from "react";
import { Container, Table } from "react-bootstrap";
import axios from "axios";
import { ApiRequests, Header, Token, AdminRole, ErrorTokenMessage } from "api/BaseApi";
import Swal from "sweetalert2";

export default class BoGetImpacts extends Component {
  state = {
    impacts: [],
    wastes: [],
  };

  componentDidMount() {
    if (!Token) {
      window.location.href = "/connexion";
    } else if (!AdminRole) {
      window.location.href = "/";
    } else {
      axios
        .get(ApiRequests.fetchImpacts)
        .then((fetchImpact) => {
          const impacts = fetchImpact.data["hydra:member"];
          this.setState({ impacts: impacts });

          axios
            .get(ApiRequests.fetchWastes)
            .then((fetchWaste) => {
              const wastes = fetchWaste.data["hydra:member"];
              this.setState({ wastes: wastes });
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
  }

  deleteImpact(id, e) {
    Swal.fire({
      title: "Supprimer",
      text: "Êtes-vous sûr de vouloir supprimer cet impact ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: "#DC143C",
      denyButtonColor: "#7db769",
      confirmButtonText: "Supprimer",
      denyButtonText: "Ne pas supprimer",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${ApiRequests.fetchImpacts}/${id}`, {
            headers: Header,
          })
          .then(() => {
            Swal.fire("", "Votre impact a bien été supprimé", "success").then(() => {
              window.location.reload(false);
            });
          })
          .catch((error) => {
            console.error(error.message);
            Swal.fire("", ErrorTokenMessage, "error");
          });
      } else if (result.isDenied) {
        Swal.fire("", "Votre impact n'a pas été supprimé", "error");
      }
    });
  }

  render() {
    const renderWasteImpact = (waste) => {
      if (waste && Token) {
        const wasteImpact = this.state.wastes.find((fetchWaste) => fetchWaste["@id"] === waste);
        if (wasteImpact) {
          return wasteImpact.name;
        }
      }
      return "";
    };

    return (
      <Fragment>
        <h2 className="title-page text-center">Gestion des Impacts</h2>
        <Container className="spaces-footer">
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Impact</th>
                <th>Description</th>
                <th>Durée de recyclage</th>
                <th>Déchet</th>
                <th>Actions</th>
              </tr>
            </thead>
            {this.state.impacts.map((impact) => (
              <tbody key={impact.id.toString()}>
                <tr>
                  <td>{impact.id}</td>
                  <td>{impact.title}</td>
                  <td>{impact.description}</td>
                  <td>{impact.recycling} ans</td>
                  <td>{renderWasteImpact(impact.waste)}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <a href={`/backoffice/impact-edit/${impact.id}`}>
                      <button className="btn-edit mx-1">
                        <i className="fas fa-pen" />
                      </button>
                    </a>
                    <button className="btn-delete mx-1" onClick={(e) => this.deleteImpact(impact.id, e)}>
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
