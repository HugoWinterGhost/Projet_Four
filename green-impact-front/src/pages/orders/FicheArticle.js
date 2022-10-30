import React, { Component, Fragment } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { ApiRequests, ErrorTokenMessage, Header, Token } from "api/BaseApi";
import Swal from "sweetalert2";

export default class FicheArticle extends Component {
  state = {
    item: [],
    category: [],
    selectedSize: '',
  };

  sizeItemList = [];

  componentDidMount() {
    const id = this.props.match.params.id;
    axios
      .get(`${ApiRequests.fetchItems}/${id}`)
      .then((fetchItems) => {
        const item = fetchItems.data;

        if (item.size.length > 1) {
          item.size.map((size) => this.sizeItemList.push(size));
        } else {
          this.sizeItemList.push(item.size);
        }

        localStorage.setItem("item", JSON.stringify(item));

        const id = item.category.substring(12);

        axios
          .get(`${ApiRequests.fetchCategories}/${id}`)
          .then((fetchCategories) => {
            const category = fetchCategories.data;
            this.setState({ item: item, category: category });
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

  createOrderItems(order_items) {
    axios
      .post(ApiRequests.fetchOrdersItems, order_items, { headers: Header })
      .then(() => {
        Swal.fire("", "Votre article a bien été ajouté au panier", "success").then(() => {
          window.location.reload(false);
        });
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  createOrder(userIdTemplate, itemId) {
    const order = {
      status: ["En cours"],
      price: Number(this.state.item.price),
      sentAt: new Date(),
      receivedAt: new Date(),
      owner: userIdTemplate,
    };

    axios
      .post(ApiRequests.fetchOrders, order, { headers: Header })
      .then((fetchOrders) => {
        const order_items = {
          quantity: 1,
          relatedOrder: fetchOrders.data["@id"],
          relatedItem: "/items/" + itemId,
        };
        this.createOrderItems(order_items);
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  updateStatusOrder(orderId, ordersListFind, itemId) {
    const newHeader = {
      Authorization: `Bearer ${Token}`,
      "content-type": "application/merge-patch+json",
    };

    axios
      .patch(`${ApiRequests.fetchOrders}/${orderId}`, { status: [ "En cours" ] }, { headers: newHeader })
      .then(() => {
        this.buildOrderItems(ordersListFind, itemId);
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  buildOrderItems(ordersListFind, itemId) {
    const order_items = {
      quantity: 1,
      relatedOrder: ordersListFind["@id"],
      relatedItem: "/items/" + itemId,
    };

    axios
      .get(ApiRequests.fetchOrdersItems, { headers: Header })
      .then((fetchOrdersItemsList) => {
        const ordersItemsList = fetchOrdersItemsList.data["hydra:member"];

        const ordersItemsListFind = ordersItemsList.find(
          (orderItem) => 
            orderItem.relatedItem === order_items.relatedItem &&
            orderItem.relatedOrder === ordersListFind["@id"]
        );

        if (ordersItemsListFind) {
          Swal.fire("", "Vous possédez déjà cet article dans votre panier", "error");
        } else {
          this.createOrderItems(order_items);
        }
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  addToCart(itemId) {
    const userIdTemplate = "/users/" + localStorage.getItem("user_id");

    axios
      .get(ApiRequests.fetchOrders, { headers: Header })
      .then((fetchOrdersList) => {
        const ordersList = fetchOrdersList.data["hydra:member"];
        const ordersListFind = ordersList.find((order) => order.owner === userIdTemplate);

        localStorage.setItem('selected_size', this.state.selectedSize);

        if (ordersListFind) {
          this.updateStatusOrder(ordersListFind.id, ordersListFind, itemId);      
        } else {
          this.createOrder(userIdTemplate, itemId);
        }
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  render() {
    const renderAddToCart = () => {
      if (Token) {
        return (
          <div onClick={() => this.addToCart(this.state.item.id)} className="button-add-cart">
            <button type="button" className="addcart btn btn-success">
              Ajouter au panier <i className="fas fa-cart-arrow-down" />
            </button>
          </div>
        );
      }
      return "";
    }

    return (
      <Fragment>
        {!this.state.item ? (
          <div className="text-center my-5">
            <h5 className="my-3">Nous ne trouvons pas d'évènements associés à votre recherche ...</h5>
          </div>
        ) : (
          <Container className="ficheArticle spaces-footer" style={{ padding: "30px" }}>
            <Row>
              <Col sm={6} className="text-center">
                {this.state.item.image ? <img src={`https://green-impact.tk/${this.state.item.image.contentUrl}`} alt="photoArticle" style={{ width: "18rem", height: "18rem" }}></img> : <img src="assets/greenlogo.png" alt="logo" />}
              </Col>
              <Col sm={6}>
                <h2 style={{ color: "#161616", textTransform: "capitalize" }}>{this.state.item.name}</h2>
                <hr />
                <h4>
                  Catégorie : {this.state.category.name}
                  <br />
                  Prix : {this.state.item.price} €
                </h4>
                <div className="choose-size">
                  <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
                    Tailles disponibles :
                  </Form.Label>
                  <Form.Control style={{ cursor: "pointer" }} onChange={(e) => this.setState({ selectedSize: e.target.value })} 
                    as="select" className="my-1 mr-sm-2" id="inlineFormCustomSelectPref">
                    <option value="">Choisir...</option>
                    {this.sizeItemList.map((size, index) => (
                      <option key={index.toString()} value={size}>
                        {size}
                      </option>
                    ))}
                  </Form.Control>
                </div>
                <br />
                {renderAddToCart()}
              </Col>
            </Row>
            <hr className="mt-4 mb-3" />
            <h4>Description :</h4>
            <p>{this.state.item.description}</p>
            <hr />
            <div className="text-center garantie" style={{ paddingTop: "20px" }}>
              <Row>
                <Col sm={4}>
                  <i className="fas fa-truck-loading fa-5x" style={{ color: "#e5bc94" }} />
                  <h4 className="mt-4">Livraison</h4>
                  Les livraisons et retours sont gratuites en France Métropolitaine.
                </Col>
                <Col sm={4}>
                  <i className="fas fa-recycle fa-5x" style={{ color: "#7DB769" }} />
                  <h4 className="mt-4">Produits Éco-responsable</h4>
                  Tous nos produits sont issus de matériaux 100% recyclés.
                </Col>
                <Col sm={4}>
                  <i className="fas fa-comments fa-5x" style={{ color: "#028bca" }} />
                  <h4 className="mt-4">SAV Français</h4>
                  Notre équipe est disponible par téléphone ou par mail du lundi au samedi de 10h à 20h.
                </Col>
              </Row>
            </div>

            <Link to="/boutique" style={{ textDecoration: "none", display: "block", marginTop: "3rem", textAlign: "center" }}>
              <button className="cancel-button">Revenir à la boutique</button>
            </Link>
          </Container>
        )}
      </Fragment>
    );
  }
}
