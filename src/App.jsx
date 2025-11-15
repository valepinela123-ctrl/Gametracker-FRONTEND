// GAMETRACKER/FRONTEND/src/App.jsx
import { useState } from 'react'; // Necesitamos useState para cambiar lo que se muestra
import GameList from './GameList'; // Tu componente GameList
// Si quieres reusar el código de reseñas de App.jsx, podrías convertirlo en un componente ReviewList
// Por ahora, para simplificar, usaremos un componente placeholder o el contenido de reseñas de antes
// Pero para que no falle, voy a poner el código de reseñas directamente aquí y luego lo refactorizamos si quieres.

import './App.css'; // Estilos generales del App

// Componente temporal para mostrar reseñas, para que App.jsx no se haga tan grande si lo ponemos aquí
// Podrías poner esto en un archivo ReviewsForGame.jsx después
function ReviewsForGame({ gameId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'http://localhost:5173/api';

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                if (!gameId || gameId.length !== 24) {
                    throw new Error("ID de juego inválido para las reseñas.");
                }
                const response = await fetch(`${API_BASE_URL}/reviews/game/${gameId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Error HTTP: ${response.status}`);
                }
                const data = await response.json();
                setReviews(data);
            } catch (err) {
                console.error("Error al obtener las reseñas:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [gameId]); // El useEffect se ejecuta si gameId cambia

    if (loading) return <p>Cargando reseñas...</p>;
    if (error) return <p style={{ color: 'red' }}>Error al cargar reseñas: {error}</p>;

    return (
        <div>
            <h3>Reseñas para el Juego (ID: {gameId})</h3>
            {reviews.length === 0 ? (
                <p>No hay reseñas para este juego.</p>
            ) : (
                <ul>
                    {reviews.map(review => (
                        <li key={review._id}>
                            <h4>{review.game ? review.game.title : 'Juego Desconocido'} <span style={{ float: 'right', color: '#ffc107' }}>{'⭐'.repeat(review.rating)}</span></h4>
                            <p>Usuario: {review.user ? review.user.username : 'Anónimo'}</p>
                            <p>{review.text}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// El componente principal App
function App() {
    // 'view' nos dirá qué componente mostrar: 'games' o 'reviews'
    const [currentView, setCurrentView] = useState('games'); // Empieza mostrando los juegos

    const TEST_GAME_ID_FOR_REVIEWS = '65231c503525e982181283d7'; // <-- CAMBIA ESTE ID por uno REAL

    return (
        <div className="container">
            <h1>Mi Game Tracker con React</h1>

            {/* Botones de navegación simples */}
            <nav style={{ marginBottom: '20px' }}>
                <button onClick={() => setCurrentView('games')} style={{ marginRight: '10px', padding: '10px 20px', cursor: 'pointer' }}>
                    Ver Juegos
                </button>
                <button onClick={() => setCurrentView('reviews')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    Ver Reseñas de un Juego
                </button>
            </nav>

            {/* Mostramos un componente u otro según el estado 'currentView' */}
            {currentView === 'games' && <GameList />}
            {currentView === 'reviews' && (
                <ReviewsForGame gameId={TEST_GAME_ID_FOR_REVIEWS} />
            )}
        </div>
    );
}

export default App;

