import axios from 'axios'
import { SET_SALES, ADD_SALE } from './types'

export function setSales(sales) {
  return {
    type: SET_SALES,
    sales
  }
}

export function addSale(sale) {
  return {
    type: ADD_SALE,
    sale
  }
}

export function createSale(sale) {
  return dispatch => {
    return axios.post('/api/sales', sale).then(res => { dispatch(addSale(res.data.result)) } )
  }
}

export function fetchSales() {
  return dispatch => {
    return axios.get('/api/sales').then(res => {
      dispatch(setSales(res.data.results))
    })
  }
}