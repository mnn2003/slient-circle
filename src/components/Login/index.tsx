import { Navigate, useNavigate } from "react-router-dom";
import {
  errorMessageStyle,
  goToSignupContainerStyle,
  goToSignupStyle,
  loginBtnStyle,
  loginStyle,
  loginUidFormStyle,
  noAccountStyle,
} from "./style";
import { useContext, useState } from "react";

import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatThemeContext } from "@cometchat/chat-uikit-react";
import { CometChatUIKit } from "@cometchat/chat-uikit-react";
import { LoginSignup } from "../LoginSignup";
import { TextInput } from "../TextInput";

interface ILoginProps {
  loggedInUser: CometChat.User | null | undefined;
  setLoggedInUser: React.Dispatch<React.SetStateAction<CometChat.User | null | undefined>>;
  setInterestingAsyncOpStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Login(props: ILoginProps) {
  const { loggedInUser, setLoggedInUser, setInterestingAsyncOpStarted } = props;

  const [uid, setUid] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { theme } = useContext(CometChatThemeContext);

  async function login(uid: string) {
    try {
      setInterestingAsyncOpStarted(true);
      CometChatUIKit.login(uid)?.then((loggedInUser) => {
        console.log("Login successful, loggedInUser:", loggedInUser);
        setLoggedInUser(loggedInUser);
        navigate("/home");
      });
    } catch (error) {
      console.log("login failed", error);
      if (error instanceof CometChat.CometChatException && error.message) {
        setErrorMessage(error.message);
      }
      console.log(error);
    } finally {
      setInterestingAsyncOpStarted(false);
    }
  }

  async function handleLoginWithUidFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await login(uid);
    } catch (error) {
      console.log(error);
    }
  }

  function getErrorMessage() {
    if (!errorMessage) {
      return null;
    }
    return <div style={errorMessageStyle(theme)}>{errorMessage}</div>;
  }

  if (loggedInUser) {
    return <Navigate to="/home" />;
  }

  return (
    <LoginSignup title="Login to your account">
      <div style={loginStyle()}>
        {/* Removed the image element */}
        <form onSubmit={handleLoginWithUidFormSubmit} style={loginUidFormStyle()}>
          <TextInput
            labelText="Or else continue with login using UID"
            placeholderText="Enter UID here"
            value={uid}
            onValueChange={setUid}
            required
          />
          <button style={loginBtnStyle(theme)}>Login</button>
        </form>
        {getErrorMessage()}
        <div style={goToSignupContainerStyle()}>
          <div style={noAccountStyle(theme)}>Don't have an account?</div>
          <button onClick={() => navigate("/signup")} style={goToSignupStyle(theme)}>
            sign up
          </button>
        </div>
      </div>
    </LoginSignup>
  );
}
