import React, { Component, Fragment } from "react";
import { Container, Modal } from "react-bootstrap";
import axios from "axios";
import { ApiRequests, ErrorTokenMessage } from "api/BaseApi";
import Swal from "sweetalert2";
import { AutoComplete } from "../components/auto-complete/AutoComplete";
import "./style/Homepage.scss";

export default class Homepage extends Component {
  state = {
    show: false,
    wastes: [],
    waste: "",
    fetchWastes: [],
    fetchImpacts: [],
  };

  constructor(props) {
    super(props);

    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  showModal() {
    let inputSearch = document.getElementsByTagName("input")[0].value;
    if (inputSearch && this.state.wastes.includes(inputSearch)) {
      this.setState({ show: true, waste: inputSearch });
    }
  }

  closeModal() {
    this.setState({ show: false });
  }

  componentDidMount() {
    axios
      .get(ApiRequests.fetchWastes)
      .then((fetchWastes) => {
        const wastes = fetchWastes.data["hydra:member"];
        let wastesList = [];
        wastes.map((waste) => wastesList.push(waste.name));
        this.setState({ wastes: wastesList, fetchWastes: wastes });

        axios
          .get(ApiRequests.fetchImpacts)
          .then((fetchImpacts) => {
            const impacts = fetchImpacts.data["hydra:member"];
            this.setState({ fetchImpacts: impacts });
          })
          .catch((error) => {
            console.error(error.message);
            Swal.fire("", ErrorTokenMessage, "error");
          });
      })
      .catch((error) => {
        console.error(error.message);
        Swal.fire("", ErrorTokenMessage, "error");
      });
  }

  render() {
    const renderImpactWaste = () => {
      if (this.state.show) {
        const selectedWaste = this.state.fetchWastes.find(
          (waste) => waste.name === this.state.waste
        );
        const impactWaste = this.state.fetchImpacts.find(
          (impact) => impact.waste === selectedWaste["@id"]
        );
        if (impactWaste && impactWaste.image) {
          // exemple : mégot de cigarette => jusqu’à 500 litres d'eau polluée
          return (
            <div>
              <p className="modal-text text-center">Nom de l'impact : {impactWaste.title}</p>
              <img
                className="event-picture"
                style={{ display: "block", margin: "0 auto", maxWidth: "300px", marginBottom: "1rem"}}
                src={`https://green-impact.tk/${impactWaste.image.contentUrl}`}
                alt="logo"
              />
              <p className="text-center">
                Description : {impactWaste.description} <br/> 
                Temps de décomposition : {impactWaste.recycling} ans
              </p>
            </div>
          );
        } else if (impactWaste && !impactWaste.image) {
          return (
            <div>
              <p className="modal-text text-center">Nom de l'impact : {impactWaste.title}</p>
              <img
                style={{ width: "18em", display: "block", margin: "0 auto" }}
                src="assets/green-impact.png"
                alt="logo"
              />
              <p className="text-center">
                Description : {impactWaste.description} <br/> 
                Durée de recyclage : {impactWaste.recycling} ans
              </p>
            </div>
          );
        } else {
          return "Aucun impact n'a été trouvé";
        }
      }
      return "";
    };
    return (
      <Fragment>
        <Container className="spaces-footer">
          <div className="logo-site">
            <img src="assets/green-impact.png" alt="logo-website" className="text-center" />
          </div>

          <h4 className="text-center under-title">
            Connaître l'impact que peut avoir un simple son déchet ?
          </h4>
          <div className="search-container">
            <form>
              <AutoComplete wastes={this.state.fetchWastes} />
              <button type="button" onClick={this.showModal} title="rechercher">
                <i className="fa fa-search" />
              </button>
            </form>
          </div>

          <Modal show={this.state.show} onHide={this.closeModal} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
              <Modal.Title className="modal-title">{this.state.waste}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{renderImpactWaste()}</Modal.Body>
          </Modal>
        </Container>
      </Fragment>
    );
  }
}
