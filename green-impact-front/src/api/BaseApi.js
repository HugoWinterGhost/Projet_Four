const baseURL = "https://green-impact.tk";

const Token = localStorage.getItem("token");

const AdminRole = localStorage.getItem("admin");

const ErrorTokenMessage = "Votre session à peut être expiré, <br/> Je vous invite à vous déconnecter et à vous reconnecter";

const ErrorInfosMessage = "Les informations qui ont été saisies sont incorrectes";

const ErrorUnauthorizedMessage = "Vous session a expiré, <br/> Nous allons vous déconnecter"

const Header = {
  'Authorization': `Bearer ${Token}`
};

const ApiRequests = {
  fetchToken: `${baseURL}/authentication_token`,
  fetchOrders: `${baseURL}/orders`,
  fetchOrdersItems: `${baseURL}/order_items`,
  fetchMediaObjects: `${baseURL}/media_objects`,
  fetchEvents: `${baseURL}/events`,
  fetchImpacts: `${baseURL}/impacts`,
  fetchItems: `${baseURL}/items`,
  fetchCategories: `${baseURL}/categories`,
  fetchCollections: `${baseURL}/collections`,
  fetchQuestions: `${baseURL}/questions`,
  fetchUsers: `${baseURL}/users`,
  fetchWastes: `${baseURL}/wastes`,
  fetchPayment: `${baseURL}/payment`,
};

export { ApiRequests, Header, Token, AdminRole, ErrorTokenMessage, ErrorInfosMessage, ErrorUnauthorizedMessage };
