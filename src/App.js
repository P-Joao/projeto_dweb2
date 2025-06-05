import Tabela from './components/tabela';
import Topo from './components/topo'
import Principal from './components/principal'
import Rodape from './components/rodape'
import './App.css';
import React, { Component } from 'react';
import axios from 'axios'
import BuscaFilmes from './components/buscaFilmes'

class App extends Component {
  state = {
    filmes: []
  };
  async componentDidMount() {
    try {
      const { data: livros } = await axios.get('url da api tmdb');
      this.setState({ filmes });
    } catch (error) {
      console.log(error);
      document.querySelectorAll('.principal')[0].insertAdjacentElement(
        "beforeend",
        "<p class='erro'>Mensagem erro</p>"
      );
    }
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
        <Topo />
        <Principal />
        <Rodape />
        {/*<Tabela
          filmes={this.state.filmes}
          excluirLinha={this.handlerExcluirLinha}
          ordernarCrescente={this.handlerOrdernarCrescente}
          ordernarDecrescente={this.handlerOrdernarDecrescente}
        />*/}
      </div>
    )
  }
}

export default App;
