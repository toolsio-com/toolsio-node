import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import MessageForm from './Form/Message'

// Localization 
import T from 'i18n-react'

import avatarPlaceholderSmall from '../../../images/avatar-placeholder-small.png'

const NEW_DIRECT_MESSAGE_SUBSCRIPTION = gql`
  subscription($receiverId: Int!) {
    getNewDirectMessage(receiverId: $receiverId) {
      id
      message
      isRead
      createdAt
      user {
        id
        email
        avatarUrl
      }
    }
  }
`

class Messages extends Component {

  componentDidMount() {
    this.unsubscribe = this.subscribe(this.props.receiverId)
  }

  componentWillReceiveProps({ receiverId }) {    
    if (this.props.receiverId !== receiverId) {
      if (this.unsubscribe) {
        this.unsubscribe()
      }
      this.unsubscribe = this.subscribe(receiverId)
    }
  }﻿

  componentWillUnmount() {   
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }﻿

  subscribe = (receiverId) => 
    this.props.getDirectMessagesQuery.subscribeToMore({
      document: NEW_DIRECT_MESSAGE_SUBSCRIPTION,
      variables: {
        receiverId: parseInt(receiverId)
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        
        return {
          ...prev,
          getDirectMessages: [...prev.getDirectMessages, subscriptionData.data.getNewDirectMessage],
        }
      }
    })

  render() {

    const { getUserQuery: { getUser }, getDirectMessagesQuery: { getDirectMessages } } = this.props

    const emptyMessage = (
      <div className="ui info message">
        <h3>{T.translate(`conversations.messages.empty_message_header`)}</h3>
        <p>{T.translate(`conversations.messages.empty_direct_message_message`)}</p>
      </div>
    )

    const messagesList = getDirectMessages && getDirectMessages.map(message => 
      <div key={message.id} className="comment">
        <a className="avatar">
          {message.user.avatarUrl ? <img src={message.user.avatarUrl} alt="avatar-url-small" /> : <img src={avatarPlaceholderSmall}
          alt="avatar-placeholder-small" />}
        </a>
        <div className="content">
          <a className="author">{message.user.email}</a>
          <div className="metadata">
            <span className="date">{message.createdAt}</span>
          </div>
          <div className="text">
            {message.message}
          </div>
        </div>
      </div>
    )

    return (
      <div className="messages">

        <div className="ui clearing vertical segment border-bottom-none">
          <div className="ui left floated header">
            <h3 className="header capitalize-text">{getUser && getUser.firstName}</h3>
          </div>        
        </div>   

        <div className="ui divider mt-0"></div>

        <div className="ui comments">

          { getDirectMessages && getDirectMessages.length === 0 ? emptyMessage : messagesList }

        </div>   
        
        <MessageForm receiverId={this.props.receiverId} />

      </div>
    ) 
  }
}

const getUserQuery = gql`
  query getUser($id: Int!) {
    getUser(id: $id) {
      id
      firstName
      email
    }
  }
`

const getDirectMessagesQuery = gql`
  query getDirectMessages($receiverId: Int!) {
    getDirectMessages(receiverId: $receiverId) {
      id
      message
      isRead
      createdAt
      user {
        id
        email
        avatarUrl
      }
    }
  }
`

const MutationsAndQuery =  compose(
  graphql(getUserQuery, {
    "name": "getUserQuery",
    options: (props) => ({
      variables: {
        id: parseInt(props.receiverId)
      }
    })
  }),
  graphql(getDirectMessagesQuery, {
    "name": "getDirectMessagesQuery",
    options: (props) => ({
      variables: {
        receiverId: parseInt(props.receiverId)
      },
      fetchPolicy: 'network-only'
    })
  })
)(Messages)

export default MutationsAndQuery


