import Tabela from './components/tabela';
import './App.css';
import React, { Component } from 'react';

class App extends Component {
  state = {
    filmes: []
  };
  componentDidMount() {
    fetch("../api/filmes.json")
      .then(response => response.json())
      .then(filmes => this.setState({ filmes }))
      .catch(function (error) {
        console.log("Erro na requisição")
      })
  }
  handlerExcluirLinha = imdb_id => {
    const filmes = this.state.filmes.filter(filme => filme.imdb_id !== imdb_id);
    this.setState({ filmes });
  };
  handlerOrdernarCrescente = titulo => {
    const filmes = this.state.filmes.sort((a, b) =>
      a.titulo < b.titulo ? -1 : 0
    );
    this.setState({ filmes });
  }
  handlerOrdernarDecrescente = titulo => {
    const filmes = this.state.filmes.sort((a, b) =>
      a.titulo < b.titulo ? -1 : 0
    );
    filmes.reverse();
    this.setState({ filmes });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <Tabela
          filmes={this.state.filmes}
          excluirLinha={this.handlerExcluirLinha}
          ordernarCrescente={this.handlerOrdernarCrescente}
          ordernarDecrescente={this.handlerOrdernarDecrescente}
        />
      </div>
    )
  }
}

export default App;
