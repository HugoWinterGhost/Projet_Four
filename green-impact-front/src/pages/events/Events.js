import React, { Component, Fragment } from "react";
import { Container } from "react-bootstrap";
import EventCard from "../../components/card/EventsCard";
import "./Events.scss";

export default class Events extends Component {
  state = {
    loading: true,
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loading: false });
    }, 1000);
  }

  render() {
    return (
      <Fragment>
        <h2 className="text-center title-page">Nos évènements</h2>
        <Container className="mise-en-page spaces-footer">
          {this.state.loading ? (
            <div className="text-center">
              <img src="assets/greenlogo.png" className="loader" style={{ maxWidth: "220px" }} alt="loader" />
            </div>
          ) : (
            <EventCard />
          )}
        </Container>
      </Fragment>
    );
  }
}
