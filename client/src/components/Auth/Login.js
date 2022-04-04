import React from "react";
import { useAuth0 } from "./react-auth0-spa";

import { Button } from "react-bootstrap";

const Login = () => {
  const { loading, loginWithRedirect } = useAuth0();
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="overlay" >
      
      <div className="overlay-content">
      <img className="log-in-img" src="/2.svg" alt="error" />
     
        <div className="overlay-heading">
          Welcome to Todos app
        </div>
        <div className="overlay-message">Please login to continue</div>
        <div className="overlay-action">
          <Button
            id="qsLoginBtn"
            variant="dark"
            className="btn-margin loginBtn"
            onClick={() => {
              loginWithRedirect({});
            }}
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
