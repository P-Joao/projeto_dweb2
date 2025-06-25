import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Topo from './components/topo';
import Principal from './components/principal';
import Rodape from './components/rodape';
import './App.css';

const App = function() {
    return (
        <Router> {/* Envolve toda a aplicação para habilitar o roteamento */}
            <div className="App">
                <Topo />
                <Principal /> {/* Contém as rotas */}
                <Rodape />
            </div>
        </Router>
    );
}

export default App;