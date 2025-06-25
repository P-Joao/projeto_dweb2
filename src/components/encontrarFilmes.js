import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filme from './filme';
import Pagination from './pagination';

const API_KEY = 'a6d8a986052cb9fc11fbd93036ddb036';

export default function EncontrarFilmes({
    onSearch,
    searchResults,
    currentPage,
    totalPages,
    onPageChange,
    persistedSearchEndpoint,
    persistedSearchParams
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [releaseYear, setReleaseYear] = useState('');
    const [sortBy, setSortBy] = useState('popularity.desc');
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list`, {
                    params: {
                        api_key: API_KEY,
                        language: 'pt-BR',
                    },
                });
                setGenres(response.data.genres);
            } catch (error) {
                console.error("Erro ao buscar gêneros:", error);
            }
        };
        fetchGenres();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        const params = {};

        // Adiciona a query se searchTerm existir
        if (searchTerm) {
            params.query = searchTerm;
        }

        // Adiciona gênero se selecionado
        if (selectedGenre) {
            params.with_genres = selectedGenre;
        }

        // Adiciona ano de lançamento se informado
        if (releaseYear) {
            params.primary_release_year = releaseYear;
        }

        // A ordenação é um parâmetro comum, sempre presente.
        params.sort_by = sortBy;

        // Determina o endpoint com base na presença de um termo de busca
        // Se houver searchTerm, usa 'search/movie'. Caso contrário, 'discover/movie'.
        const endpoint = searchTerm
            ? `https://api.themoviedb.org/3/search/movie`
            : `https://api.themoviedb.org/3/discover/movie`;

        // Chama a função onSearch (no Principal), passando o endpoint e os parâmetros
        onSearch(endpoint, params);
    };

    const handleInternalPageChange = (newPage) => {
        // Usa as props persistidas para refazer a busca na nova página.
        if (persistedSearchEndpoint && Object.keys(persistedSearchParams).length > 0) {
            // onPageChange é a função que chamamos no Principal,
            // e ela espera (endpoint, params, newPage)
            onPageChange(persistedSearchEndpoint, persistedSearchParams, newPage);
        } else {
            console.warn("Nenhum parâmetro de busca anterior encontrado para paginar. Realize uma busca primeiro.");
        }
    };

    return (
        <>
            <div className="card">
                <h2>Encontrar Filmes</h2>
                <form onSubmit={handleSearch}>
                    <div className="form-group">
                        <label htmlFor="searchTerm">Título do Filme:</label>
                        <input
                            type="text"
                            id="searchTerm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Ex: Vingadores"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="genre">Gênero:</label>
                        <select
                            id="genre"
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                        >
                            <option value="">Todos os Gêneros</option>
                            {genres.map(genre => (
                                <option key={genre.id} value={genre.id}>{genre.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="releaseYear">Ano de Lançamento:</label>
                        <input
                            type="number"
                            id="releaseYear"
                            value={releaseYear}
                            onChange={(e) => setReleaseYear(e.target.value)}
                            placeholder="Ex: 2023"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="sortBy">Ordenar por:</label>
                        <select
                            id="sortBy"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="popularity.desc">Popularidade (Decrescente)</option>
                            <option value="popularity.asc">Popularidade (Crescente)</option>
                            <option value="release_date.desc">Lançamento (Mais Novo)</option>
                            <option value="release_date.asc">Lançamento (Mais Antigo)</option>
                            <option value="vote_average.desc">Avaliação (Melhor)</option>
                            <option value="vote_average.asc">Avaliação (Pior)</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-search">Buscar Filmes</button>
                </form>
            </div>

            <div className="card filmes-resultados">
                {searchResults.length > 0 ? (
                    <>
                        <h2>Resultados da Busca</h2>
                        <ul>
                            {searchResults.map(el => (
                                <Filme key={el.id} el={el} />
                            ))}
                        </ul>
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handleInternalPageChange}
                            />
                        )}
                    </>
                ) : (
                    <p>Nenhum filme encontrado. Use os filtros acima para iniciar sua busca!</p>
                )}
            </div>
        </>
    );
}