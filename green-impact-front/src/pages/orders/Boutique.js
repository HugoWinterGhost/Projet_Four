import React, { Component, Fragment } from "react";
import { Container } from "react-bootstrap";
import ArticleCard from "../../components/card/ArticleCard";
import "./Boutique.scss";

export default class Boutique extends Component {
  render() {
    return (
      <Fragment>
        <h2 className="text-center title-page">Boutique</h2>
        <Container className="spaces-footer items">
          <ArticleCard />
        </Container>
      </Fragment>
    );
  }
}
