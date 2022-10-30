import React, { Component, Fragment } from "react";
import { Navbar, Nav, Dropdown, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { ApiRequests, Token, ErrorTokenMessage, ErrorUnauthorizedMessage } from "api/BaseApi";
import Swal from "sweetalert2";
import Loader from "../loader/Loader";
import "./Header.scss";

export default class Header extends Component {
  state = {
    cookies: false,
    loading: true,
    hasFetchData: false,
  };

  constructor(props) {
    super(props);

    this.acceptCookies = this.acceptCookies.bind(this);
  }

  getUserAccessRole() {
    const id = localStorage.getItem("user_id");

    const newHeader = {
      Authorization: `Bearer ${Token}`,
    };

    axios
      .get(`${ApiRequests.fetchUsers}/${id}`, { headers: newHeader })
      .then((fetchUsers) => {
        const user = fetchUsers.data;
        localStorage.setItem("user_roles", JSON.stringify(user.roles));

        if (user.roles.includes("ROLE_ADMIN")) {
          localStorage.setItem("admin", true);
        }

        this.setState({ hasFetchData: true });
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.error(error.message);
          Swal.fire("", ErrorUnauthorizedMessage, "info").then(() => {
            this.logout();
          });
        } else {
          console.error(error.message);
          Swal.fire("", ErrorTokenMessage, "error");
        }
      });
  }

  showCookies() {
    this.setState({ cookies: true });
  }

  acceptCookies() {
    localStorage.setItem("cookies", "true");
    this.setState({ cookies: false });
  }

  logout() {
    if (Token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_roles");
      localStorage.removeItem("admin");
      window.location.href = "/";
    }
  }

  componentDidMount() {
    if (!localStorage.getItem("cookies")) {
      this.showCookies();
    }

    if (window.location.pathname !== "/nos-evenements") {
      setTimeout(() => {
        this.setState({ loading: false });
      }, 500);
    }

    window.addEventListener("scroll", this.handleScroll);

    if (Token) {
      this.getUserAccessRole();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    if (window.scrollY > 50) {
      document.querySelector(".navbar").className =
        "navbar navbar-expand-lg navbar-light sticky-top scroll";
    } else {
      document.querySelector(".navbar").className =
        "navbar navbar-expand-lg navbar-light sticky-top";
    }
  };

  render() {
    const renderLoader = () => {
      if (this.state.loading && window.location.pathname !== "/nos-evenements") {
        return <Loader />;
      }

      return "";
    };

    const renderAuthHeader = () => {
      if (Token && this.state.hasFetchData) {
        if (localStorage.getItem("admin")) {
          return (
            <Dropdown.Menu>
              <Dropdown.Item href="/profil">
                <i className="fas fa-user-circle" /> Mon compte
              </Dropdown.Item>
              <Dropdown.Item href="/backoffice">
                <i className="fas fa-tools" /> Backoffice
              </Dropdown.Item>
              <hr />
              <Dropdown.Item onClick={this.logout}>
                <i className="fas fa-sign-out-alt" /> Déconnexion
              </Dropdown.Item>
            </Dropdown.Menu>
          );
        } else {
          return (
            <Dropdown.Menu>
              <Dropdown.Item href="/profil">
                <i className="fas fa-user-circle" /> Mon compte
              </Dropdown.Item>
              <hr />
              <Dropdown.Item onClick={this.logout}>
                <i className="fas fa-sign-out-alt" /> Déconnexion
              </Dropdown.Item>
            </Dropdown.Menu>
          );
        }
      } else {
        return (
          <Dropdown.Menu>
            <Dropdown.Item href="/connexion">
              <i className="fas fa-sign-in-alt" /> Connexion
            </Dropdown.Item>
            <Dropdown.Item href="/inscription">
              <i className="fas fa-users" /> Inscription
            </Dropdown.Item>
          </Dropdown.Menu>
        );
      }
    };

    const renderAuthHeaderMobile = () => {
      if (Token && this.state.hasFetchData) {
        if (localStorage.getItem("admin")) {
          return (
            <div>
              <Nav.Link href="/panier" className="mobile-none-link">
                Panier
              </Nav.Link>
              <Nav.Link href="/profil" className="mobile-none-link">
                Mon compte
              </Nav.Link>
              <Nav.Link href="/backoffice" className="mobile-none-link">
                Backoffice
              </Nav.Link>
              <Nav.Link className="mobile-none-link" onClick={this.logout}>
                Déconnexion
              </Nav.Link>
            </div>
          );
        } else {
          return (
            <div>
              <Nav.Link href="/panier" className="mobile-none-link">
                Panier
              </Nav.Link>
              <Nav.Link href="/profil" className="mobile-none-link">
                Mon compte
              </Nav.Link>
              <Nav.Link className="mobile-none-link" onClick={this.logout}>
                Déconnexion
              </Nav.Link>
            </div>
          );
        }
      } else {
        return (
          <div>
            <Nav.Link href="/connexion" className="mobile-none-link">
              Connexion
            </Nav.Link>
            <Nav.Link href="/inscription" className="mobile-none-link">
              Inscription
            </Nav.Link>
          </div>
        );
      }
    };

    return (
      <Fragment>
        {renderLoader()}
        <Navbar collapseOnSelect expand="lg" sticky="top" variant="light">
          <Navbar.Brand href="/" className="logo-navbar">
            <img src="/assets/greenlogo.png" alt="logo" style={{ height: "60px" }} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/notre-groupe">Notre Groupe</Nav.Link>
              <Nav.Link href="/nos-evenements">Nos évènements</Nav.Link>
              <Nav.Link href="/boutique">Boutique</Nav.Link>
              {renderAuthHeaderMobile()}
            </Nav>
            <Nav className="nav-drop">
              <Link to="/panier">
                <Dropdown>
                  <Dropdown.Toggle className="cart-account" id="dropdown-basic">
                    <i className="fas fa-shopping-basket opacite" />
                  </Dropdown.Toggle>
                </Dropdown>
              </Link>
              <Dropdown>
                <Dropdown.Toggle className="cart-account" id="dropdown-basic">
                  <i className="fas fa-user-circle opacite" />
                </Dropdown.Toggle>
                {renderAuthHeader()}
              </Dropdown>
              <a href="/dons">
                <button type="button" className="btn-don">
                  Faites nous un don <i className="fas fa-heart" />
                </button>
              </a>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Modal className="cookies" show={this.state.cookies} backdrop="static" keyboard={false}>
          <Modal.Body>
            <img
              src="/assets/greenlogo.png"
              alt="logo"
              style={{
                height: "60px",
                display: "block",
                margin: "0 auto 20px",
              }}
            />
            <p style={{ textAlign: "center" }}>
              Ce site utilise des cookies pour vous offrir le meilleur service possible. En
              continuant votre navigation, vous en acceptez l'utilisation.
            </p>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <Button onClick={this.acceptCookies} variant="secondary">
                Tout Refuser
              </Button>
              <Button onClick={this.acceptCookies} variant="success">
                Tout Accepter
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </Fragment>
    );
  }
}
