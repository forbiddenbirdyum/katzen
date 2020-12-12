import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const listMessages = gql`
query listMessages {
  listMessages {
    items {
      messageID
      timestamp
      message
    }
  }
} 
`;

function Chat({ messages }) {
  return (
    <section className="chatlog">
      {messages.map((message) => (<span className="message" key={message.messageID}>{message.message}</span>))}
    </section>
  );
}

export default graphql(listMessages, {
  options: {
    fetchPolicy: 'cache-and-network',
  },
  props: ({ data: { listMessages: entries } }) => ({
    messages: entries ? entries.items : [],
  }),
})(Chat);
