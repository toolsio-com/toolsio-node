import axios from 'axios'
//import { setAuthorizationToken } from '../utils'
import { SET_CURRENT_ACCOUNT } from './types'

// Action creators 
export function setCurrentAccount(account) {
  return {
    type: SET_CURRENT_ACCOUNT,
    account
  }
}

// Thunk actions
export function signupRequest(accountAndUser) {
  return dispatch => {
    return axios.post('/users/register', accountAndUser).then(res => {
      localStorage.setItem('account', JSON.stringify(res.data))
      dispatch(setCurrentAccount(res.data))
    })
  }
}

export function isSubdomainExist(subdomain) {
  return dispatch => {
    return axios.get(`/accounts/${subdomain}`)
  }
}

export function isUserExist(email) {
  return dispatch => {
    return axios.get(`/users/${email}`)
  }
}

export function loginRequest(data) {
  return dispatch => {
    return axios.post('/users/login', data)
      .then(res => {
        //document.cookie = "_id="+res.data._id+"; firstName="+res.data.firstName+"; lastName="+res.data.firstName+"; email="+res.data.email+""
        localStorage.setItem('account', JSON.stringify(res.data))
        dispatch(setCurrentAccount(res.data))
      })
  }
}

export function logout() {
  return dispatch => {
    return axios.post('/users/logout')
      .then(() => {        
        localStorage.removeItem('account')
        dispatch(setCurrentAccount({}))  
      })
  }
}

export function confirmEmail(token) {
  return dispatch => {
    return axios.get(`/users/confirmation/${token}`)  
  }
}


