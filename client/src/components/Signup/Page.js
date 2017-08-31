import React, { Component } from 'react' 
import { connect } from 'react-redux'
import Form from './Form'
import { signupRequest, isAccountExists, isUserExists} from '../../actions/authentication'
import { addFlashMessage } from '../../actions/flashMessages'
import FlashMessagesList from '../../flash/FlashMessagesList'

// Localization 
import T from 'i18n-react'

import logo from '../../images/logo-square.png'; 

class Page extends Component {
  render() {
    const { signupRequest, isAccountExists, isUserExists, addFlashMessage, account } = this.props
    
    return (          
      <div>
        <h2 className="ui teal image header">
          <a className="" href="/">
            <img src={logo} className="image" alt="logo-square" />
          </a>
          <div className="content">{T.translate("sign_up.header")}</div>
        </h2>
        
        <FlashMessagesList />
        
        <Form signupRequest={signupRequest} isAccountExists={isAccountExists} 
        isUserExists={isUserExists} addFlashMessage={addFlashMessage}
        account={account}/> 

        <div className="ui message"> 
          {T.translate("sign_up.already_a_user")}&nbsp;<a href="/login">{T.translate("sign_up.log_in_here")}</a>
        </div>
        <div className="ui text-container m-t-m">
          <small className="visible-all-block">{T.translate("landing.footer.copyright")}</small>
          <small className="visible-all-block">{T.translate("landing.footer.address")}</small>
        </div>
      </div>  
    )
  }
}

// Proptypes definition
Page.propTypes = {
  signupRequest: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired,
  isAccountExists: React.PropTypes.func.isRequired,
  isUserExists: React.PropTypes.func.isRequired,
  account: React.PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    account: state.auth.account
  } 
}

export default connect(mapStateToProps, { signupRequest, addFlashMessage, isAccountExists, isUserExists })(Page)


