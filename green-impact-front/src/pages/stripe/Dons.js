import React, { Component, Fragment } from "react";
import { Container } from "react-bootstrap";
import "./Dons.scss";

export default class Dons extends Component {
  render() {
    return (
      <Fragment>
        <div style={{ backgroundColor: "#f7f7f7" }}>
          <Container>
            <div className="donationPage">
              <div className="donationBlock">
                <img src="assets/icons/hearts.png" alt="dons" />
                <h4 className="mt-5">⚠️ Urgence climatique : Reprenez le contrôle !</h4>
                <p className="mt-3 mb-4">
                  Face à l'accélération du dérèglement climatique, les spécialistes tirent le signal d'alarme : nous risquons d'atteindre plus vite que prévu un point de non-retour. Tout n'est pas perdu ! Il est encore temps de dire STOP ! Pour cela, nous avons besoin de vous. Votre soutien nous permettra d'exiger des responsables politiques et économiques des mesures rapides et drastiques à la hauteur de l'urgence. Votre don est notre unique moyen d'agir. Nous refusons tout don d'entreprises,
                  de partis politiques et de gouvernements afin de garantir notre indépendance. Plus tôt vous faites votre don, plus tôt nous pouvons le mettre à contribution. Chaque dixième de degré compte, chaque don compte. Ensemble, nous pouvons reprendre le contrôle. Merci pour votre générosité.
                </p>
                <a href="/payment">
                  <button>Soutenez-nous !</button>
                </a>
              </div>
            </div>
          </Container>
        </div>
      </Fragment>
    );
  }
}
