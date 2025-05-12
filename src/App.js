import logo from './logo.svg';
import './App.css';
import CompShowMessages from './message/ShowMessage';
import CompCreateMessage from './message/CreateMessage';
import CompEditMessage from './message/EditMessage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Message Management</h1>
      </header>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<CompShowMessages />} />
          <Route path='/create' element={<CompCreateMessage />} />
          <Route path='/edit/:id' element={<CompEditMessage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;