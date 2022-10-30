import React, { Component, Fragment } from "react";
import "./style/NotFound.scss";

export default class NotFound extends Component {
  render() {
    return (
      <Fragment>
        <div className="page-not-found text-center">
          <img src="/assets/icons/404-error.png" alt="404 error" />
          <h3 className="text-muted">Cette page n'existe pas ...</h3>
          <br />
          <a href="/">
            <button className="btn-back-not-found">
              <i className="fas fa-home" />
            </button>
          </a>
        </div>
      </Fragment>
    );
  }
}
