import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './infoFilme.css';


const API_KEY = 'a6d8a986052cb9fc11fbd93036ddb036';

export default function InfoFilme({ show, onClose, movieId }) {
    const [movieDetails, setMovieDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!show || !movieId) {
            setMovieDetails(null);
            return;
        }

        const fetchMovieDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                    params: {
                        api_key: API_KEY,
                        language: 'pt-BR',
                        append_to_response: 'genres,runtime,spoken_languages'
                    },
                });
                setMovieDetails(response.data);
            } catch (err) {
                console.error("Erro ao buscar detalhes do filme:", err);
                setError("Não foi possível carregar os detalhes do filme.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieDetails();
    }, [show, movieId]);

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content info-filme-modal" onClick={e => e.stopPropagation()}>
                {isLoading && <p>Carregando detalhes do filme...</p>}
                {error && <p className="error-message">{error}</p>}
                {!isLoading && !error && movieDetails && (
                    <div className="movie-details-container">
                        <button className="close-button" onClick={onClose}>X</button>
                        <div className="movie-details-header">
                            <img
                                src={movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : 'https://via.placeholder.com/500x750?text=Sem+Imagem'}
                                alt={movieDetails.title}
                                className="movie-poster"
                            />
                            <div className="header-text">
                                <h2>{movieDetails.title}</h2>
                                {movieDetails.original_title && movieDetails.original_title !== movieDetails.title && (
                                    <p className="original-title">({movieDetails.original_title})</p>
                                )}
                                <p>Lançamento: {movieDetails.release_date ? new Date(movieDetails.release_date).toLocaleDateString('pt-BR') : 'N/A'}</p>
                                <p>Gêneros: {movieDetails.genres && movieDetails.genres.length > 0
                                    ? movieDetails.genres.map(g => g.name).join(', ')
                                    : 'N/A'}
                                </p>
                                <p>Duração: {movieDetails.runtime ? `${movieDetails.runtime} min` : 'N/A'}</p>
                                <p>Avaliação Média: {movieDetails.vote_average ? movieDetails.vote_average.toFixed(1) : 'N/A'}/10</p>
                            </div>
                        </div>
                        <div className="movie-details-body">
                            <h3>Sinopse:</h3>
                            <p>{movieDetails.overview || 'Sinopse não disponível.'}</p>
                            {movieDetails.tagline && <p className="tagline">"{movieDetails.tagline}"</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}