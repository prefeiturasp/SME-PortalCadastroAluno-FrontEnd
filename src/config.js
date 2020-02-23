/* eslint-disable */
let REACT_USERNAME = process.env.REACT_APP_USERNAME;
let REACT_PASSWORD = process.env.REACT_APP_PASSWORD;
// verifica o tempo minimo para refresh do token
// se faltar 300s (5 min) para o token vencer, ele deve ser atualizado
// https://getblimp.github.io/django-rest-framework-jwt/#refresh-token

module.exports = {
  REACT_USERNAME: REACT_USERNAME,
  REACT_PASSWORD: REACT_PASSWORD
};
