import React, { Fragment, Component } from "react";
import { Container, Table } from "react-bootstrap";
import axios from "axios";
import { ApiRequests, Header, Token, AdminRole, ErrorTokenMessage } from "api/BaseApi";
import Swal from "sweetalert2";

export default class BoGetUsers extends Component {
  state = {
    users: [],
  };

  componentDidMount() {
    if (!Token) {
      window.location.href = "/connexion";
    } else if (!AdminRole) {
      window.location.href = "/";
    } else {
      axios
        .get(ApiRequests.fetchUsers, { headers: Header })
        .then((fetchUsers) => {
          const users = fetchUsers.data["hydra:member"];
          this.setState({ users });
        })
        .catch((error) => {
          console.error(error.message);
          Swal.fire("", ErrorTokenMessage, "error");
        });
    }
  }

  deleteUser(id, e) {
    Swal.fire({
      title: "Supprimer",
      text: "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: "#DC143C",
      denyButtonColor: "#7db769",
      confirmButtonText: "Supprimer",
      denyButtonText: "Ne pas supprimer",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${ApiRequests.fetchUsers}/${id}`, {
            headers: Header,
          })
          .then(() => {
            Swal.fire("", "Votre utilisateur a bien été supprimé", "success").then(() => {
              window.location.reload(false);
            });
          })
          .catch((error) => {
            console.error(error.message);
            Swal.fire("", ErrorTokenMessage, "error");
          });
      } else if (result.isDenied) {
        Swal.fire("", "Votre utilisateur n'a pas été supprimé", "error");
      }
    });
  }

  render() {
    return (
      <Fragment>
        <h2 className="title-page text-center">Gestion des Utilisateurs</h2>
        <Container className="spaces-footer">
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Prénom</th>
                <th>Nom</th>
                <th>E-mail</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            {this.state.users.map((user) => (
              <tbody key={user.id.toString()}>
                <tr>
                  <td>{user.id}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.roles}</td>
                  <td>
                    <button className="btn-delete mx-1" onClick={(e) => this.deleteUser(user.id, e)}>
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
