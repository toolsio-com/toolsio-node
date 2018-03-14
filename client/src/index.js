//var React = require('react') // ES5 version
import React from 'react' // ES6 version
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers/rootReducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Authorization } from './utils'
import { setCurrentAccount } from './actions/authenticationActions'
import { ApolloClient, createNetworInterface, Provider } from 'react-apollo'

// Localization 
import T from 'i18n-react'

import App from './components/Layouts/App'
//import routes from './routes'

const networInterface = createNetworInterface({
  uri: 'http://localhost:8080/graphql'
})

const client = new ApolloClient({
  networInterface
})

/*
// A state for the entire project created by Redux
const store = createStore(
  rootReducer,
  //(state = {}) => state, // Dummy Reducer
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)
*/

// Parse subdomain 
let subdomain =  Authorization.getSubdomain()
subdomain && Authorization.setSubdomain(subdomain)

if (localStorage.currentAccount) {
  // Retrieve the object from storage
  var currentAccount = localStorage.getItem('currentAccount')
  store.dispatch(setCurrentAccount(JSON.parse(currentAccount)))
}
console.log('cookie: ', document.cookie)
// Localization setup
let language = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage

// language would be something like es-ES or es_ES. However we store our files with format es.json or en.json
// therefore retrieve only the first 2 digits
if (language.length > 2) {
  language = language.split("-")[0]
}    

T.setTexts(require("./locale/" +language+ ".json"))

render(
  <BrowserRouter>
    <Provider client={client}>
      <App />
    </Provider>
  </BrowserRouter>, document.getElementById('app'))

