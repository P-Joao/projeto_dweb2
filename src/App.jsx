import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Sobre from './Sobre';
import Contato from './Contato';
import Servicos from './Servicos';
import Topo from './Topo';
import Rodape from './Rodape';

const App = () => {
    return (
        <Router>
            <Topo />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/sobre" component={Sobre} />
                <Route path="/contato" component={Contato} />
                <Route path="/servicos" component={Servicos} />
            </Switch>
            <Rodape />
        </Router>
    );
};

export default App;