import React, { Fragment, Component } from "react";
import { Container, Table } from "react-bootstrap";
import axios from "axios";
import { ApiRequests, Header, Token, AdminRole, ErrorTokenMessage } from "api/BaseApi";
import Swal from "sweetalert2";
import "../Backoffice.scss";

export default class BoGetQuestions extends Component {
  state = {
    questions: [],
  };

  componentDidMount() {
    if (!Token) {
      window.location.href = "/connexion";
    } else if (!AdminRole) {
      window.location.href = "/";
    } else {
      axios
        .get(ApiRequests.fetchQuestions)
        .then((fetchQuestions) => {
          const questions = fetchQuestions.data["hydra:member"];
          this.setState({ questions });
        })
        .catch((error) => {
          console.error(error.message);
          Swal.fire("", ErrorTokenMessage, "error");
        });
    }
  }

  deleteQuestion(id, e) {
    Swal.fire({
      title: "Supprimer",
      text: "Êtes-vous sûr de vouloir supprimer cette question ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: "#DC143C",
      denyButtonColor: "#7db769",
      confirmButtonText: "Supprimer",
      denyButtonText: "Ne pas supprimer",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${ApiRequests.fetchQuestions}/${id}`, {
            headers: Header,
          })
          .then(() => {
            Swal.fire("", "Votre question a bien été supprimée", "success").then(() => {
              window.location.reload(false);
            });
          })
          .catch((error) => {
            console.error(error.message);
            Swal.fire("", ErrorTokenMessage, "error");
          });
      } else if (result.isDenied) {
        Swal.fire("", "Votre question n'a pas été supprimée", "error");
      }
    });
  }

  render() {
    return (
      <Fragment>
        <h2 className="title-page text-center">Gestion des questions</h2>
        <Container className="spaces-footer">
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Questions</th>
                <th>Actions</th>
              </tr>
            </thead>
            {this.state.questions.map((question) => (
              <tbody key={question.id.toString()}>
                <tr>
                  <td>{question.id}</td>
                  <td>{question.name}</td>
                  <td>
                    <a href={`/backoffice/question-edit/${question.id}`}>
                      <button className="btn-edit mx-1">
                        <i className="fas fa-pen" />
                      </button>
                    </a>
                    <button className="btn-delete mx-1" onClick={(e) => this.deleteQuestion(question.id, e)}>
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
