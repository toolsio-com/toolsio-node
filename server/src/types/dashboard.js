export default `
  
  type CountStatus {
    count: Int!
    status: String!
  }

  type CountMonth {
    mon: String!
    yyyy: String!
    count: Int!
  }

  type TotalIncomeData {
    data: Float!
  }

  type IncomesData {
    data: Float!
  }

  type ProjectsSalesData {
    countStatus: [CountStatus!]!
    countMonth: [CountMonth]! 
  }

  type CustomersData {
    data: Float!
  }

  type InvoicesData {
    data: Float!
  }

  type ProjectTasksData {
    data: Float!
  }

  type SaleTasksData {
    data: Float!
  }

  type InvoiceTasksData {
    data: Float!
  }

  type Query {
    getTotalIncomeData: TotalIncomeData!
    getIncomesData: IncomesData!
    getCustomersData: CustomersData!
    getProjectsData: ProjectsSalesData!
    getSalesData: ProjectsSalesData!
    getInvoicesData: InvoicesData!
    getProjectTasksData: ProjectTasksData!
    getSaleTasksData: SaleTasksData!
    getInvoiceTasksData: InvoiceTasksData!
  }



`