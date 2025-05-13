// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import CompShowMessages from './message/ShowMessage';
import CompCreateMessage from './message/CreateMessage';
import CompEditMessage from './message/EditMessage';
import CompShowUnits from './unit/ShowUnit';
import CompCreateUnit from './unit/CreateUnit';
import CompEditUnit from './unit/EditUnit';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/messages' element={<CompShowMessages />} />
                <Route path='/create' element={<CompCreateMessage />} />
                <Route path='/edit/:id' element={<CompEditMessage />} />
                <Route path='/units' element={<CompShowUnits />} />
                <Route path='/units/create' element={<CompCreateUnit />} />
                <Route path='/units/edit/:id' element={<CompEditUnit />} />
            </Routes>
        </Router>
    );
}

export default App;