import React, { Component, Fragment } from "react";
import { Card } from "react-bootstrap";
import axios from "axios";
import { ApiRequests, ErrorTokenMessage } from "api/BaseApi";
import Swal from "sweetalert2";

export default class ArticleCard extends Component {
  state = {
    items: [],
  };

  componentDidMount() {
    axios
      .get(ApiRequests.fetchItems)
      .then((fetchItem) => {
        const items = fetchItem.data["hydra:member"];
        this.setState({ items: items });
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  redirectArticle(itemId) {
    window.location.href = `/boutique/${itemId}`;
  }

  render() {
    return (
      <Fragment>
        {this.state.items.map((item, index) => (
          <Card className="mx-1 my-3 articleCard" key={index.toString()} onClick={() => this.redirectArticle(item.id)} style={{ width: "18rem" }}>
            {item.image ? <Card.Img variant="top" src={`https://green-impact.tk/${item.image.contentUrl}`} alt="photoArticle"></Card.Img> : <Card.Img variant="top" src="assets/event-logo.png" alt="photoArticle"></Card.Img>}
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              <Card.Text>{item.price} €</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </Fragment>
    );
  }
}
