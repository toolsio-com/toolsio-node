export default `

  type RegisterResponse {
    success: Boolean!
    account: Account
    errors: [Error!]
  }

  type LoginResponse {
    success: Boolean!
    authToken: String
    refreshAuthToken: String
    errors: [Error!]
  }

  type IsSubdomainExistResponse {
    success: Boolean!
    subdomain: String
    errors: [Error!]
  }

  type ForgotPasswordResetRequestPasswordResetResponse {
    success: Boolean!
    errors: [Error!]
  }

  type Mutation {
    registerUser(firstName: String, lastName: String, email: String!, password: String!,
      subdomain: String!, industry: String!): RegisterResponse!

    loginUser(email: String!, password: String!): LoginResponse!

    isSubdomainExist(subdomain: String!): IsSubdomainExistResponse!

    forgotPasswordResetRequest(email: String!): ForgotPasswordResetRequestPasswordResetResponse!

    passwordReset(password: String! token: String!): ForgotPasswordResetRequestPasswordResetResponse!
    
    registerInvitedUser(firstName: String, lastName: String, email: String!, password: String!, token: String!): RegisterResponse!
  }

`