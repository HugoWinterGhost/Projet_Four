import React, { Component, Fragment } from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import axios from "axios";
import { ApiRequests, Header, Token, ErrorTokenMessage } from "api/BaseApi";
import Swal from "sweetalert2";

export default class ReservEvent extends Component {
  state = {
    event: [],
    users: [],
    hasFetchData: false,
  };

  joinEvent(event, connectedUser) {
    let updatedEventUsers = [];
    event.users.forEach((user) => {
      if (!updatedEventUsers.includes(user)) {
        updatedEventUsers.push(user);
      }
    });

    updatedEventUsers.unshift(connectedUser["@id"]);

    const newHeader = {
      Authorization: `Bearer ${Token}`,
      "content-type": "application/merge-patch+json",
    };

    axios
      .patch(`${ApiRequests.fetchEvents}/${event.id}`, { users: updatedEventUsers }, { headers: newHeader })
      .then(() => {
        Swal.fire("", "Vous êtes maintenant inscrit à cet évènement", "success").then(() => {
          window.location.reload(false);
        });
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  leaveEvent(event, connectedUser) {
    let updatedEventUsers = [];
    event.users.forEach((user) => {
      if (!updatedEventUsers.includes(user)) {
        updatedEventUsers.push(user);
      }
    });

    let userIndex = updatedEventUsers.indexOf(connectedUser["@id"]);
    updatedEventUsers.splice(userIndex, 1);

    const newHeader = {
      Authorization: `Bearer ${Token}`,
      "content-type": "application/merge-patch+json",
    };

    axios
      .patch(`${ApiRequests.fetchEvents}/${event.id}`, { users: updatedEventUsers }, { headers: newHeader })
      .then(() => {
        Swal.fire("", "Votre inscription à cet évènement est annulée", "success").then(() => {
          window.location.reload(false);
        });
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  componentDidMount() {
    if (Token) {
      axios
        .get(ApiRequests.fetchUsers, { headers: Header })
        .then((fetchUsers) => {
          const users = fetchUsers.data["hydra:member"];
          const event = JSON.parse(localStorage.getItem("event"));
          this.setState({ users: users, event: event, hasFetchData: true });
        })
        .catch((error) => {
          console.error(error.message);
          Swal.fire("", ErrorTokenMessage, "error");
        });
    } else {
      const event = JSON.parse(localStorage.getItem("event"));
      this.setState({ event: event, hasFetchData: true });
    }
  }

  render() {
    const renderJoinTooltip = (props) => (
      <Tooltip {...props}>
        Rejoindre cet évènement
      </Tooltip>
    );

    const renderLeaveTooltip = (props) => (
      <Tooltip {...props}>
        Quitter cet évènement
      </Tooltip>
    );

    const renderUserEvent = (users, event) => {
      if (event && this.state.hasFetchData) {
        if (event.users.length > 0 && Token) {
          const usersEvent = event.users;
          if (usersEvent) {
            let userEventName = "";
            usersEvent.forEach((userEvent) => {
              if (!userEventName) {
                userEventName = userEvent.firstName;
              } else {
                userEventName = userEventName + ", " + userEvent.firstName;
              }
            });

            let connectedUser = users.find((user) => user.email === localStorage.getItem("user"));
            let hasAlreadyJoinEvent = false;
            if (connectedUser) {
              if (usersEvent.find((userEvent) => userEvent === connectedUser["@id"])) {
                hasAlreadyJoinEvent = true;
              }
            }

            if (!hasAlreadyJoinEvent && usersEvent.length > 0) {
              return (
                <div>
                  <h6 className="mt-2 text-muted">
                    {usersEvent.length} utilisateurs sont actuellement inscrits à cet évènement <br />
                  </h6>
                  <OverlayTrigger placement="right" overlay={renderJoinTooltip}>
                    <button className="btn-join" onClick={() => this.joinEvent(event, connectedUser)}>
                      <i className="fas fa-user-plus" />
                    </button>
                  </OverlayTrigger>
                </div>
              );
            } else if (!hasAlreadyJoinEvent && usersEvent.length === 0) {
              return (
                <div>
                  <h6 className="mt-2 text-muted">Aucun utilisateur inscrit</h6>
                  <OverlayTrigger placement="right" overlay={renderJoinTooltip}>
                    <button className="btn-join" onClick={() => this.joinEvent(event, connectedUser)}>
                      <i className="fas fa-user-plus" />
                    </button>
                  </OverlayTrigger>
                </div>
              );
            } else {
              return (
                <div>
                  <h6 className="mt-2 text-muted">
                    {usersEvent.length} utilisateurs sont inscrits à cet évènement
                    {userEventName}
                  </h6>
                  <OverlayTrigger placement="right" overlay={renderLeaveTooltip}>
                    <button className="btn-join" onClick={() => this.leaveEvent(event, connectedUser)}>
                      <i className="fas fa-user-minus" />
                    </button>
                  </OverlayTrigger>
                </div>
              );
            }
          }
        } else if (Token) {
          let connectedUser = users.find((user) => user.email === localStorage.getItem("user"));

          return (
            <div>
              <h6 className="mt-2 text-muted">Aucun utilisateur inscrit</h6>
              <OverlayTrigger placement="right" overlay={renderJoinTooltip}>
                <button className="btn-join" onClick={() => this.joinEvent(event, connectedUser)}>
                  <i className="fas fa-user-plus" />
                </button>
              </OverlayTrigger>
            </div>
          );
        } else {
          return "";
        }
      }
      return "";
    };
    return <Fragment>{renderUserEvent(this.state.users, this.state.event)}</Fragment>;
  }
}
