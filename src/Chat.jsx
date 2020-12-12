import React from 'react';
import { ChatInput, ChatWindow } from './components';
import styles from './Chat.module.scss';

const Chat = () => (
  <div className={styles['chat-container']}>
    <ChatWindow />
    <ChatInput />
  </div>
);

export default Chat;
