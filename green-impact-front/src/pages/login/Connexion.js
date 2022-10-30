import React, { Component, Fragment } from "react";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import { ApiRequests, Token, ErrorInfosMessage } from "api/BaseApi";
import Swal from "sweetalert2";
import "./Log.scss";

export default class Connexion extends Component {
  state = {
    email: "",
    password: "",
  };

  componentDidMount() {
    if (Token) {
      window.location.href = "/";
    }
  }

  onSubmit = (event) => {
    event.preventDefault();

    const pattern = new RegExp("^[A-Z-a-z0-9._%+-]+@[A-Z-a-z0-9.-]+\\.[A-Z-a-z]{2,4}$");

    if (!this.state.email || !this.state.password) {
      Swal.fire("", "Veuillez renseigner tous les champs", "error");
    } else if (!pattern.test(this.state.email)) {
      Swal.fire("", "Veuillez renseigner une adresse mail valide", "error");
    } else {
      axios
        .post(ApiRequests.fetchToken, this.state)
        .then((fetchToken) => {
          localStorage.setItem("token", fetchToken.data.token);
          localStorage.setItem("user", this.state.email);
          localStorage.setItem("user_id", fetchToken.data.user.id);

          Swal.fire("", "Connexion réussie", "success").then(() => {
            window.location.href = "/";
          });
        })
        .catch((error) => {
          console.error(error.message);
          Swal.fire("", ErrorInfosMessage, "error");
        });
    }
  };

  render() {
    return (
      <Fragment>
        <div
          style={{
            backgroundImage: `url(/assets/connexionBackground.jpg)`,
            backgroundSize: "cover",
          }}
        >
          <div className="cardLog">
            <form onSubmit={this.onSubmit}>
              <Row>
                <Col sm={6}>
                  <img src="assets/green-impact.png" alt="LogoGI" className="logo" />
                </Col>
                <Col sm={6}>
                  <h3>Connexion</h3>

                  <label htmlFor="email">Votre adresse e-mail</label>
                  <input
                    type="email"
                    placeholder="john.doe@github.com"
                    id="email"
                    name="email"
                    value={this.state.email}
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />

                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    id="password"
                    name="password"
                    value={this.state.password}
                    onChange={(e) => this.setState({ password: e.target.value })}
                  />

                  <button type="submit">Se connecter</button>
                </Col>
              </Row>
            </form>
          </div>
        </div>
      </Fragment>
    );
  }
}
