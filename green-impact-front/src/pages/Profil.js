import React, { Component, Fragment } from "react";
import { Card, Row, Col, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import axios from "axios";
import { ApiRequests, Header, Token, ErrorTokenMessage, ErrorInfosMessage } from "api/BaseApi";
import Swal from "sweetalert2";
import "./style/Profil.scss";
import "moment/locale/fr";

export default class Profil extends Component {
  state = {
    user: [],
    order: [],
    userEvent: [],
    hasFetchData: false,
    show: false,
    newFirstName: "",
    newLastName: "",
    newEmail: "",
    newAddresses: [],
    receivedDate: "",
    sentDate: "",
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

  updateUserHandler = (e) => {
    e.preventDefault();

    const pattern = new RegExp("^[A-Z-a-z0-9._%+-]+@[A-Z-a-z0-9.-]+\\.[A-Z-a-z]{2,4}$");

    if (
      !this.state.newLastName ||
      !this.state.newFirstName ||
      !this.state.newEmail ||
      !this.state.newAddresses
    ) {
      Swal.fire("", "Veuillez renseigner tous les champs", "error");
    } else if (!pattern.test(this.state.newEmail)) {
      Swal.fire("", "Veuillez renseigner une adresse mail valide", "error");
    } else {
      const newHeader = {
        Authorization: `Bearer ${Token}`,
        "content-type": "application/merge-patch+json",
      };

      axios
        .patch(
          `${ApiRequests.fetchUsers}/${this.state.user.id}`,
          {
            lastName: this.state.newLastName,
            firstName: this.state.newFirstName,
            email: this.state.newEmail,
            addresses: [this.state.newAddresses],
          },
          { headers: newHeader }
        )
        .then(() => {
          Swal.fire("", "Vos informations ont bien été modifiés", "success").then(() => {
            window.location.reload(false);
          });
        })
        .catch((error) => {
          console.error(error.message);
          Swal.fire("", ErrorInfosMessage + ".<br/>" + ErrorTokenMessage, "error");
        });
    }
  };

  componentDidMount() {
    if (!Token) {
      window.location.href = "/connexion";
    } else {
      const id = localStorage.getItem("user_id");
      axios
        .get(`${ApiRequests.fetchUsers}/${id}`, { headers: Header })
        .then((fetchUser) => {
          const user = fetchUser.data;
          let userEventsList = [];

          if (user.events.length > 0) {
            user.events.forEach((userEvent) => {
              let eventId = userEvent.substring(8);

              axios
                .get(`${ApiRequests.fetchEvents}/${eventId}`)
                .then((fetchEvent) => {
                  const event = fetchEvent.data;
                  userEventsList.push(event);

                  if (userEventsList.length > 1) {
                    userEventsList = userEventsList.sort(
                      (a, b) => new Date(a.startAt) - new Date(b.startAt)
                    );
                  }

                  if (user.orders.length > 0) {
                    let orderId = user.orders[0].substring(8);

                    axios
                      .get(`${ApiRequests.fetchOrders}/${orderId}`, { headers: Header })
                      .then((fetchOrders) => {
                        const order = fetchOrders.data;

                        let receivedDate = new Date(order.receivedAt);
                        let sentDate = new Date(order.sentAt);

                        receivedDate = receivedDate.setDate(receivedDate.getDate() + 25);
                        sentDate = sentDate.setDate(sentDate.getDate() + 15);

                        this.setState({
                          user: user,
                          order: order,
                          userEvent: userEventsList,
                          receivedDate: receivedDate,
                          sentDate: sentDate,
                          hasFetchData: true,
                        });
                        this.setState({
                          newFirstName: user.firstName,
                          newLastName: user.lastName,
                          newEmail: user.email,
                          newAddresses: user.addresses[0],
                        });
                      })
                      .catch((error) => {
                        console.error(error.message);
                        Swal.fire("", ErrorTokenMessage, "error");
                      });
                  } else {
                    this.setState({
                      user: user,
                      order: [],
                      userEvent: userEventsList,
                      hasFetchData: true,
                    });
                    this.setState({
                      newFirstName: user.firstName,
                      newLastName: user.lastName,
                      newEmail: user.email,
                      newAddresses: user.addresses[0],
                    });
                  }
                })
                .catch((error) => {
                  console.error(error.message);
                  Swal.fire("", ErrorTokenMessage, "error");
                });
            });
          } else {
            this.setState({
              user: user,
              userEvent: userEventsList,
              hasFetchData: true,
            });
            this.setState({
              newFirstName: user.firstName,
              newLastName: user.lastName,
              newEmail: user.email,
              newAddresses: user.addresses[0],
            });
          }
        })
        .catch((error) => {
          console.error(error.message);
          Swal.fire("", ErrorTokenMessage, "error");
        });
    }
  }

  render() {
    Moment.globalLocale = "fr";

    return (
      <Fragment>
        {!this.state.hasFetchData ? (
          <div>Chargement…</div>
        ) : (
          <div className="cardProfil">
            <div className="profil">
              <div className="infos">
                <img src="assets/icons/people.png" alt="ProfilePicture" />
                <h3>
                  Bienvenue{" "}
                  <b>
                    {this.state.user.firstName} {this.state.user.lastName}
                  </b>{" "}
                  ! 👋🏼
                </h3>
              </div>

              <p>Email : {this.state.user.email}</p>
              <p>Adresse : {this.state.user.addresses}</p>

              <hr />

              <h5 className="my-4">🌳 Vos inscriptions à nos évènements</h5>
              {this.state.userEvent.map((event) => (
                <div className="event-card my-3" key={event.id.toString()}>
                  <a href={`/nos-evenements/${event.id}`}>
                    <Card style={{ borderRadius: "10px" }}>
                      <Card.Body>
                        <h5>{event.title}</h5>
                        <p className="mb-2 text-muted">
                          <i className="fas fa-map-pin" /> {event.city}
                          <i
                            className="fas fa-calendar-day"
                            style={{ marginLeft: "30px", marginRight: "5px" }}
                          />
                          <Moment format="D MMMM YYYY">{event.startAt}</Moment>
                        </p>
                        <p style={{ margin: "0" }}>{event.addresses}</p>
                      </Card.Body>
                    </Card>
                  </a>
                </div>
              ))}

              <div className="spacing-order"></div>
              <hr />
              <h5 className="my-4">🛒 Historique de vos commandes</h5>

              {this.state.user.orders.length > 0 && this.state.user.events.length > 0 ? (
                <div className="event-card my-3">
                  <Card style={{ borderRadius: "10px" }}>
                    <Card.Body>
                      <h5>1 Commande</h5>
                      <p className="mb-2 text-muted">
                        <i
                          className="fas fa-calendar-day"
                          style={{ marginRight: "5px" }}
                        />
                        Envoyer le : <Moment format="D MMMM YYYY">{this.state.sentDate}</Moment>
                        <i
                          className="fas fa-calendar-day"
                          style={{ marginLeft: "30px", marginRight: "5px" }}
                        />
                        Réceptionner le : <Moment format="D MMMM YYYY">{this.state.receivedDate}</Moment>
                      </p>
                      <p style={{ margin: "0" }}>Statut de la commande : <span style={{ fontWeight: "bold" }}>{this.state.order.status}</span>
                      </p>
                    </Card.Body>
                  </Card>
                </div>
              ) : (
                ""
              )}        

              <Row>
                <Col sm={6}>
                  <button type="button" className="editHome" onClick={this.showModal}>
                    Éditer mes informations
                  </button>
                </Col>
                <Col sm={6}>
                  <Link to={"/"}>
                    <button className="backHome">Retour à l'Accueil</button>
                  </Link>
                </Col>
              </Row>
            </div>
          </div>
        )}

        <Modal
          show={this.state.show}
          onHide={this.closeModal}
          backdrop="static"
          keyboard={false}
          size="lg"
          dialogClassName="modal-user"
        >
          <Modal.Header closeButton>
            <Modal.Title className="modal-title">Modifier mes Informations</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col sm={6}>
                <label htmlFor="newLastName">Nom</label>
                <input
                  type="text"
                  id="newLastName"
                  name="newLastName"
                  value={this.state.newLastName}
                  onChange={(e) => this.setState({ newLastName: e.target.value })}
                  required
                />
              </Col>
              <Col sm={6}>
                <label htmlFor="newFirstName">Prénom</label>
                <input
                  type="text"
                  id="newFirstName"
                  name="newFirstName"
                  value={this.state.newFirstName}
                  onChange={(e) => this.setState({ newFirstName: e.target.value })}
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <label htmlFor="newEmail">Email</label>
                <input
                  type="text"
                  id="newEmail"
                  name="newEmail"
                  value={this.state.newEmail}
                  onChange={(e) => this.setState({ newEmail: e.target.value })}
                  required
                />
              </Col>
              <Col sm={6}>
                <label htmlFor="newAddresses">Adresse</label>
                <input
                  type="text"
                  id="newAddresses"
                  name="newAddresses"
                  value={this.state.newAddresses}
                  onChange={(e) => this.setState({ newAddresses: e.target.value })}
                  required
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Row style={{ width: "100%" }}>
              <Col sm={6}>
                <button type="button" className="editProfile" onClick={this.updateUserHandler}>
                  Valider
                </button>
              </Col>
              <Col sm={6}>
                <button type="button" className="backProfile" onClick={this.closeModal}>
                  Retour
                </button>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}
