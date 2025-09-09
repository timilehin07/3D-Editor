import React from 'react';
import { Header } from './components/Header';
import { EditorLayout } from './components/EditorLayout';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <EditorLayout />
    </div>
  );
}

export default App;