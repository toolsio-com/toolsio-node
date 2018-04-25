import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {

  Query: {
    getProject: requiresAuth.createResolver((parent, { id }, { models }) =>  models.Project.findOne({ where: { id } })),
    
    getProjects: requiresAuth.createResolver((parent, args, { models }) => models.Project.findAll()),

    getProjectsWithoutInvoice: requiresAuth.createResolver((parent, args, { models }) => 
      models.sequelize.query('select p.id, p.name, p.deadline, p.status, p.progress, p.description, p.total, p.customer_id, p.user_id from projects as p join invoices as i on (p.id != i.project_id)', {
        model: models.Project,
        raw: true,
      }))
  },

  Mutation: {
    createProject: requiresAuth.createResolver((parent, args, { models, user }) => {
      return models.Project.create({...args, userId: user.id})
        .then(project => {
          return {
            success: true,
            project
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

    updateProject: requiresAuth.createResolver((parent, args, { models }) => {
      return models.Project.update(args, { where: {id: args.id}, returning: true, plain: true })
        .then(result => {  
          return {
            success: true,
            project: result[1].dataValues
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

    deleteProject: requiresAuth.createResolver((parent, args, { models }) => {
      return models.Project.destroy({ where: {id: args.id}, force: true })
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

  Project: {
    tasks: ({ id }, args, { models } ) => models.Task.findAll({ where: { projectId: id} }),

    customer: ({ customerId }, args, { models }) => models.Customer.findOne({ where: {id: customerId} }, { raw: true }),

    user: ({ userId }, args, { models }) => models.User.findOne({ where: {id: userId} }, { raw: true })
  },

  GetProjectsResponse: {
    customer: ({ customerId }, args, { models }) => models.Customer.findOne({ where: {id: customerId} }, { raw: true }),

    user: ({ userId }, args, { models }) => models.User.findOne({ where: {id: userId} }, { raw: true })    
  },

  GetProjectsWithoutInvoiceResponse: {
    customer: ({ customer_id }, args, { models }) => models.Customer.findOne({ where: {id: customer_id} }, { raw: true })  
  }
}

