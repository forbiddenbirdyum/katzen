import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import styles from './ChatWindow.module.scss';

const ListMessages = gql`
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

const MessageSub = gql`
subscription messageSub {
  onCreateMessage {
    message
    messageID
    timestamp
  }
}
`;

const formatDate = (date) => new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' }).format(date);

// TODO infinite scroll with pagination
function ChatWindow({ messages, subMessageCreated }) {
  React.useEffect(() => {
    subMessageCreated();
  }, []);
  return (
    <section className={styles['chat-window']}>
      {messages.sort((a, b) => a.timestamp - b.timestamp).map((message) => (
        <div className={styles.message} key={message.messageID}>
          <span className={styles.content}>{message.message}</span>
          <span className={styles.timestamp}>{formatDate(message.timestamp)}</span>
        </div>
      ))}
    </section>
  );
}

export default graphql(ListMessages, {
  options: {
    fetchPolicy: 'cache-and-network',
  },
  props: ({ data }) => ({
    messages: data.listMessages ? data.listMessages.items : [],
    subMessageCreated: () => {
      data.subscribeToMore({
        document: MessageSub,
        updateQuery: (prev, { subscriptionData: { data: { onCreateMessage } } }) => ({
          ...prev,
          listMessages: { __typename: 'MessageConnection', items: [onCreateMessage, ...prev.listMessages.items.filter((message) => message.messageID !== onCreateMessage.messageID)] },
        }),
      });
    },
  }),
})(ChatWindow);
