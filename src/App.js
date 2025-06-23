// App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // Importe BrowserRouter
import Topo from './components/topo'; // Verifique o case: Topo ou topo
import Principal from './components/principal'; // Verifique o case: Principal ou principal
import Rodape from './components/rodape'; // Verifique o case: Rodape ou rodape
import './App.css';

const App = function() {
    return (
        <Router> {/* Envolve toda a aplicação para habilitar o roteamento */}
            <div className="App">
                <Topo />
                <Principal /> {/* Principal agora contém as rotas */}
                <Rodape />
            </div>
        </Router>
    );
}

export default App;