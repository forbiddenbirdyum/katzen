import React from 'react';
import gql from 'graphql-tag';
import { nanoid } from 'nanoid';
import { graphql } from 'react-apollo';
import styles from './ChatInput.module.scss';

const CreateMessage = gql`
mutation createMessage($messageID: String!, $message: String!, $timestamp: Long!) {
  createMessage(input: {
    messageID: $messageID
    message: $message
    timestamp: $timestamp
  }) {
    messageID
    timestamp
    message
  }
} 
`;
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

const ChatInput = ({ addMessage }) => {
  const [message, setMessage] = React.useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    const messageID = nanoid();
    const payload = { messageID, message, timestamp: +Date.now() };
    addMessage(payload);
    setMessage('');
  };
  return (
    <form className={styles['message-box']} onSubmit={handleSubmit}>
      <input className={styles['text-input']} value={message} onChange={(e) => setMessage(e.target.value)} type="text" />
      <input className={styles['submit-btn']} type="submit" />
    </form>
  );
};

export default graphql(CreateMessage, {
  options: {
    update: (dataProxy, { data: { createMessage } }) => {
      const query = ListMessages;
      const data = dataProxy.readQuery({ query });
      data.listMessages.items.push(createMessage);
      data.listMessages.items = [createMessage, ...data.listMessages.items
        .filter((message) => message.messageID !== createMessage.messageID)];
      dataProxy.writeQuery({ query, data });
    },
  },
  props: (props) => ({
    addMessage: (message) => {
      props.mutate({
        variables: message,
        optimisticResponse: () => ({
          createMessage: { ...message, __typename: 'Message' },
        }),
      });
    },
  }),
})(ChatInput);
