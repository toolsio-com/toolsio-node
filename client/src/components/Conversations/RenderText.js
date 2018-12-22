import React, { Component } from 'react'

export default class RenderText extends Component {

  state = {
    text: ''
  }

  UNSAFE_componentWillMount = async () => {
    const response = await fetch(this.props.uploadPath)
    const text = await response.text()
    this.setState({ text })
  }

  render() {
    const { text } = this. state

    return (
      <pre>
        {text}
      </pre>
      )
  }
}