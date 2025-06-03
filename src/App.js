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
import CompPrivateRoute from './private/PrivateRoute';
import CompLogin from './login/Login';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<CompLogin />} />

                <Route path="/" element={
                    <CompPrivateRoute><Home /></CompPrivateRoute>
                } />

                <Route path="/messages" element={
                    <CompPrivateRoute><CompShowMessages /></CompPrivateRoute>
                } />

                <Route path="/create" element={
                    <CompPrivateRoute><CompCreateMessage /></CompPrivateRoute>
                } />

                <Route path="/edit/:id" element={
                    <CompPrivateRoute><CompEditMessage /></CompPrivateRoute>
                } />

                <Route path="/units" element={
                    <CompPrivateRoute><CompShowUnits /></CompPrivateRoute>
                } />

                <Route path="/units/create" element={
                    <CompPrivateRoute><CompCreateUnit /></CompPrivateRoute>
                } />

                <Route path="/units/edit/:id" element={
                    <CompPrivateRoute><CompEditUnit /></CompPrivateRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
