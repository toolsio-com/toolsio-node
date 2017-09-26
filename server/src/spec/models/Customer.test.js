// Mongodb connecton
import db from '../../db'

// Load factories 
import FactoryGirl from '../factories'

// Schema
import Customer from '../../models/Customer'

// Factored Customer
let customer = FactoryGirl.create('customer')

let customerId = null

describe("Customer", function() { 

  beforeAll(() => {
    db.connect('mongodb://localhost/toolsio_test')
  })

  afterAll(() => {
    db.drop()
  })


  it('should fail with validation errors for each required field', (done) => {
    Customer.create({}, function(err, customer) {

      expect(err).not.toBeNull()
      expect(err.errors.name.message).toContain('Name is required.')
      expect(err.errors.vatNumber.message).toContain('Vat number is required.')
      
      done()
    })
  })

  it('saves Customer', (done) => {
    
    Customer.create(customer, (err, customer) => {
      
      // Assign id
      customerId = customer._id
 
      expect(customer).not.toBeNull()
      expect(customer.name).toContain('Customer 1')
      expect(customer.contact.phoneNumber).toContain('12345678910')
      expect(customer.vatNumber).toContain('1234')

      done()
    })
  })

  it('finds Customer', (done) => { 

    Customer.findById(customerId, customer, (error, customer) => {
      expect(customer).not.toBeNull()

      done()
    })
  })

  it('updates Customer', (done) => { 

    // Update name
    customer.name = 'Customer 1 updated'
    
    Customer.findByIdAndUpdate(customerId, customer, {new: true}, (error, customer) => {
      
      expect(customer.name).toContain('Customer 1 updated')

      done()
    })
  })

  it('deletes Customer', (done) => { 

    Customer.findByIdAndRemove(customerId, customer, (error, customer) => {
      expect(customer).not.toBeNull()

      done()
    })
  })

})
