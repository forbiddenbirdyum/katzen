import ReactDOM from 'react-dom';
import React from 'react';
import './styles/main.scss';
import AWSAppSyncClient from 'aws-appsync';
import { ApolloProvider } from 'react-apollo';
import { Rehydrated } from 'aws-appsync-react';
import App from './App';

const client = new AWSAppSyncClient({
  url: process.env.REACT_APP_APPSYNC_URL,
  region: process.env.REACT_APP_REGION,
  auth: {
    type: process.env.REACT_APP_AUTH_TYPE,
    apiKey: process.env.REACT_APP_APPSYNC_KEY,
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Rehydrated>
      <App />
    </Rehydrated>
  </ApolloProvider>,
  document.getElementById('root'),
);
