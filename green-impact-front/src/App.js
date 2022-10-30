import React, { Fragment } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import Homepage from "./pages/Homepage";
import Groupe from "./pages/Groupe";
import NotFound from "./pages/NotFound";
import Profil from "./pages/Profil";
import Dons from "./pages/stripe/Dons";
import Payment from "./pages/stripe/Payment";
import MentionsLegales from "pages/MentionsLegales";

import Events from "./pages/events/Events";
import FicheEvent from "./pages/events/FicheEvent";

import Boutique from "./pages/orders/Boutique";
import FicheArticle from "./pages/orders/FicheArticle";
import Panier from "./pages/orders/Panier";

import Inscription from "./pages/login/Inscription";
import Connexion from "./pages/login/Connexion";

import Backoffice from "./pages/admin/Backoffice";
import BoCreateQuestion from "./pages/admin/question/BoCreateQuestion";
import BoGetQuestions from "./pages/admin/question/BoGetQuestions";
import BoEditQuestion from "./pages/admin/question/BoEditQuestion";
import BoCreateImpact from "./pages/admin/impact/BoCreateImpact";
import BoGetImpacts from "./pages/admin/impact/BoGetImpacts";
import BoEditImpact from "./pages/admin/impact/BoEditImpact";
import BoCreateArticle from "./pages/admin/article/BoCreateArticle";
import BoGetArticles from "./pages/admin/article/BoGetArticles";
import BoEditArticle from "./pages/admin/article/BoEditArticle";
import BoCreateEvent from "./pages/admin/event/BoCreateEvent";
import BoGetEvents from "./pages/admin/event/BoGetEvents";
import BoEditEvent from "./pages/admin/event/BoEditEvent";
import BoCreateWaste from "./pages/admin/waste/BoCreateWaste";
import BoEditWaste from "./pages/admin/waste/BoEditWaste";
import BoGetWastes from "./pages/admin/waste/BoGetWastes";
import BoGetUsers from "./pages/admin/user/BoGetUsers";

function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/" component={Homepage} />

          <Route exact path="/notre-groupe" component={Groupe} />
          <Route exact path="/profil" component={Profil} />
          <Route exact path="/dons" component={Dons} />
          <Route exact path="/payment" component={Payment} />
          <Route exact path="/mentions-legales" component={MentionsLegales} />

          <Route exact path="/nos-evenements" component={Events} />
          <Route exact path="/nos-evenements/:id" component={FicheEvent} />

          <Route exact path="/boutique" component={Boutique} />
          <Route exact path="/boutique/:id" component={FicheArticle} />
          <Route exact path="/panier" component={Panier} />

          <Route exact path="/inscription" component={Inscription} />
          <Route exact path="/connexion" component={Connexion} />

          <Route exact path="/backoffice" component={Backoffice} />
          <Route exact path="/backoffice/impact-create" component={BoCreateImpact} />
          <Route exact path="/backoffice/impact-list" component={BoGetImpacts} />
          <Route exact path="/backoffice/impact-edit/:id" component={BoEditImpact} />
          <Route exact path="/backoffice/waste-create" component={BoCreateWaste} />
          <Route exact path="/backoffice/waste-edit/:id" component={BoEditWaste} />
          <Route exact path="/backoffice/waste-list" component={BoGetWastes} />
          <Route exact path="/backoffice/event-create" component={BoCreateEvent} />
          <Route exact path="/backoffice/events-list" component={BoGetEvents} />
          <Route exact path="/backoffice/event-edit/:id" component={BoEditEvent} />
          <Route exact path="/backoffice/article-create" component={BoCreateArticle} />
          <Route exact path="/backoffice/articles-list" component={BoGetArticles} />
          <Route exact path="/backoffice/article-edit/:id" component={BoEditArticle} />
          <Route exact path="/backoffice/question-create" component={BoCreateQuestion} />
          <Route exact path="/backoffice/questions-list" component={BoGetQuestions} />
          <Route exact path="/backoffice/question-edit/:id" component={BoEditQuestion} />
          <Route exact path="/backoffice/users-list" component={BoGetUsers} />

          <Route component={NotFound} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
