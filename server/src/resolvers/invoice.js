import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  
  Query: {
    getInvoice: requiresAuth.createResolver((parent, {id}, { models }) => models.Invoice.findOne({ where: {id} }, { raw: true })),
    
    getInvoices: requiresAuth.createResolver((parent, args, { models }) => models.Invoice.findAll())
  },

  Mutation: {
    createInvoice: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const customer = models.Customer.findOne({where: {id: args.customerId} }, { raw: true })
        
        let date = new Date(args.deadline)
        let dataFormated = date.getDate().toString()+(date.getMonth()+1).toString()+date.getFullYear().toString() 
        
        //let referenceNumber = dataFormated+ '-' +(args.projectId || args.saleId).toString()+user.id.toString()
        let referenceNumber = dataFormated+ '-' +(args.projectId || args.saleId).toString()
       
        const invoice = await models.Invoice.create({...args, referenceNumber, userId: user.id})

        return {
          success: true,
          invoice: invoice
        }
      } catch (err) {
        console.log('err: ', err)
        return {
          success: false,
          errors: formatErrors(err, models)
        }
      }
    }),

    updateInvoice: requiresAuth.createResolver((parent, args, { models }) => {
      return models.Invoice.update(args, { where: {id: args.id}, returning: true, plain: true })
        .then(result => {
  
          return {
            success: true,
            invoice: result[1].dataValues
          }
        })
        .catch(err => {
          console.log('err: ', err)
          return {
            success: false,
            errors: formatErrors(err, models)
          }
        })
    }),

    deleteInvoice: requiresAuth.createResolver((parent, args, { models }) => {
      return models.Invoice.destroy({ where: {id: args.id}, force: true })
        .then(res => {
          
          return {
            success: (res === 1)
          }
        })
        .catch(err => {
          console.log('err: ', err)
          return {
            success: false,
            errors: formatErrors(err, models)
          }
        })
    })         
  },

  GetInvoicesResponse: {
    project: ({ projectId }, args, { models }) => models.Project.findOne({ where: {id: projectId} }, { raw: true }),

    sale: ({ saleId }, args, { models }) => models.Sale.findOne({ where: {id: saleId} }, { raw: true }),

    customer: ({ customerId }, args, { models }) => models.Customer.findOne({ where: {id: customerId} }, { raw: true })
  },

  Invoice: {

    customer: ({ customerId }, args, { models }) => {

      return models.Customer.findOne({ where: {id: customerId} }, { raw: true })
    },

    project: ({ projectId }, args, { models }) => {

      return models.Project.findOne({ where: {id: projectId} }, { raw: true })
    },

    sale: ({ saleId }, args, { models }) => {

      return models.Sale.findOne({ where: {id: saleId} }, { raw: true })
    },

    total: ({ projectId, saleId }, args, { models }) => {

      if (projectId) {
        return models.Task.sum('price',
          { where: {projectId} }, { raw: true })  
      }
      if (saleId) {
        return models.Item.sum('price',
          { where: {saleId} }, { raw: true })  
      }
      return null
    },

    user: ({ userId }, args, { models }) => {

      return models.User.findOne({ where: {id: userId} }, { raw: true })
    }
  }

   
}