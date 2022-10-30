import React, { Component, Fragment } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import axios from "axios";
import { ApiRequests, ErrorTokenMessage } from "api/BaseApi";
import Swal from "sweetalert2";
import ReservEvent from "./ReservEvent";
import "moment/locale/fr";

export default class FicheEvent extends Component {
  state = {
    event: [],
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    axios
      .get(`${ApiRequests.fetchEvents}/${id}`)
      .then((fetchEvents) => {
        const event = fetchEvents.data;
        localStorage.setItem("event", JSON.stringify(event));
        this.setState({ event: event });
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  render() {
    Moment.globalLocale = "fr";

    return (
      <Fragment>
        {!this.state.event ? (
          <div className="text-center my-5">
            <h5 className="my-3">Nous ne trouvons pas d'évènements associés à votre recherche ...</h5>
          </div>
        ) : (
          <Container style={{ padding: "30px 70px 70px", position: "relative" }} className="ficheEvent">
            <div className="head">
              <div className="picture-block">
                {this.state.event.image ? (
                  <img src={`https://green-impact.tk/${this.state.event.image.contentUrl}`} alt="logo" /> 
                ) : (
                  <img style={{ width: "18em" }} src="/assets/event-logo.png" alt="logo" />
                )}
              </div>
              <div className={!this.state.event.image ? 'infoEvent' : ''} style={{ marginLeft: "2em", marginTop: "1em" }}>
                <h4>
                  <b>{this.state.event.title}</b>
                </h4>
                <div className="text-muted">
                  <i className="fas fa-map-pin" /> {this.state.event.city}
                  <br />
                  <i className="fas fa-calendar-day m" style={{ marginRight: "5px" }} />
                  <Moment format="D MMMM YYYY">{this.state.event.startAt}</Moment>
                  <span style={{ paddingLeft: "5px", paddingRight: "5px" }}>-</span>
                  <Moment format="D MMMM YYYY">{this.state.event.endAt}</Moment>
                </div>
                <ReservEvent />
              </div>
            </div>
            <hr />
            {this.state.event.description}

            <Link to="/nos-evenements" style={{ textDecoration: "none", display: "block", marginTop: "1rem" }}>
              <button className="cancel-button">Revenir aux évènements</button>
            </Link>
          </Container>
        )}
      </Fragment>
    );
  }
}
