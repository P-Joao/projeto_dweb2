// components/MinhasReviews.js
import React, { useState, useEffect } from 'react';
import ReviewModal from './reviewModal';
import './minhasReviews.css';

export default function MinhasReviews() {
    const [allReviews, setAllReviews] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    // currentReviewData vai armazenar a review sendo editada, incluindo o ID do filme
    const [currentReviewData, setCurrentReviewData] = useState(null);

    useEffect(() => {
        const storedReviews = JSON.parse(localStorage.getItem('filmesReviews')) || {};
        setAllReviews(storedReviews);

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleStorageChange = () => {
        const storedReviews = JSON.parse(localStorage.getItem('filmesReviews')) || {};
        setAllReviews(storedReviews);
    };

    const handleDeleteReview = (movieId, reviewTimestamp) => {
        if (window.confirm('Tem certeza que deseja excluir esta review?')) {
            const updatedReviews = { ...allReviews };
            if (updatedReviews[movieId]) {
                updatedReviews[movieId] = updatedReviews[movieId].filter(
                    review => review.timestamp !== reviewTimestamp
                );
                if (updatedReviews[movieId].length === 0) {
                    delete updatedReviews[movieId];
                }
                localStorage.setItem('filmesReviews', JSON.stringify(updatedReviews));
                setAllReviews(updatedReviews);
                alert('Review excluída com sucesso!');
            }
        }
    };

    // Função para abrir o modal de edição
    const handleEditReview = (movieId, reviewToEdit) => {
        // Passa o ID do filme, título, avaliação e texto para o modal
        setCurrentReviewData({
            movieId: movieId, // ID do filme (chave do objeto allReviews)
            movieTitle: reviewToEdit.movieTitle, // O título do filme
            initialRating: reviewToEdit.rating,
            initialReviewText: reviewToEdit.reviewText,
            timestamp: reviewToEdit.timestamp // Para identificar qual review estamos editando
        });
        setIsModalOpen(true);
    };

    // Função para salvar/atualizar a review (recebida do modal)
    const handleSubmitReview = (reviewDataFromModal) => {
        const { movieId, movieTitle, rating, reviewText, timestamp } = reviewDataFromModal;
        const updatedReviews = { ...allReviews };

        // Lógica de edição
        if (currentReviewData && currentReviewData.timestamp) { // Se estamos no modo de edição
            updatedReviews[currentReviewData.movieId] = updatedReviews[currentReviewData.movieId].map(review =>
                review.timestamp === currentReviewData.timestamp
                    ? { movieId: currentReviewData.movieId, movieTitle: currentReviewData.movieTitle, rating, reviewText, timestamp } // Atualiza a review
                    : review
            );
        } else { // Lógica para uma nova review (caso o modal seja usado para nova review)
            if (!updatedReviews[movieId]) {
                updatedReviews[movieId] = [];
            }
            updatedReviews[movieId].push({ movieId, movieTitle, rating, reviewText, timestamp });
        }

        localStorage.setItem('filmesReviews', JSON.stringify(updatedReviews));
        setAllReviews(updatedReviews);
        alert('Review salva com sucesso!');
        setIsModalOpen(false);
        setCurrentReviewData(null); // Limpa o estado de edição após fechar
    };

    // Converte o objeto de reviews em um array de reviews individuais para mapear na tabela
    const reviewsToDisplay = Object.keys(allReviews).flatMap(movieId =>
        allReviews[movieId].map(review => ({
            ...review,
            movieId: movieId // Garante que o ID do filme esteja disponível
        }))
    );


    return (
        <>
            <div className="card">
                <h2>Minhas Reviews</h2>
                <p className='sub-title'>Gerencie suas avaliações e comentários de filmes.</p>
            </div>

            <div className="card">
                {reviewsToDisplay.length > 0 ? (
                    <table className="reviews-table">
                        <thead>
                            <tr>
                                <th>Filme</th>
                                <th>Avaliação</th>
                                <th>Review</th>
                                <th>Data</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviewsToDisplay.map((review, index) => (
                                // Use um key único, aqui pode ser o timestamp ou o id do filme + timestamp
                                <tr key={`${review.movieId}-${review.timestamp || index}`}>
                                    <td>{review.movieTitle}</td> {/* **CORREÇÃO AQUI: Acessando review.movieTitle** */}
                                    <td className="star-rating-display">
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </td>
                                    <td>{review.reviewText || 'Nenhuma review escrita.'}</td>
                                    <td>{new Date(review.timestamp).toLocaleDateString('pt-BR')}</td>
                                    <td>
                                        <button
                                            className="action-button edit"
                                            onClick={() => handleEditReview(review.movieId, review)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="action-button delete"
                                            onClick={() => handleDeleteReview(review.movieId, review.timestamp)}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Você ainda não adicionou nenhuma review. Avalie seus filmes!</p>
                )}
            </div>

            {/* Modal de Review (reutilizado) */}
            <ReviewModal
                show={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setCurrentReviewData(null); // Limpa o estado ao fechar
                }}
                onSubmit={handleSubmitReview}
                // Passa os dados para o modal pré-preencher (se currentReviewData não for nulo)
                movieTitle={currentReviewData?.movieTitle || ''}
                movieId={currentReviewData?.movieId || ''}
                initialRating={currentReviewData?.initialRating || 0}
                initialReviewText={currentReviewData?.initialReviewText || ''}
            />
        </>
    );
}