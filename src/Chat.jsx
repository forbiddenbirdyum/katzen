import React from 'react';
import styles from './Chat.module.scss';
import { ChatInput, ChatWindow } from './components';

const Chat = () => (
  <div className={styles['chat-container']}>
    <ChatWindow />
    <ChatInput />
  </div>
);

export default Chat;
