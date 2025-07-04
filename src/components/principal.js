import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './home';
import MinhaLista from './minhaLista';
import EncontrarFilmes from './encontrarFilmes';
import MinhasReviews from './minhasReviews';
import Amigos from './amigos';
import NotFound from './notFound';
import axios from 'axios';

const API_KEY = 'a6d8a986052cb9fc11fbd93036ddb036';

export default function Principal() {
    const [popularFilms, setPopularFilms] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [currentPageHome, setCurrentPageHome] = useState(1);
    const [totalPagesHome, setTotalPagesHome] = useState(1);
    const [currentPageSearch, setCurrentPageSearch] = useState(1);
    const [totalPagesSearch, setTotalPagesSearch] = useState(1);

    const [persistedSearchEndpoint, setPersistedSearchEndpoint] = useState('');
    const [persistedSearchParams, setPersistedSearchParams] = useState({});

    
    const fetchPopularMovies = async (page = 1) => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
                params: {
                    api_key: API_KEY,
                    language: 'pt-BR',
                    page: page,
                }
            });
            setPopularFilms(response.data.results);
            setCurrentPageHome(response.data.page);
            setTotalPagesHome(response.data.total_pages);
        } catch (error) {
            console.error("Erro ao buscar filmes populares:", error);
            setPopularFilms([]);
            setTotalPagesHome(1);
        }
    };

    useEffect(() => {
        fetchPopularMovies(currentPageHome);
    }, [currentPageHome]);

    const executeSearch = async (endpoint, filterParams, page = 1) => {
        try {
            const requestParams = {
                api_key: API_KEY,
                language: 'pt-BR',
                ...filterParams,
                page: page,
            };

            const response = await axios.get(endpoint, { params: requestParams });

            setSearchResults(response.data.results);
            setCurrentPageSearch(response.data.page);
            setTotalPagesSearch(response.data.total_pages);

            setPersistedSearchEndpoint(endpoint);
            setPersistedSearchParams(filterParams);
        } catch (error) {
            console.error("Erro ao buscar filmes na busca:", error);
            setSearchResults([]);
            setTotalPagesSearch(1);
        }
    };

    return (
        <main className='Principal'>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            filmes={popularFilms}
                            currentPage={currentPageHome}
                            totalPages={totalPagesHome}
                            onPageChange={setCurrentPageHome}
                        />
                    }
                />

                <Route path="/minha-lista" element={<MinhaLista />} />

                <Route
                    path="/encontrar-filmes"
                    element={
                        <EncontrarFilmes
                            onSearch={(endpoint, params) => {
                                setCurrentPageSearch(1);
                                executeSearch(endpoint, params, 1);
                            }}
                            searchResults={searchResults}
                            currentPage={currentPageSearch}
                            totalPages={totalPagesSearch}
                            onPageChange={(newPage) => {
                                if (persistedSearchEndpoint && Object.keys(persistedSearchParams).length > 0) {
                                    executeSearch(persistedSearchEndpoint, persistedSearchParams, newPage);
                                } else {
                                    console.warn("Nenhuma busca anterior para paginar. Realize uma busca primeiro.");
                                }
                            }}
                            persistedSearchEndpoint={persistedSearchEndpoint}
                            persistedSearchParams={persistedSearchParams}
                        />
                    }
                />

                <Route path="/minhas-reviews" element={<MinhasReviews />} />
                <Route path="/amigos" element={<Amigos />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </main>
    );
}