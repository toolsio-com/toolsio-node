  // Schema
import axios from 'axios'

// Load factories 
import userFactory from '../factories/user'
import accountFactory from '../factories/account'
import customerFactory from '../factories/customer'

export async function registerUser() {

  let userFactoryLocal = await userFactory()
  let accountFactoryLocal = await accountFactory()

  const response = await axios.post('http://localhost:8080/graphql', {
    query: `mutation registerUser($firstName: String, $lastName: String, $email: String!, $password: String!, $subdomain: String!, $industry: String!) {
      registerUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password, subdomain: $subdomain, industry: $industry) {
        success
        account {
          subdomain
        }
        errors {
          path
          message
        }
      }        
    }`,
    variables: {
      firstName: userFactoryLocal.firstName,
      lastName: userFactoryLocal.lastName,
      email: userFactoryLocal.email,
      password: userFactoryLocal.password,
      subdomain: accountFactoryLocal.subdomain,
      industry: accountFactoryLocal.industry
    }
  }) 

  const { data: { registerUser: { account: { subdomain }, success } } } = response.data

  if (success) {
    return {
        success,
        subdomain,
        email: userFactoryLocal.email,
        password: userFactoryLocal.password
      } 
  } else {
    return null
  }
}


export async function loginUser(email, password) {

    const response = await axios.post('http://localhost:8080/graphql', {
      query: `mutation($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
          success
          authToken 
          refreshAuthToken
          errors {
            path
            message
          }
        }
      }`,
      variables: {
        email: email,
        password: password
      }
    }) 

    const { data: { loginUser: { success, authToken, refreshAuthToken } } } = response.data    
 
  if (success) {  
    return {
      authToken,
      refreshAuthToken
    }
  } else {
    return null
  }
}