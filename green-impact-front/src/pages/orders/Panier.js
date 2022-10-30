import React, { Component, Fragment } from "react";
import { Container, Card, Row, Col, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { ApiRequests, Header, Token, ErrorTokenMessage } from "api/BaseApi";
import Swal from "sweetalert2";
import CheckoutPanier from "./CheckoutPanier";

export default class Panier extends Component {
  state = {
    show: false,
    user: [],
    userOrder: [],
    orderItems: [],
    items: [],
    firstName: "",
    lastName: "",
    email: "",
    addresses: [],
    totalPrice: 0,
  };

  constructor(props) {
    super(props);

    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  showModal() {
    this.setState({ show: true });
  }

  closeModal() {
    this.setState({ show: false });
  }

  fetchOrders(orderId, user) {
    axios
      .get(`${ApiRequests.fetchOrders}/${orderId}`, { headers: Header })
      .then((fetchOrders) => {
        const order = fetchOrders.data;

        let userOrdersItemsList = [];
        let itemsList = [];

        order.orderItems.forEach((orderItem) => {
          let orderItemId = orderItem.substring(13);

          this.fetchOrdersItems(orderItemId, user, order, itemsList, userOrdersItemsList);
        });
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  fetchOrdersItems(orderItemId, user, order, itemsList, userOrdersItemsList) {
    axios
      .get(`${ApiRequests.fetchOrdersItems}/${orderItemId}`, { headers: Header })
      .then((fetchOrdersItems) => {
        const ordersItems = fetchOrdersItems.data;
        const itemId = ordersItems.relatedItem.substring(7);
        userOrdersItemsList.push(ordersItems);
        this.fetchItems(itemId, user, order, itemsList, userOrdersItemsList);
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  fetchItems(itemId, user, order, itemsList, userOrdersItemsList) {
    axios
      .get(`${ApiRequests.fetchItems}/${itemId}`)
      .then((fetchItems) => {
        const item = fetchItems.data;
        itemsList.push(item);

        const totalPrice = this.state.totalPrice + Number(item.price);

        itemsList = itemsList.sort((a, b) => a.id - b.id);

        this.setState({
          user: user,
          userOrder: order,
          orderItems: userOrdersItemsList,
          items: itemsList,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          addresses: user.addresses[0],
          totalPrice: totalPrice,
          hasFetchData: true,
        });
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  componentDidMount() {
    if (!Token) {
      window.location.href = "/connexion";
    } else {
      const id = localStorage.getItem("user_id");
      axios
        .get(`${ApiRequests.fetchUsers}/${id}`, { headers: Header })
        .then((fetchUser) => {
          const user = fetchUser.data;

          if (user.orders.length > 0) {
            user.orders.forEach((userOrder) => {
              let orderId = userOrder.substring(8);
              this.fetchOrders(orderId, user);
            });
          } else {
            this.setState({
              user: user,
              userOrder: [],
              orderItems: [],
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              addresses: user.addresses[0],
              totalPrice: 0,
              hasFetchData: true,
            });
          }
        })
        .catch((error) => {
          console.error(error.message);
          Swal.fire("", ErrorTokenMessage, "error");
        });
    }
  }

  deleteOrderItem(itemId) {
    Swal.fire({
      title: "Supprimer",
      text: "Êtes-vous sûr de vouloir supprimer cet article de votre panier ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: "#DC143C",
      denyButtonColor: "#7db769",
      confirmButtonText: "Supprimer",
      denyButtonText: "Ne pas supprimer",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .get(ApiRequests.fetchOrdersItems, { headers: Header })
          .then((fetchOrdersItemsList) => {
            const ordersItemsList = fetchOrdersItemsList.data["hydra:member"];

            const ordersItemsListFind = ordersItemsList.find(
              (orderItem) =>
                orderItem.relatedItem === "/items/" + itemId &&
                orderItem.relatedOrder === this.state.userOrder["@id"]
            );

            if (ordersItemsListFind) {
              axios
                .delete(`${ApiRequests.fetchOrdersItems}/${ordersItemsListFind.id}`, {
                  headers: Header,
                })
                .then(() => {
                  Swal.fire(
                    "",
                    "Votre article a bien été supprimé de votre panier",
                    "success"
                  ).then(() => {
                    window.location.reload(false);
                  });
                })
                .catch((error) => {
                  console.error(error.message);
                  Swal.fire("", ErrorTokenMessage, "error");
                });
            }
          })
          .catch((error) => {
            console.error(error.message);
            Swal.fire("", ErrorTokenMessage, "error");
          });
      } else if (result.isDenied) {
        Swal.fire("", "Votre article n'a pas été supprimé de votre panier", "error");
      }
    });
  }

  cleanCart = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Vider votre panier",
      text: "Êtes-vous sûr de vouloir vider votre panier ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: "#DC143C",
      denyButtonColor: "#7db769",
      confirmButtonText: "Vider",
      denyButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.state.orderItems.forEach((orderItem, index) => {
          axios
            .delete(`${ApiRequests.fetchOrdersItems}/${orderItem.id}`, {
              headers: Header,
            })
            .then(() => {
              if (index === this.state.orderItems.length - 1) {
                Swal.fire("", "Votre panier a bien été vidé", "success").then(() => {
                  window.location.href = "/boutique";
                });
              }
            })
            .catch((error) => {
              console.error(error.message);
              Swal.fire("", ErrorTokenMessage, "error");
            });
        });
      } else if (result.isDenied) {
        Swal.fire("", "Votre panier n'a pas été vidé", "error");
      }
    });
  };

  submitPayment = (e) => {
    e.preventDefault();

    const payment = {
      amount: this.state.totalPrice * 100,
      crypto: 123,
      card: 4242424242424242,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      expiredDAte: "12/12/2022",
    };

    Swal.fire({
      title: "Confirmer votre paiement",
      text: "Êtes-vous sûr de vouloir finaliser votre paiement ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: "#7db769",
      denyButtonColor: "#DC143C",
      confirmButtonText: "Payer",
      denyButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(ApiRequests.fetchPayment, payment, { headers: Header })
          .then(() => {
            this.state.orderItems.forEach((orderItem, index) => {
              axios
                .delete(`${ApiRequests.fetchOrdersItems}/${orderItem.id}`, {
                  headers: Header,
                })
                .then(() => {
                  if (index === this.state.orderItems.length - 1) {
                    const newHeader = {
                      Authorization: `Bearer ${Token}`,
                      "content-type": "application/merge-patch+json",
                    };

                    const orderId = this.state.userOrder.id;

                    axios
                      .patch(`${ApiRequests.fetchOrders}/${orderId}`, { status: [ "Paiement effectué" ] }, { headers: newHeader })
                      .then(() => {
                        Swal.fire("", "Votre paiement a bien été effectué", "success").then(() => {
                          window.location.href = "/boutique";
                        });
                      })
                      .catch((error) => {
                        console.error(error.message);
                        Swal.fire("", ErrorTokenMessage, "error");
                      });
                  }
                })
                .catch((error) => {
                  console.error(error.message);
                  Swal.fire("", ErrorTokenMessage, "error");
                });
            });
          })
          .catch((error) => {
            console.error(error.message);
            Swal.fire("", ErrorTokenMessage, "error");
          });
      } else if (result.isDenied) {
        Swal.fire("", "Votre paiement n'a pas été finalisé", "error");
      }
    });
  };

  render() {
    return (
      <Fragment>
        {!this.state.hasFetchData ? (
          <Container className="panierVide">
            <img src="assets/icons/caddie.png" alt="panierVide" />
            <br />
            Votre panier est vide ...
          </Container>
        ) : (
          <div>
            <h2 className="text-center title-page">Mon panier</h2>
            <Container className="spaces-footer">
              <div className="pagePanier">
                {this.state.items.map((item) => (
                  <Card className="my-4 panierCard" key={item.id.toString()}>
                    <Card.Body>
                      <Row>
                        <Col sm={3} className={!item.image ? "picture-card" : ""}>
                          {item.image ? (
                            <img
                              className="panier-picture"
                              src={`https://green-impact.tk/${item.image.contentUrl}`}
                              alt="imageEvent"
                            />
                          ) : (
                            <img
                              className="panier-picture"
                              src="assets/event-logo.png"
                              alt="logo"
                            />
                          )}
                        </Col>
                        <Col
                          sm={8}
                          style={{ paddingTop: "10px" }}
                          className={!item.image ? "text-card" : ""}
                        >
                          <h4 style={{ color: "#161616", fontWeight: "900" }}>{item.name}</h4>
                          <p>
                            Taille : {localStorage.getItem('selected_size')} <span className="mx-1">-</span> {item.price} €
                          </p>
                          <p>{item.description}</p>
                          <p className="my-2" style={{ textDecoration: "underline" }}>
                            <Link to={`/boutique/${item.id}`}>Voir le produit</Link>
                          </p>
                        </Col>
                        <Col sm={1}>
                          <button
                            className="btn-delete mx-1"
                            onClick={() => this.deleteOrderItem(item.id)}
                          >
                            <i className="fas fa-trash-alt" />
                          </button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
                <p className="price">
                  Prix total : <span>{this.state.totalPrice} €</span>
                </p>
                <div className="buttons">
                  <Link to="/boutique">
                    <button className="shop mx-3">Revenir à la boutique</button>
                  </Link>
                  <button onClick={(e) => this.cleanCart(e)} className="payment clean">
                    Vider votre panier
                  </button>
                  <button onClick={this.showModal} className="payment">
                    Finaliser votre achat
                  </button>
                  <Modal
                    show={this.state.show}
                    onHide={this.closeModal}
                    backdrop="static"
                    keyboard={false}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title className="modal-title">Informations de paiement</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <CheckoutPanier/>
                      <button className="submitCard" onClick={(e) => this.submitPayment(e)}>
                        Valider
                      </button>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            </Container>
          </div>
        )}
      </Fragment>
    );
  }
}
