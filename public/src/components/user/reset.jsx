import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import "./login.css";
import { respons } from "../../servises/index.js";
import { connect } from "react-redux";
import { setUserData } from "../../redux/auth-reducer.js";

import Header from "../../components/header/Header.jsx";
import { TextField } from "@material-ui/core";
import Swal from "sweetalert2";

export class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      ErrorLog: false,
      ErrorEmail: false,
    };
    this.changeVar = this.changeVar.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    let { ErrorEmail } = this.state;
    this.state.login.length > 0 ? (ErrorEmail = false) : (ErrorEmail = true);

    this.setState({
      ErrorEmail: ErrorEmail,
    });

    if (!ErrorEmail) {
      this.Submit();
    }
  }

  Submit() {
    const body = {
      Login: this.state.login,
    };

    respons("post", "/reset", JSON.stringify(body))
      .then((data) => {
        try {
          if (data) {
            Swal.fire({
              icon: "success",
              showConfirmButton: true,
              text: this.props.translate("resetSend"),
            }).then((result) => {
              if (result.value) {
                this.props.history.push("/");
              }
            });
          }
        } catch (e) {
          console.log(e);
        }
      })
      .catch((e) => {
        if (e.message === "Login or Email error") {
          Swal.fire({
            icon: "error",
            showConfirmButton: true,

            text: this.props.translate("inputLoginOrEmail"),
          });
        }
        console.error(e);
        this.setState({
          ErrorLog: true,
        });
      });
  }
  changeVar(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    const { translate } = this.props;
    const { ErrorEmail } = this.state;

    if (this.props.isAuth) {
      if (this.props.location.state) {
        this.props.history.push(this.props.location.state.loc);
      } else {
        this.props.history.push("/userPage");
      }
    }
    return (
      <div className="Login">
        <Header {...this.props} className="header-login" />
        <div className="login">
          <img
            src="../../../public/image/backgroundMain.jpg"
            className="image-login-background"
          />
          <div className="form-login rounded border border-dark back-color">
            <form onSubmit={this.handleSubmit}>
              <div className="my-3">
                <TextField
                  id="standard-basic"
                  label={translate("login")}
                  variant="standard"
                  type="text"
                  name="login"
                  value={this.login}
                  onChange={this.changeVar}
                  className="form-control"
                />
              </div>
              {ErrorEmail && (
                <span className="text-danger">
                  {translate("error_RequireEmail")}
                </span>
              )}

              <input
                type="submit"
                className="btn btn-success my-3 w-100"
                value={translate("log_in")}
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  language: state.Intl.locale,
});
export default connect(mapStateToProps, { setUserData })(withTranslate(Reset));
