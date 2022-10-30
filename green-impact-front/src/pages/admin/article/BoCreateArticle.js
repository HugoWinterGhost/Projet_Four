import React, { Component, Fragment } from "react";
import { Row, Col } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import { Link } from "react-router-dom";
import axios from "axios";
import { ApiRequests, Header, Token, AdminRole, ErrorTokenMessage, ErrorInfosMessage } from "api/BaseApi";
import Swal from "sweetalert2";

export default class BoCreateArticle extends Component {
  state = {
    name: "",
    description: "",
    image: [],
    price: 0,
    size: [],
    category: "",
    collection: "",
    categories: [],
    collections: [],
  };

  sizeList = [{ name: "XS" }, { name: "S" }, { name: "M" }, { name: "L" }, { name: "XL" }];

  componentDidMount() {
    if (!Token) {
      window.location.href = "/connexion";
    }

    else if (!AdminRole) {
      window.location.href = "/";
    }

    axios
      .get(`${ApiRequests.fetchCategories}`)
      .then((fetchCategories) => {
        const categories = fetchCategories.data["hydra:member"];

        axios
          .get(`${ApiRequests.fetchCollections}`)
          .then((fetchCollections) => {
            const collections = fetchCollections.data["hydra:member"];
            this.setState({ categories: categories, collections: collections });
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

  handleSubmit = (e) => {
    e.preventDefault();

    const pushData = async (item) => {
      let formData = new FormData();
      formData.append("file", this.state.image[0]);

      axios
        .post(ApiRequests.fetchMediaObjects, formData, { headers: Header })
        .then((fetchMediaObjects) => {
          item.image = fetchMediaObjects.data["@id"];

          axios
            .post(ApiRequests.fetchItems, item, { headers: Header })
            .then(() => {
              Swal.fire("", "Votre article a bien été enregistré", "success").then(() => {
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

    const itemSizeList = [];
    this.state.size.map((size) => itemSizeList.push(size.name));

    if (itemSizeList.length === 0) {
      return;
    }

    const item = {
      name: this.state.name,
      description: this.state.description,
      image: this.state.image,
      price: Number(this.state.price),
      size: itemSizeList,
      category: this.state.category,
      collection: this.state.collection,
    };

    Swal.fire({
      title: "Créer un article",
      text: "Êtes-vous sûr de vouloir créer cet article ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: "#7db769",
      denyButtonColor: "#DC143C",
      confirmButtonText: "Créer",
      denyButtonText: "Ne pas créer",
    }).then((result) => {
      if (result.isConfirmed) {
        pushData(item);
      } else if (result.isDenied) {
        Swal.fire("", "Votre article n'a pas été créé", "error");
      }
    });
  };
  render() {
    return (
      <Fragment>
        <div className="cardBackoffice spaces-card">
          <form onSubmit={this.handleSubmit}>
            <h4>Création d'un article</h4>

            <Row>
              <Col sm={6}>
                <label htmlFor="name">Nom de l'article</label>
                <input id="name" type="text" name="name" placeholder="T-shirt" onChange={(e) => this.setState({ name: e.target.value })} required />
              </Col>
              <Col sm={6}>
                <label htmlFor="size">Taille de l'article</label>
                <Multiselect id="size" name="size" className="multi-select" options={this.sizeList} displayValue="name" placeholder="Non défini" onSelect={(event) => this.setState({ size: event })} onRemove={(event) => this.setState({ size: event })} />
              </Col>
            </Row>

            <Row>
              <Col sm={6}>
                <label htmlFor="category">Catégorie</label>
                <select style={{ cursor: "pointer" }} id="category" name="category" onChange={(e) => this.setState({ category: e.target.value })} required>
                  <option value="">Non défini</option>
                  {this.state.categories.map((category) => (
                    <option key={category.id.toString()} value={category["@id"]}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </Col>
              <Col sm={6}>
                <label htmlFor="price">Prix (en euros)</label>
                <input id="price" type="number" name="price" min="1" placeholder="15 €" onChange={(e) => this.setState({ price: e.target.value })} required />
              </Col>
            </Row>

            <label htmlFor="description">Description</label>
            <input id="description" type="text" name="description" placeholder="Matière : Coton" onChange={(e) => this.setState({ description: e.target.value })} required />

            <Row>
              <Col sm={6}>
                <label htmlFor="collection">Collection</label>
                <select style={{ cursor: "pointer" }} id="collection" name="collection" onChange={(e) => this.setState({ collection: e.target.value })} required>
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
