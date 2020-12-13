import React from 'react';
import { nanoid } from 'nanoid';
import { graphql } from 'react-apollo';
import styles from './ChatInput.module.scss';
import { CreateMessage, ListMessages } from '../queries';

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
      data.listMessages.items = data.listMessages.items
        .filter((message) => message.messageID !== createMessage.messageID);
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
