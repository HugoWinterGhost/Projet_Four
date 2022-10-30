import React, { Component, Fragment } from "react";
import { Container } from "react-bootstrap";
import "./style/MentionsLegales.scss";

export default class MentionsLegales extends Component {
  render() {
    return (
      <Fragment>
        <Container className="section-text spaces-footer">
          <h2 className="text-center title-page">Mentions Légales</h2>
          <div className="mention">
            <h4>Vie privée</h4>
            <p>GreenImpact pense que le respect de votre vie privée sur le web est un droit fondamental, c'est pourquoi nous veillons à garantir votre sécurité en ligne aussi rigoureusement que possible.
            Cette politique concerne toutes les pages hébergées sur les sites de GreenImpact France. Elle ne s'applique pas aux pages hébergées par d'autres organisations vers lesquelles nous pouvons établir des liens, et dont les politiques en matière de respect de la vie privée peuvent être différentes.
            Dans le cadre de cette politique, le terme "adhérent-e-" désigne une personne qui a fait une contribution financière à l'association, via notre site Internet ou par un autre moyen. Le terme “sympathisant-e” désigne une personne qui s’est inscrite sur une ou plusieurs de nos listes de diffusion.”</p>
            
            <h4>Hébergement</h4>
            <p>Notre site est hébergé sur divers serveurs qui sont situés chez des hébergeurs dont la politique de respect de la vie privée est identique à la nôtre. Les informations figurant sur les "logs" de nos sites ne permettent pas l'identification des personnes, et nous n'essayons en aucune manière d'associer ces informations aux personnes qui visitent le site. Le serveur recueille des informations sur les dates et heures d'accès à notre site web ainsi que sur l'adresse Internet (IP) du terminal (ordinateur, smartphone, tablette, etc.) à partir duquel vous avez accédé à notre site. Nous pouvons ainsi suivre, anonymement, la navigation d'un utilisateur à l'intérieur de notre site. Nous nous servons de ces informations pour améliorer le contenu et l'ergonomie de notre site et établir des statistiques de fréquentation.</p>
            
            <h4>Cookies</h4>
            <p>Les sites web de GreenImpact France peuvent être amenés à inscrire et utiliser des « cookies ». Un cookie est un petit fichier texte ou un ensemble de données qu’un site web peut envoyer ou sauvegarder sur votre ordinateur lorsque vous le visitez. Plus spécifiquement, il s’agit de chaînes de caractères déposées sur le disque dur de votre ordinateur. Le cookie n’a pour but que de vous simplifier la navigation sur nos sites web lors de vos visites ultérieures.
            Nos sites Internet peuvent utiliser des cookies afin de garder en mémoire vos identifiants. Cela vous permettant, par exemple, de ne pas avoir à retaper vos informations déjà complétées ultérieurement.
            d’élaborer des statistiques sur la navigation de nos sites afin de nous adapter à votre comportement en tant qu’internaute. Nous utilisons aussi ponctuellement des outils qui suivent les actions des internautes sur le site afin d'améliorer l'expérience utilisateur.
            Vous pouvez à tout moment modifier vos préférences pour accepter ou refuser ces cookies. Il existe deux types de cookie,le premier enregistre un fichier qui peut rester sur votre ordinateur pendant une période prolongée même une fois que vous l’avez éteint.
            le second est appelé « cookie de session » : lorsque vous visitez un site web, les cookies de session sont temporairement mémorisés dans votre ordinateur. Les cookies de session ne restent pas longtemps sur votre ordinateur, ils disparaissent lorsque vous fermez votre navigateur Internet.
            La plupart des navigateurs Internet vous permettent de paramétrer le navigateur afin qu’il bloque les cookies, pour qu’il les efface de votre disque dur ou pour qu’il vous signale lorsqu’une page web contient des cookies avant qu’un cookie ne soit mémorisé.
            Pour empêcher le téléchargement de cookies ou pour contrôler la manière dont ils sont utilisés sur votre ordinateur consultez les instructions d’utilisation ou la rubrique d’aide de votre navigateur ou rendez-vous sur : www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser.
            En cas de refus (des cookies) un évènement anonyme est envoyé dans Google Analytics afin de nous permettre de connaitre le taux de refus constaté.
            Remarque : il est possible que certaines de nos pages web ne fonctionnent pas correctement sans cookie.</p>

            <h4>Protocole SSL</h4>
            <p>Le site Green-Impact.online utilise le protocole SSL (Secure Sockets Layer), un protocole de sécurité qui permet à vos communications par Internet de rester privées. Ce protocole offre des applications pour les clients/serveurs permettant de communiquer sans être écouté-e de façon indiscrète, sans que vos messages soient modifiés. Il crypte toutes les informations personnelles (nom, adresse, email…) lors de leur transit entre le navigateur et nos serveurs, afin que ces informations ne puissent pas être lues quand elles circulent sur Internet. Quand vous êtes sur une page sécurisée le cadenas apparaît en icône dans la barre d’adresse
            Si nous utilisons le cryptage SSL pour protéger les informations sensibles sur Internet, nous faisons également tout notre possible pour protéger ces informations une fois stockées. Tous nos disques dur sont cryptés en amont du système d'exploitation. Si, d'aventure, une machine était dérobée, les données stockées sur les disques durs resteraient inaccessibles.</p>
            
            <h4>Lanceurs d’alerte</h4>
            <p>Si vous souhaitez nous envoyer des documents de manière sécurisée, nous avons développé un service dédié (https://green-impact.online). Pour des raisons de sécurité, nous vous encourageons à vous connecter depuis un ordinateur de confiance, et d’utiliser le réseau Tor pour y accéder.</p>
            
            <h4>Adresse IP</h4>
            <p>Lorsque vous effectuez un commentaire sur un site de GreenImpact, votre adresse IP est enregistrée et stockée, afin d’éviter l’utilisation abusive des commentaires.
            Autres informations
            Directeur de la publication : Patrick sebastien , directeur général GreenImpact France
            Si vous avez des questions sur les informations que nous gardons sur nos adhérents, veuillez contacter dpd@green-impact.online.
            Nos mesures de sécurité et cette politique sont réévaluées régulièrement. Vous pouvez adresser toute question concernant cette politique à :</p>
            <br/> Responsable site web
            <br/> GreenImpact France
            <br/> 13, rue d'Enghien
            <br/> 75010 Paris
          </div>   
        </Container>
      </Fragment>
    );
  }
}
