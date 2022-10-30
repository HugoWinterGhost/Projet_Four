import React, { Component, Fragment } from "react";
import "./Footer.scss";

export default class Footer extends Component {
  render() {
    return (
      <Fragment>
        <footer className="footer-container sticky-bottom" id="footer">
          <div className="pre-footer">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-6 text-left">
                  <h4>
                    <i className="fas fa-seedling" />
                    Aidez-nous à sauvez notre planète
                  </h4>
                  <br />
                  <h6>Arrêter la dégradation de l'environnement dans le monde et construire un avenir où les êtres humains pourront vivre en harmonie avec la nature.</h6>
                  <br />
                </div>
                <div className="col-md-2 text-left">
                  <h4>Découvrir</h4>
                  <br />
                  <p>
                    <a href="/notre-groupe">Notre mission</a>
                  </p>
                  <p>
                    <a href="/notre-groupe#notre-equipe">Notre équipe</a>
                  </p>
                </div>
                <div className="col-md-2 text-left">
                  <h4>Rejoignez-nous</h4>
                  <br />
                  <p>
                    <a href="/nos-evenements">Évènements</a>
                  </p>
                  <p>
                    <a href="/dons">Devenir bénévole</a>
                  </p>
                </div>
                <div className="col-md-2 text-left">
                  <h4>Crédits</h4>
                  <br />
                  <p>
                    <a href="/mentions-legales">Mentions légales</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="separator" />
          <nav className="footer">
            <div className="container-fluid" id="social">
              <p>Green Impact - Paris. {new Date().getFullYear()} - Tous droits réservés</p>
            </div>
          </nav>
        </footer>
      </Fragment>
    );
  }
}
