import React from "react";

const Tabela = props => (
    <table>
        <caption>Filmes</caption>
        <thead>
            <tr>
                <th>
                    Título
                    <div className="container-setinhas">
                        <div onClick={ () => props.ordernarCrescente()}>&#129093;</div>
                        <div onClick={ () => props.ordernarDecrescente()}>&#129095;</div>
                    </div>
                </th>
                <th>Dt. Lançamento</th>
                <th>Gênero</th>
                <th>Descrição</th>
                <th>Avaliação</th>
            </tr>
        </thead>
        <tbody>
            {props.filmes.map((filme) => (
                <tr>
                    <td>{filme.titulo}</td>
                    <td>{filme.data}</td>
                    <td>{filme.genero}</td>
                    <td>{filme.resumo}</td>
                    <td>{filme.avaliacao}</td>
                    <td><button className="btn-excluir" onClick={() => props.excluirLinha(filme.imdb_id)} id={filme.imdb_id}>Excluir</button></td>
                </tr>
            ))}
        </tbody>
        <tfoot>
        </tfoot>
    </table>
);
export default Tabela;