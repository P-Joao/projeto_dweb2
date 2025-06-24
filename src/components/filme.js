// components/Filme.js
import React, { useState, useEffect } from 'react';
import ReviewModal from './reviewModal';

export default function Filme({ el }) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    // Novo estado para armazenar a review existente para pré-preenchimento
    const [existingReview, setExistingReview] = useState(null);

    const displayTitle = el?.title && el.title.length > 19
        ? `${el.title.substring(0, 19)}...`
        : el?.title || 'Título Desconhecido';

    const imageUrl = el?.poster_path
        ? `https://image.tmdb.org/t/p/w500${el.poster_path}`
        : 'https://via.placeholder.com/500x750?text=Sem+Imagem';

    // useEffect para verificar o localStorage quando o componente é montado ou 'el.id' muda
    useEffect(() => {
        const favoritos = JSON.parse(localStorage.getItem('filmesFavoritos')) || [];
        const favoritedStatus = favoritos.some(filme => filme.id === el.id);
        setIsFavorited(favoritedStatus);

        // **Nova lógica: Carrega a review existente para este filme**
        const allReviews = JSON.parse(localStorage.getItem('filmesReviews')) || {};
        if (allReviews[el.id] && allReviews[el.id].length > 0) {
            // Se houver reviews para este filme, pegue a última (ou a primeira, ou a que quiser)
            // Aqui pegamos a última, assumindo que é a mais recente/relevante para edição.
            setExistingReview(allReviews[el.id][allReviews[el.id].length - 1]);
        } else {
            setExistingReview(null); // Nenhuma review existente
        }
    }, [el.id]); // Re-executa se o ID do filme mudar

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

    // Função para abrir o modal de review
    const handleOpenReviewModal = () => {
        setShowReviewModal(true);
    };

    // Função para fechar o modal de review
    const handleCloseReviewModal = () => {
        setShowReviewModal(false);
        // Após fechar o modal (e possivelmente salvar), re-verifica o localStorage
        // para garantir que 'existingReview' esteja atualizado.
        const allReviews = JSON.parse(localStorage.getItem('filmesReviews')) || {};
        if (allReviews[el.id] && allReviews[el.id].length > 0) {
            setExistingReview(allReviews[el.id][allReviews[el.id].length - 1]);
        } else {
            setExistingReview(null);
        }
    };

    // Função para submeter a review (salvar no localStorage)
    const handleSubmitReview = (reviewData) => {
        let allReviews = JSON.parse(localStorage.getItem('filmesReviews')) || {};

        if (!allReviews[el.id]) {
            allReviews[el.id] = [];
        }

        // Se existe uma review que estamos editando (identificada pelo timestamp), atualize-a
        if (existingReview && existingReview.timestamp) {
            allReviews[el.id] = allReviews[el.id].map(review =>
                review.timestamp === existingReview.timestamp
                    ? { ...reviewData, movieId: el.id, movieTitle: el.title } // Atualiza os dados da review
                    : review
            );
        } else {
            // Caso contrário, adicione uma nova review
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
        // Não chame handleCloseReviewModal aqui. O modal é fechado pelo onClose no ReviewModal.
        // A função onClose do modal já chamará o handleCloseReviewModal, que atualizará existingReview.
    };

    return (
        <li key={el.id}>
            {displayTitle}
            <img src={imageUrl} alt={el?.title || 'Filme'} />
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
                onClose={handleCloseReviewModal} // Esta função já contém a lógica de re-verificar
                onSubmit={handleSubmitReview}
                movieTitle={el?.title || 'Filme Desconhecido'}
                movieId={el?.id}
                // ** Passa a review existente para pré-preencher o modal **
                initialRating={existingReview ? existingReview.rating : 0}
                initialReviewText={existingReview ? existingReview.reviewText : ''}
            />
        </li>
    );
}