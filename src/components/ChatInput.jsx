import { graphqlMutation } from 'aws-appsync-react';
import { nanoid } from 'nanoid';
import React from 'react';
import { CreateMessage, ListMessages } from '../queries';
import styles from './ChatInput.module.scss';

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
