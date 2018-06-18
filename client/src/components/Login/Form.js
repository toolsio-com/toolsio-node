import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { graphql } from 'react-apollo'
import { LOGIN_USER_MUTATION } from '../../graphql/authentications'

import { Validation } from '../../utils'

import { wsLink } from '../../apollo'

// Localization 
import T from 'i18n-react'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      errors: {},
      isLoading: false
    }
  }
  /*
  componentDidMount = () => {
    const { match } = this.props

    if (match && match.params.token) {
      this.props.confirmEmail(match.params.token)
        .then(res => {
        
          if (res.data.confirmed) {
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("log_in.confirm_email.success")
            })
          } else {
            this.props.addFlashMessage({
              type: 'info',
              text: T.translate("log_in.confirm_email.info")
            })
          }

        })
    }
  }*/

  handleChange = (e) => {
    if (this.state.errors[e.target.name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[e.target.name]

      this.setState({
        [e.target.name]: e.target.value,
        errors
      })
    } else {
      this.setState({
        [e.target.name]: e.target.value
      })
    }
  }

  isValid() {
    const { email, password } = this.state
    const { errors, isValid } = Validation.validateLoginInput({email, password})

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors = errors

    if (!isValid) {
      this.setState({ errors: updatedErrors })
    }

    return isValid;
  }

  handleSubmit = (e) => {
    e.preventDefault()
    
    const { email, password } = this.state
  
    if (this.isValid()) {
      this.setState({ errors: {}, isLoading: true })

      this.props.mutate({variables: { email, password }})
        .then(res => {
          const { success, authToken, refreshAuthToken, errors } = res.data.loginUser
      
          if (success) {
            localStorage.setItem('authToken', authToken)
            localStorage.setItem('refreshAuthToken', refreshAuthToken)
            
            // Re-connect to wsLink
            wsLink.subscriptionClient.tryReconnect()
            
            this.props.addFlashMessage({
              type: 'success',
              text: 'You have signed in successfully!'
            })

            // Redirect to dashboard
            this.context.router.history.push('/dashboard')
          } else {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)
            this.setState({ errors: errorsList, isLoading: false })
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }))
    }
  }

  render() {
    const { email, password, errors, isLoading } = this.state
  
    return (  
        <form className={classnames("ui large form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>
          <div className="ui stacked segment">

            { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> } 

            <div className={classnames("field", { error: errors.email })}>
              <div className="ui right icon input">
                <i className="user icon"></i>
                <input type="text" name="email" placeholder={T.translate("log_in.email")} 
                  value={email} onChange={this.handleChange} />
              </div>
              <span className="red">{errors.email}</span>
            </div>  
            <div className={classnames("field", { error: errors.password })}>
              <div className="ui right icon input">
                <i className="lock icon"></i>
                <input type="password" name="password" placeholder={T.translate("log_in.password")}
                  value={password} onChange={this.handleChange} />                
              </div>
              <span className="red">{errors.password}</span>
            </div>
                  
            <button disabled={isLoading} className="ui fluid large teal submit button">{T.translate("log_in.log_in")}</button>
              
          </div>
        </form>         
      
    )
  }
}

// Proptypes definition
Form.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

Form.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(null, { addFlashMessage }) (graphql(LOGIN_USER_MUTATION)(Form))

