import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Validation } from "../../utils";
// Semantic UI Form elements
import {
  Container,
  Segment,
  Input,
  Button,
  Icon,
  Form as FormElement,
  Message
} from "semantic-ui-react";
import { addFlashMessage } from "../../actions/flashMessageActions";
import { graphql } from "react-apollo";
import {
  SEND_INVITATION_MUTATION,
  GET_INVITED_USERS_QUERY
} from "../../graphql/users";

// Localization
import T from "i18n-react";

class Form extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errors: {},
      isLoading: false
    };
  }

  handleChange = (name, value) => {
    if (this.state.errors[name]) {
      let errors = Object.assign({}, this.state.errors);
      delete errors[name];

      this.setState({
        [name]: value,
        errors
      });
    } else {
      this.setState({
        [name]: value
      });
    }
  };

  isValid() {
    const { errors, isValid } = Validation.validateUserInvitationInput(
      this.state
    );

    let updateErrors = Object.assign({}, this.state.errors);
    updateErrors = errors;

    if (!isValid) {
      this.setState({ errors: updateErrors });
    }

    return isValid;
  }

  handleSubmit = e => {
    e.preventDefault();

    if (this.isValid()) {
      const { email } = this.state;

      this.setState({ isLoading: true });

      this.props
        .mutate({
          variables: { email },
          update: (store, { data: { sendInvitation } }) => {
            const { success } = sendInvitation;

            if (!success) {
              return;
            }

            const data = store.readQuery({ query: GET_INVITED_USERS_QUERY });

            const invitedUser = {
              id: -1,
              email: email,
              isInvitationAccepted: false,
              __typename: "InvitedUser"
            };

            let updatedInvitedUsers = [...data.getInvitedUsers, invitedUser];

            data.getInvitedUsers = updatedInvitedUsers;

            // Write our data back to the cache.
            store.writeQuery({ query: GET_INVITED_USERS_QUERY, data });
          }
        })
        .then(res => {
          const { success, errors } = res.data.sendInvitation;

          if (success) {
            this.props.addFlashMessage({
              type: "success",
              text: T.translate("users.flash.invitation_success", {
                email: email
              })
            });

            this.setState({ email: "", isLoading: false });
          } else {
            let errorsList = {};
            console.log("errors: ", res.data.sendInvitation);
            errors.map(error => (errorsList[error.path] = error.message));

            this.setState({ errors: errorsList, isLoading: false });
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }));
    }
  };

  render() {
    const { email, errors, isLoading } = this.state;

    const {
      user: { isAdmin }
    } = this.props.currentAccount;

    return (
      <Container text>
        <Segment>
          <fieldset className="custom-fieldset">
            <legend className="custom-legend">
              {T.translate("users.form.invite_user_label")}
            </legend>

            <FormElement
              loading={isLoading}
              onSubmit={this.handleSubmit.bind(this)}
            >
              {!!errors.message && (
                <Message>
                  <p>{errors.message}</p>
                </Message>
              )}

              <FormElement.Field error={!!errors.email}>
                <label>{T.translate("users.form.email")}</label>
                <Input
                  placeholder={T.translate("users.form.email")}
                  name="email"
                  value={email}
                  onChange={(e, { value }) => this.handleChange("email", value)}
                  fluid
                  disabled={!isAdmin}
                />
                <span className="red">{errors.email}</span>
              </FormElement.Field>

              {!isAdmin && (
                <Message info size="small">
                  <Message.Content>
                    {T.translate("users.form.not_have_a_right_to_invite_user")}
                  </Message.Content>
                </Message>
              )}

              <Button primary disabled={isLoading || !isAdmin}>
                <Icon name="check circle outline" />
                &nbsp;{T.translate("users.form.invite_user")}
              </Button>
            </FormElement>
          </fieldset>
        </Segment>
      </Container>
    );
  }
}

Form.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
};

export default connect(
  null,
  { addFlashMessage }
)(graphql(SEND_INVITATION_MUTATION)(Form));
