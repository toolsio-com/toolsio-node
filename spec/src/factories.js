import FactoryGirl from 'factory_girl'
import mongoose from 'mongoose'
let id = mongoose.Types.ObjectId()

FactoryGirl.define('customer', function() {
  this.name = 'Customer 1'
  this.vatNumber = '1234' 
  this.contact = { phoneNumber: '12345678910' }
  this.includeContactOnInvoice = false
  this.projects = []
  this.sales = []
  this.invoices = []
  this.address = { street: 'Street 1', postalCode: '1234', region: 'Espoo', country: 'Finland' }
})

FactoryGirl.define('sale', function() {
  this.customer = id
  this.name = 'Sale 1'
  this.deadline = new Date() 
  this.status = 'new'
  this.description = 'Description 1...'
  this.items = []
})

FactoryGirl.define('project', function() {
  this.customer = id
  this.name = 'Project 1'
  this.deadline = new Date() 
  this.status = 'new'
  this.description = 'Description 1...'
  this.tasks = []
})

module.exports = FactoryGirl