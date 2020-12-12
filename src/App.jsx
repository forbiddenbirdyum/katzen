import React from 'react';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

function App() {
  return (
    <div className="App">
      <main className="chat-container">
        <ChatWindow />
        <ChatInput />
      </main>
    </div>
  );
}

export default App;
