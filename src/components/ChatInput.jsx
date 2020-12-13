import React from 'react';
import { nanoid } from 'nanoid';
import { graphqlMutation } from 'aws-appsync-react';
import styles from './ChatInput.module.scss';
import { CreateMessage, ListMessages } from '../queries';

const ChatInput = ({ createMessage }) => {
  const [message, setMessage] = React.useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    const messageID = nanoid();
    const payload = { messageID, message, timestamp: +Date.now() };
    createMessage(payload);
    setMessage('');
  };
  return (
    <form className={styles['message-box']} onSubmit={handleSubmit}>
      <input className={styles['text-input']} value={message} onChange={(e) => setMessage(e.target.value)} type="text" />
      <input className={styles['submit-btn']} type="submit" />
    </form>
  );
};

export default graphqlMutation(CreateMessage, ListMessages, 'Message', 'messageID')(ChatInput);
