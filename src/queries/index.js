import gql from 'graphql-tag';

export const CreateMessage = gql`
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
export const ListMessages = gql`
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
export const MessageCreated = gql`
subscription messageCreateSub {
  onCreateMessage {
    message
    messageID
    timestamp
  }
}
`;

export const MessageDeleted = gql`
subscription messageDeleteSub {
  onDeleteMessage {
    messageID
  }
}
`;

export const DeleteMessage = gql`
mutation deleteMessage($messageID: String!, $timestamp: Long!) {
  deleteMessage(input: {
    messageID: $messageID
    timestamp: $timestamp
  })  {
    messageID
  }
}
`;
