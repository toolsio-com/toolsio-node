import React, { PureComponent } from "react";
import Dropzone from "react-dropzone";
// Semantic UI Form elements
import { Form, Message as MessageElement, Icon } from "semantic-ui-react";
import { graphql, compose } from "react-apollo";
import { GET_USER_QUERY } from "../../../../graphql/users";
import {
  GET_DIRECT_MESSAGE_USERS_QUERY,
  CREATE_DIRECT_MESSAGE_MUTATION
} from "../../../../graphql/conversations/directMessages";

// Localization
import T from "i18n-react";

const ENTER_KEY = 13;

class Message extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      receiverId: this.props.receiverId ? this.props.receiverId : null,
      body: "",
      errors: {},
      isLoading: false
    };
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (nextProps.receiverId) {
      this.setState({
        receiverId: nextProps.receiverId
      });
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    const { body } = this.state;

    // Validation
    if (e.keyCode === ENTER_KEY) {
      if (!body.trim()) {
        return;
      } else {
        const { receiverId, body } = this.state;

        this.setState({ isLoading: true });

        this.props
          .mutate({
            variables: { body, receiverId: parseInt(receiverId) },
            optimisticResponse: {
              createDirectMessage: {
                __typename: "Mutation",
                id: -1,
                success: true,
                errors: null,
                message: {
                  __typename: "Message",
                  id: -1
                }
              }
            },
            update: store => {
              const data = store.readQuery({
                query: GET_DIRECT_MESSAGE_USERS_QUERY
              });
              const notUserInList = data.getDirectMessageUsers.every(
                user => user.id !== parseInt(receiverId, 10)
              );

              if (notUserInList) {
                data.getDirectMessageUsers.push({
                  __typename: "DirectMessageUser",
                  id: parseInt(receiverId, 10),
                  first_name: this.props.data.getUser.firstName,
                  email: this.props.data.getUser.email
                });
              }
              // Write our data back to the cache.
              store.writeQuery({ query: GET_DIRECT_MESSAGE_USERS_QUERY, data });
            }
          })
          .then(res => {
            const { success, errors } = res.data.createDirectMessage;

            if (success) {
              // Rest message state
              this.setState({
                body: ""
              });

              // Reset reload
              this.setState({ isLoading: false });
            } else {
              let errorsList = {};
              errors.map(error => (errorsList[error.path] = error.message));

              this.setState({ errors: errorsList, isLoading: false });
            }
          })
          .catch(err => this.setState({ errors: err, isLoading: false }));
      }
    }
  };

  handleOnDrop = async ([file]) => {
    const { receiverId } = this.state;
    this.setState({ isLoading: true });

    await this.props
      .mutate({
        variables: { file, receiverId: parseInt(receiverId) },
        optimisticResponse: {
          createDirectMessage: {
            __typename: "Mutation",
            id: -1,
            success: true,
            errors: null,
            message: {
              __typename: "Message",
              id: -1
            }
          }
        },
        update: store => {
          const data = store.readQuery({
            query: GET_DIRECT_MESSAGE_USERS_QUERY
          });
          const notUserInList = data.getDirectMessageUsers.every(
            user => user.id !== parseInt(receiverId, 10)
          );

          if (notUserInList) {
            data.getDirectMessageUsers.push({
              __typename: "DirectMessageUser",
              id: parseInt(receiverId, 10),
              first_name: this.props.data.getUser.firstName,
              email: this.props.data.getUser.email
            });
          }

          // Write our data back to the cache.
          store.writeQuery({ query: GET_DIRECT_MESSAGE_USERS_QUERY, data });
        }
      })
      .then(res => {
        const { success, errors } = res.data.createDirectMessage;

        if (success) {
          // Reset reload
          this.setState({ isLoading: false });
        } else {
          let errorsList = {};
          errors.map(error => (errorsList[error.path] = error.message));

          this.setState({ errors: errorsList, isLoading: false });
        }
      })
      .catch(err => this.setState({ errors: err, isLoading: false }));
  };

  render() {
    const { body, errors, isLoading } = this.state;

    return (
      <Form loading={isLoading} className="pt-5">
        {!!errors.message && (
          <MessageElement negative>
            <p>{errors.message}</p>
          </MessageElement>
        )}

        <div className="ui fluid action input" style={{ marginRight: "10px" }}>
          <Dropzone onDrop={this.handleOnDrop.bind(this)}>
            {({ getRootProps, getInputProps }) => (
              <div className="ignore ui primary button" {...getRootProps()}>
                <input {...getInputProps()} />
                <Icon name="plus" />
              </div>
            )}
          </Dropzone>

          <Form.TextArea
            placeholder={T.translate("conversations.form.message")}
            name="body"
            value={body}
            onChange={this.handleChange.bind(this)}
            onKeyDown={this.handleSubmit.bind(this)}
            rows="2"
          />
        </div>
      </Form>
    );
  }
}

const MutationsAndQuery = compose(
  graphql(CREATE_DIRECT_MESSAGE_MUTATION),
  graphql(GET_DIRECT_MESSAGE_USERS_QUERY),
  graphql(GET_USER_QUERY, {
    options: props => ({
      variables: {
        id: parseInt(props.receiverId, 10)
      }
    })
  })
)(Message);

export default MutationsAndQuery;
