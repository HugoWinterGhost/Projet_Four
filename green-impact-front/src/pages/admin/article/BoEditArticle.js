import React, { Component, Fragment } from "react";
import { Row, Col } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import { Link } from "react-router-dom";
import axios from "axios";
import { ApiRequests, ErrorTokenMessage, ErrorInfosMessage, Token, AdminRole, Header } from "api/BaseApi";
import Swal from "sweetalert2";
import "../Backoffice.scss";

export default class BoEditArticle extends Component {
  state = {
    id: "",
    name: "",
    description: "",
    image: [],
    price: 0,
    size: [],
    category: "",
    collection: "",
    categories: [],
    collections: [],
    article: [],
    hasFetchData: false,
  };

  sizeList = [{ name: "XS" }, { name: "S" }, { name: "M" }, { name: "L" }, { name : "XL" }];

  getArticlesById(id) {
    axios
      .get(`${ApiRequests.fetchItems}/${id}`)
      .then((fetchItems) => {
        const article = fetchItems.data;

        article.size.forEach((size, index) => {
          article.size[index] = { name: size };
        });

        axios
          .get(`${ApiRequests.fetchCategories}`)
          .then((fetchCategories) => {
            const categories = fetchCategories.data["hydra:member"];

            axios
              .get(`${ApiRequests.fetchCollections}`)
              .then((fetchCollections) => {
                const collections = fetchCollections.data["hydra:member"];
                this.setState({ article: article, categories: categories, collections: collections, name: article.name, description: article.description, price: article.price, size: article.size, category: article.category, collection: article.collection, id: article.id, hasFetchData: true });
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
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  updateArticleHandler = (e) => {
    e.preventDefault();

    const newHeader = {
      Authorization: `Bearer ${Token}`,
      "content-type": "application/merge-patch+json",
    };

    let formData = new FormData();
    formData.append("file", this.state.image[0]);

    const itemSizeList = [];
    this.state.size.map((size) => itemSizeList.push(size.name));

    if (itemSizeList.length === 0) {
      return;
    }

    axios
      .post(ApiRequests.fetchMediaObjects, formData, { headers: Header })
      .then((fetchMediaObjects) => {
        const image = fetchMediaObjects.data["@id"];

        axios
          .patch(`${ApiRequests.fetchItems}/${this.state.id}`, { name: this.state.name, description: this.state.description, price: Number(this.state.price), size: itemSizeList, category: this.state.category, collection: this.state.collection, image: image }, { headers: newHeader })
          .then(() => {
            Swal.fire("", "Votre article a bien été modifié", "success").then(() => {
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
      this.getArticlesById(id);
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
                <form onSubmit={this.updateArticleHandler}>
                  <h4>
                    Modifier l'article <b>"{this.state.article.name}"</b>
                  </h4>

                  <label htmlFor="name">Nom de l'article</label>
                  <input type="text" id="name" name="name" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} required />

                  <label htmlFor="size">Taille de l'article</label>
                  <Multiselect
                    id="size" 
                    name="size"
                    className="multi-select"
                    options={this.sizeList}
                    selectedValues={this.state.size}
                    displayValue="name"
                    placeholder="Non défini"
                    onSelect={(event) => this.setState({ size: event })}
                    onRemove={(event) => this.setState({ size: event })}
                  />

                  <label htmlFor="description">Description de l'article</label>
                  <textarea id="description" name="description" value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} required />

                  <Row>
                    <Col sm={6}>
                      <label htmlFor="price">Prix (en euros)</label>
                      <input type="number" id="price" name="price" min="1" value={this.state.price} onChange={(e) => this.setState({ price: e.target.value })} required />
                    </Col>
                    <Col sm={6}>
                      <label htmlFor="category">Catégorie</label>
                      <select style={{ cursor: "pointer" }} id="category" name="category" value={this.state.category} onChange={(e) => this.setState({ category: e.target.value })} required>
                        <option value="">Non défini</option>
                        {this.state.categories.map((category) => (
                          <option key={category.id.toString()} value={category["@id"]}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={6}>
                      <label htmlFor="collection">Collection</label>
                      <select style={{ cursor: "pointer" }} id="collection" name="collection" value={this.state.collection} onChange={(e) => this.setState({ collection: e.target.value })} required>
                        <option value="">Non défini</option>
                        {this.state.collections.map((collection) => (
                          <option key={collection.id.toString()} value={collection["@id"]}>
                            {collection.name}
                          </option>
                        ))}
                      </select>
                    </Col>
                    <Col sm={6}>
                      <label htmlFor="image">Image de l'article</label>
                      <input type="file" id="image" name="image" onChange={(e) => this.setState({ image: [e.target.files[0]] })} required />
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={6}>
                      <button type="submit" className="add">
                        Éditer cet article
                      </button>
                    </Col>
                    <Col sm={6}>
                      <Link to={"/backoffice/articles-list"}>
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
