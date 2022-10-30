import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Moment from "react-moment";
import axios from "axios";
import { ApiRequests, ErrorTokenMessage } from "api/BaseApi";
import Swal from "sweetalert2";
import "moment/locale/fr";

export default class EventCard extends Component {
  state = {
    events: [],
  };

  componentDidMount() {
    axios
      .get(ApiRequests.fetchEvents)
      .then((fetchEvents) => {
        const events = fetchEvents.data["hydra:member"];
        this.setState({ events: events });
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  redirectEvent(eventId) {
    window.location.href = `/nos-evenements/${eventId}`;
  }

  render() {
    Moment.globalLocale = "fr";

    return (
      <Fragment>
        {this.state.events.map((event) => (
          <Card className="events my-4" key={event.id.toString()} onClick={() => this.redirectEvent(event.id)}>
            <Card.Body>
              <Row>
                <Col sm={3} className={!event.image ? "picture-card" : ""}>
                  {event.image ? <img className="event-picture" src={`https://green-impact.tk/${event.image.contentUrl}`} alt="imageEvent" /> : <img className="event-picture" src="assets/event-logo.png" alt="logo" />}
                </Col>
                <Col sm={9} style={{ paddingTop: "10px" }} className={!event.image ? "text-card" : ""}>
                  <h5>{event.title}</h5>
                  <h6 className="mb-2 text-muted">
                    <i className="fas fa-map-pin" /> {event.city}
                    <i className="fas fa-calendar-day" style={{ marginLeft: "30px", marginRight: "5px" }} />
                    <Moment format="D MMMM YYYY">{event.startAt}</Moment>
                  </h6>
                  <p>{event.description}</p>
                  <Link to={`/nos-evenements/${event.id}`} className="text-muted">
                    Voir plus
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
      </Fragment>
    );
  }
}
