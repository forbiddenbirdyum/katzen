import { buildSubscription } from 'aws-appsync';
import { graphqlMutation } from 'aws-appsync-react';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import {
  DeleteMessage, ListMessages, MessageCreated, MessageDeleted,
} from '../queries';
import styles from './ChatWindow.module.scss';
import ContextMenu from './ContextMenu';

const formatDate = (date) => new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' }).format(date);

// TODO infinite scroll with pagination
function ChatWindow({
  messages, subscribeToMore, deleteMessage,
}) {
  const [open, toggleOpen] = React.useState(false);
  const [posX, setPosX] = React.useState(0);
  const [posY, setPosY] = React.useState(0);
  const [selected, setSelected] = React.useState(null);

  const messageRef = React.useRef(null);
  const getPosition = (e) => {
    if (e.pageX || e.pageY) {
      setPosX(e.pageX);
      setPosY(e.pageY);
    } else {
      const x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      const y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;

      setPosX(x);
      setPosY(y);
    }
  };
  const handleRightClick = (e, message) => {
    e.preventDefault();
    setSelected(message);
    getPosition(e);
    toggleOpen(true);
  };

  const handleDelete = () => {
    deleteMessage(selected);
    toggleOpen(false);
  };

  const handleEdit = () => {
    toggleOpen(false);
  };

  React.useEffect(() => {
    subscribeToMore(buildSubscription(MessageCreated, ListMessages, 'messageID'));
    subscribeToMore(buildSubscription(MessageDeleted, ListMessages, 'messageID'));
  }, []);
  React.useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!messageRef?.current?.contains(e.target)) {
        toggleOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [messageRef]);
  return (
    <section className={styles['chat-window']}>
      {messages.sort((a, b) => a.timestamp - b.timestamp).map((message) => (
        <div
          onContextMenu={(e) => handleRightClick(e, message)}
          className={styles.message}
          key={message.messageID}
        >
          <span className={styles.content}>{message.message}</span>
          <span className={styles.timestamp}>{formatDate(message.timestamp)}</span>
        </div>
      ))}
      {open && (
      <ContextMenu
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        selected={selected}
        ref={messageRef}
        x={posX}
        y={posY}
      />
      )}
    </section>
  );
}

export default compose(
  graphql(ListMessages, {
    options: {
      fetchPolicy: 'cache-and-network',
    },
    props: (props) => ({
      messages: props.data.listMessages ? props.data.listMessages.items : [],
      subscribeToMore: props.data.subscribeToMore,
    }),
  }),
  graphqlMutation(DeleteMessage, ListMessages, 'Messages', 'messageID'),
)(ChatWindow);
