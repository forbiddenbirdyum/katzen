import React from 'react';
import { graphql, compose } from 'react-apollo';
import styles from './ChatWindow.module.scss';
import ContextMenu from './ContextMenu';
import {
  DeleteMessage, ListMessages, MessageCreated, MessageDeleted,
} from '../queries';

const formatDate = (date) => new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' }).format(date);

// TODO infinite scroll with pagination
function ChatWindow({
  messages, subMessageCreated, subMessageDeleted, removeMessage,
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
    console.log('deleting', selected);
    removeMessage(selected);
    toggleOpen(false);
  };

  const handleEdit = () => {
    console.log('editing', selected);
    toggleOpen(false);
  };

  React.useEffect(() => {
    subMessageCreated();
    subMessageDeleted();
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
  console.log(messages);
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
      fetchPolicy: 'network-only',
    },
    props: (props) => ({
      messages: props.data.listMessages ? props.data.listMessages.items : [],
      subMessageDeleted: () => {
        props.data.subscribeToMore({
          document: MessageDeleted,
          updateQuery: (prev, { subscriptionData: { data: { onDeleteMessage } } }) => ({
            ...prev,
            listMessages: { __typename: 'MessageConnection', items: prev.listMessages.items.filter((message) => message.messageID !== onDeleteMessage.messageID) },
          }),
        });
      },
      subMessageCreated: () => {
        props.data.subscribeToMore({
          document: MessageCreated,
          updateQuery: (prev, { subscriptionData: { data: { onCreateMessage } } }) => {
            console.log('SUBSCRIPTION UPDATE');
            console.log('subscribe', prev);
            console.log('subscribe', onCreateMessage);
            const items = [...prev.listMessages.items
              .filter((message) => message.messageID !== onCreateMessage.messageID),
            onCreateMessage,
            ];
            return ({
              listMessages: { __typename: 'MessageConnection', items },
            });
          },
        });
      },
    }),
  }),
  graphql(DeleteMessage, {
    options: {
      update: (dataProxy, { data: { deleteMessage } }) => {
        const query = ListMessages;
        const data = dataProxy.readQuery({ query });
        console.log('DELETE UPDATE');
        data.listMessages.items = [...data.listMessages.items
          .filter((message) => message.messageID !== deleteMessage.messageID)];
        console.log('Delete', data.listMessages);
        console.log('Delete', deleteMessage);
        dataProxy.writeQuery({ query, data });
      },
    },
    props: (props) => ({
      removeMessage: (message) => {
        props.mutate({
          variables: message,
          /* optimisticResponse: () => ({
            deleteMessage: { ...message, __typename: 'Message' },
          }), */
        });
      },
    }),
  }),
)(ChatWindow);
