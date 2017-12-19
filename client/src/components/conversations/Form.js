import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { InputField } from '../../utils/FormFields'

// Localization 
import T from 'i18n-react'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.message ? this.props.message._id : null,
      recipient: this.props.message ? this.props.message.recipient : '',
      title: this.props.message ? this.props.message.title : '',
      message: this.props.message ? this.props.message.message : '',
      errors: {
        message: {
          errors: {}
        }
      },
      isLoading: false
    }
  }

  handleChange = (e) => {

    if (!!this.state.errors[e.target.name]) {
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
    const { errors, isValid } = Validation.validateMessageInput(this.state)

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors.message.errors = errors

    if (!isValid) {
      this.setState({ 
        errors: updatedErrors 
      })
    }

    return isValid;
  }

  handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (this.isValid()) { 
      const { _id, title, body } = this.state
      this.setState({ isLoading: true })
      this.props.composeMessage({ _id, title, recipient, message })
        .catch( ( {response} ) => this.setState({ errors: response.data.errors, isLoading: false }) ) 
    }
  }

  render() {
    const { _id, title, recipient, message } = this.state

    const recipientsOptions = map(this.props.recipients, (recipient) => 
      <option key={recipient._id} value={recipient._id}>{recipient.name}</option>
    )

    return (  
      <div className="ui stackable centered grid">
        <div className="eight wide column ui segment">  

          <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>

            <div className="inline field">  
               <h1 className="ui header">{T.translate("customers.form.new_customer")}</h1>
            </div>

            { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> }

            <SelectField
              name="customer"
              value={customer ? (typeof customer === 'object' ? customer._id : customer) : ''} 
              onChange={this.handleChange.bind(this)} 
              error={errors.message && errors.message.errors && errors.message.errors.customer && errors.message.errors.customer.message}
              formClass="inline field"

              options={[<option key="default" value="" disabled>{T.translate("conversations.form.select_recipient")}</option>,
                customersOptions]}
            />

            <InputField
              label={T.translate("conversations.show.title")}
              name="title" 
              value={title} 
              onChange={this.handleChange.bind(this)} 
              placeholder="Title"
              error={errors.message && errors.message.errors && errors.message.errors.title && errors.message.errors['name'].message}
              formClass="inline field"
            />
            
            <TextAreaField
              label={T.translate("conversations.form.message")}
              name="body" 
              value={body} 
              onChange={this.handleChange.bind(this)} 
              placeholder={T.translate("conversations.form.message")}
              formClass="inline field"
            /> 

            <div className="inline field">    
              <button disabled={isLoading} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("conversations.form.send")}</button>
            </div>  
          </form> 
        </div>  
      </div>
    )
  }
}

Form.propTypes = {
  composeMessage: PropTypes.func.isRequired,
  recipients: PropTypes.array.isRequired
}

export default Form