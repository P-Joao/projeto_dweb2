// components/ReviewModal.js
import React, { useState, useEffect } from 'react';
import './reviewModal.css';

export default function ReviewModal({ show, onClose, onSubmit, movieTitle, movieId, initialRating = 0, initialReviewText = '' }) {
    const [rating, setRating] = useState(initialRating);
    const [reviewText, setReviewText] = useState(initialReviewText);

    useEffect(() => {
        if (show) {
            setRating(initialRating);
            setReviewText(initialReviewText);
        }
    }, [show, initialRating, initialReviewText]);

    const handleStarClick = (starIndex) => {
        setRating(starIndex);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Por favor, selecione uma avaliação em estrelas.');
            return;
        }
        onSubmit({
            movieId: movieId,       // Passa o ID do filme (número)
            movieTitle: movieTitle, // Passa o TÍTULO do filme (string)
            rating: rating,
            reviewText: reviewText,
            timestamp: new Date().toISOString()
        });
        // onClose é chamado pela função que recebe o onSubmit no MinhasReviews.js
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>Adicionar/Editar Review para: {movieTitle}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= rating ? 'selected' : ''}`}
                                onClick={() => handleStarClick(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <textarea
                        placeholder="Escreva sua review aqui..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows="5"
                    ></textarea>
                    <div className="modal-actions">
                        <button type="submit" className="modal-button submit">Salvar Review</button>
                        <button type="button" className="modal-button cancel" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}