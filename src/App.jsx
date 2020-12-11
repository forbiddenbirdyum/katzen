import React from 'react';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import './App.css';

function App() {
  return (
    <div className="App">
      <ChatWindow />
      <ChatInput />
    </div>
  );
}

export default App;
