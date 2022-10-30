import React, { Fragment, Component } from "react";
import { Container, Table } from "react-bootstrap";
import axios from "axios";
import { ApiRequests, Header, Token, AdminRole, ErrorTokenMessage } from "api/BaseApi";
import Swal from "sweetalert2";
import "../Backoffice.scss";

export default class BoGetArticles extends Component {
  state = {
    items: [],
    categories: [],
  };

  componentDidMount() {
    if (!Token) {
      window.location.href = "/connexion";
    } else if (!AdminRole) {
      window.location.href = "/";
    } else {
      axios
        .get(ApiRequests.fetchItems)
        .then((fetchItem) => {
          const items = fetchItem.data["hydra:member"];

          items.forEach((item) => {
            if (item.size.length > 1) {
              item.size = item.size.join(", ");
            }
          });          
          
          axios
            .get(ApiRequests.fetchCategories)
            .then((fetchCategory) => {
              const categories = fetchCategory.data["hydra:member"];
              this.setState({ items: items, categories: categories });
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

  deleteArticle(id, e) {
    Swal.fire({
      title: "Supprimer",
      text: "Êtes-vous sûr de vouloir supprimer cet article ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: "#DC143C",
      denyButtonColor: "#7db769",
      confirmButtonText: "Supprimer",
      denyButtonText: "Ne pas supprimer",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${ApiRequests.fetchItems}/${id}`, {
            headers: Header,
          })
          .then(() => {
            Swal.fire("", "Votre article a bien été supprimé", "success").then(() => {
              window.location.reload(false);
            });
          })
          .catch((error) => {
            console.error(error.message);
            Swal.fire("", ErrorTokenMessage, "error");
          });
      } else if (result.isDenied) {
        Swal.fire("", "Votre article n'a pas été supprimé", "error");
      }
    });
  }

  render() {
    const renderCategoryArticle = (category) => {
      if (category && Token) {
        const categoryArticle = this.state.categories.find((fetchCategory) => fetchCategory["@id"] === category);
        if (categoryArticle) {
          return categoryArticle.name;
        }
      }
      return "";
    };
    return (
      <Fragment>
        <h2 className="title-page text-center">Gestion des articles de boutique</h2>
        <Container className="spaces-footer">
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nom du produit</th>
                <th>Catégorie</th>
                <th>Taille</th>
                <th>Prix</th>
                <th>Actions</th>
              </tr>
            </thead>
            {this.state.items.map((item) => (
              <tbody key={item.id.toString()}>
                <tr>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{renderCategoryArticle(item.category)}</td>
                  <td>{item.size}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{item.price} €</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <a href={`/backoffice/article-edit/${item.id}`}>
                      <button className="btn-edit mx-1">
                        <i className="fas fa-pen" />
                      </button>
                    </a>
                    <button className="btn-delete mx-1" onClick={(e) => this.deleteArticle(item.id, e)}>
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
