import React from 'react';
import DoctorsList from './components/DoctorsList';
import Header from './components/Header';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <DoctorsList />
      </main>
    </div>
  );
}

export default App;