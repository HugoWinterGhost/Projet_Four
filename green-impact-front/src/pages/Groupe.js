import React, { Component, Fragment } from "react";
import { Container, Card } from "react-bootstrap";
import "./style/Groupe.scss";

export default class Groupe extends Component {
  render() {
    return (
      <Fragment>
        <Container className="section-text spaces-footer">
          <h2 className="text-center title-page">Notre Groupe</h2>

          <p>Depuis sa création il y a une cinquantaine d’années, Green Impact agit sur terre et en mer selon les principes de non-violence pour protéger l’environnement et promouvoir la paix. Aujourd’hui, nous restons fidèles à cette mission, ainsi qu'à notre totale indépendance financière et idéologique.</p>
          <p>Changements climatiques, inégalités grandissantes, injustices sociales, migrations et conflits armés… Tous les grands défis de notre époque, auxquels nous devons répondre de toute urgence, sont intimement liés – tout comme les structures de pouvoir qui en sont à l’origine et les mentalités qui s’en accommodent. C’est pourquoi il est nécessaire de les transformer conjointement.</p>
          <p>
            Green Impact est présente dans 55 pays, sur tous les continents et tous les océans grâce à ses 28 bureaux nationaux et régionaux et ses trois bateaux. Elle compte plus de trois millions d'adhérent·es et plus de 36 000 bénévoles à travers le monde. Nous plaçons le pouvoir citoyen au cœur de nos campagnes en donnant une résonance au travail de toutes celles et tous ceux qui partagent notre vision, nos espoirs et notre conviction qu’il faut des transformations profondes de nos sociétés.
          </p>
          <section id="notre-equipe">
            <h4 className="mt-4 mb-3 mx-3">Notre équipe</h4>
            <div className="members">
              <Card style={{ width: "18rem" }} className="mx-3">
                <Card.Body>
                  <Card.Img src="assets/members/hugo.jpeg"></Card.Img>
                  <Card.Title>Hugo FIEF</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Développeur Front End</Card.Subtitle>
                </Card.Body>
              </Card>
              <Card style={{ width: "18rem" }} className="mx-3">
                <Card.Body>
                  <Card.Img src="assets/members/markcley.png"></Card.Img>
                  <Card.Title>Markcley Inza-Cruz</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Développeur Back End</Card.Subtitle>
                </Card.Body>
              </Card>
              <Card style={{ width: "18rem" }} className="mx-3">
                <Card.Body>
                  <Card.Img src="assets/members/bastien.png"></Card.Img>
                  <Card.Title>Bastien CORDIER</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Développeur Front End</Card.Subtitle>
                </Card.Body>
              </Card>
              <Card style={{ width: "18rem" }} className="mx-3">
                <Card.Body>
                  <Card.Img src="assets/members/jordan.jpeg"></Card.Img>
                  <Card.Title>Jordan Bruneel</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted"> Développeur Front End</Card.Subtitle>
                </Card.Body>
              </Card>
            </div>
          </section>
        </Container>
      </Fragment>
    );
  }
}
