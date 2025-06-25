import React, { useState, useEffect } from 'react';
import ReviewModal from './reviewModal';
import InfoFilme from './infoFilme';

export default function Filme({ el }) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [existingReview, setExistingReview] = useState(null);

    const displayTitle = el?.title && el.title.length > 19
        ? `${el.title.substring(0, 19)}...`
        : el?.title || 'Título Desconhecido';

    const imageUrl = el?.poster_path
        ? `https://image.tmdb.org/t/p/w500${el.poster_path}`
        : 'https://via.placeholder.com/500x750?text=Sem+Imagem';

    useEffect(() => {
        const favoritos = JSON.parse(localStorage.getItem('filmesFavoritos')) || [];
        const favoritedStatus = favoritos.some(filme => filme.id === el.id);
        setIsFavorited(favoritedStatus);

        const allReviews = JSON.parse(localStorage.getItem('filmesReviews')) || {};
        if (allReviews[el.id] && allReviews[el.id].length > 0) {
            setExistingReview(allReviews[el.id][allReviews[el.id].length - 1]);
        } else {
            setExistingReview(null);
        }
    }, [el.id]);

    const handleFavoriteClick = () => {
        let favoritos = JSON.parse(localStorage.getItem('filmesFavoritos')) || [];
        const isCurrentlyFavorited = favoritos.some(filme => filme.id === el.id);

        if (!isCurrentlyFavorited) {
            const novoFavorito = {
                id: el.id,
                title: el.title,
                poster_path: el.poster_path
            };
            favoritos.push(novoFavorito);
            alert(`${el.title} foi adicionado aos seus favoritos!`);
            setIsFavorited(true);
        } else {
            favoritos = favoritos.filter(filme => filme.id !== el.id);
            alert(`${el.title} foi removido dos seus favoritos!`);
            setIsFavorited(false);
        }
        localStorage.setItem('filmesFavoritos', JSON.stringify(favoritos));
    };

    const handleOpenReviewModal = () => {
        setShowReviewModal(true);
    };

    const handleCloseReviewModal = () => {
        setShowReviewModal(false);
        const allReviews = JSON.parse(localStorage.getItem('filmesReviews')) || {};
        if (allReviews[el.id] && allReviews[el.id].length > 0) {
            setExistingReview(allReviews[el.id][allReviews[el.id].length - 1]);
        } else {
            setExistingReview(null);
        }
    };

    const handleSubmitReview = (reviewData) => {
        let allReviews = JSON.parse(localStorage.getItem('filmesReviews')) || {};

        if (!allReviews[el.id]) {
            allReviews[el.id] = [];
        }

        if (existingReview && existingReview.timestamp) {
            allReviews[el.id] = allReviews[el.id].map(review =>
                review.timestamp === existingReview.timestamp
                    ? { ...reviewData, movieId: el.id, movieTitle: el.title }
                    : review
            );
        } else {
            allReviews[el.id].push({
                movieId: el.id,
                movieTitle: el.title,
                rating: reviewData.rating,
                reviewText: reviewData.reviewText,
                timestamp: reviewData.timestamp
            });
        }

        localStorage.setItem('filmesReviews', JSON.stringify(allReviews));
        alert(`Review para "${el.title}" salva com sucesso!`);
        console.log(`Review para ${el.title}:`, reviewData);
    };

    const handleOpenInfoModal = () => {
        setShowInfoModal(true);
    };

    const handleCloseInfoModal = () => {
        setShowInfoModal(false);
    };

    return (
        <li key={el.id}>
            {displayTitle}
            <img
                src={imageUrl}
                alt={el?.title || 'Filme'}
                onClick={handleOpenInfoModal} // Abre o modal de informações ao clicar no poster
                style={{ cursor: 'pointer' }} // Indica que é clicável
            />
            <div className="movie-actions">
                <button
                    className={`botao-coracao ${isFavorited ? 'preenchido' : 'contorno'}`}
                    onClick={handleFavoriteClick}
                >
                    {isFavorited ? '❤️' : '♡'}
                </button>
                <button
                    className="botao-review"
                    onClick={handleOpenReviewModal}
                >
                    Avaliar
                </button>
            </div>

            <ReviewModal
                show={showReviewModal}
                onClose={handleCloseReviewModal}
                onSubmit={handleSubmitReview}
                movieTitle={el?.title || 'Filme Desconhecido'}
                movieId={el?.id}
                initialRating={existingReview ? existingReview.rating : 0}
                initialReviewText={existingReview ? existingReview.reviewText : ''}
            />

            <InfoFilme
                show={showInfoModal}
                onClose={handleCloseInfoModal}
                movieId={el?.id} // Passa o ID do filme para o modal buscar os detalhes
            />
        </li>
    );
}