import React from "react";

import Header from "./Header";
import TodoPrivateWrapper from "./Todo/TodoPrivateWrapper";
// import TodoPublicWrapper from "./Todo/TodoPublicWrapper";
import OnlineUsersWrapper from "./OnlineUsers/OnlineUsersWrapper";
import { WebSocketLink } from "@apollo/client/link/ws";

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import { useAuth0 } from "./Auth/react-auth0-spa";

const createApolloClient = (token) => {
  return new ApolloClient({
    link: new WebSocketLink({
     
      uri:'wss://react-todos-app.hasura.app/v1/graphql',
      options: { 
        reconnect: true,
        connectionParams: { 
          headers:{
            Authorization: `Bearer ${token}`
          },
        }
      }
    }),
    cache: new InMemoryCache(),
  })
}

const App = ({ idToken }) => {
  const { loading, logout } = useAuth0();
  if (loading) {
    return <div>Loading...</div>;
  }
  const client = createApolloClient(idToken);
  return (
    <ApolloProvider client = { client }>
    <div>
      <Header logoutHandler={logout} />
      <div className="row container-fluid p-left-right-0 m-left-right-0" >
        <div className="row col-md-9 p-left-right-0 m-left-right-0">
          <div className="col-md-6 sliderMenu p-30" id="main">
         
            <TodoPrivateWrapper />
          </div>
          <div className="col-md-6 sliderMenu p-30  border-right">
            <img className="img" src="/3.svg" alt="error" />
          </div>
          
          
        </div>
        <div className="col-md-3 p-left-right-0">
          <div className="col-md-12 sliderMenu p-30 bg-gray">
            <OnlineUsersWrapper />
          </div>
        </div>
      </div>
    </div>
    </ApolloProvider>
  );
};

export default App;
