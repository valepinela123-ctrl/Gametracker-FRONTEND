// GAMETRACKER/FRONTEND/src/GameList.jsx
import { useState, useEffect } from 'react'; // Necesitamos esto igual que en App.jsx
import './GameList.css'; // Crearemos este archivo CSS para estilos específicos de los juegos

function GameList() {
    const [games, setGames] = useState([]); // Para guardar la lista de juegos
    const [loading, setLoading] = useState(true); // Para saber si estamos cargando
    const [error, setError] = useState(null); // Para guardar si hubo un error

    const API_BASE_URL = 'http://localhost:5000/api'; // La dirección de tu backend

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/games`); // Pedimos los juegos al backend
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Error HTTP: ${response.status}`);
                }
                const data = await response.json();
                setGames(data); // Guardamos los juegos
            } catch (err) {
                console.error("Error al obtener los juegos:", err);
                setError(err.message);
            } finally {
                setLoading(false); // Terminamos de cargar
            }
        };

        fetchGames(); // Ejecutamos la función para buscar los juegos
    }, []); // [] significa que esto se ejecuta solo una vez al cargar el componente

    if (loading) {
        return <div className="game-list-container">Cargando juegos...</div>;
    }

    if (error) {
        return <div className="game-list-container" style={{ color: 'red' }}>Error: {error}</div>;
    }

    return (
        <div className="game-list-container">
            <h2>Todos los Juegos</h2>
            {games.length === 0 ? (
                <p>No hay juegos registrados en la base de datos.</p>
            ) : (
                <ul className="games-grid"> {/* Usaremos CSS Grid para mostrar los juegos */}
                    {games.map(game => (
                        <li key={game._id} className="game-card">
                            <h3>{game.title}</h3>
                            <p>Plataforma: {game.platform || 'Desconocida'}</p>
                            {/* Si tienes una URL de imagen, la muestras */}
                            {game.cover_image_url && (
                                <img src={game.cover_image_url} alt={game.title} className="game-cover" />
                            )}
                            <p className="game-description">{game.description || 'Sin descripción.'}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default GameList; // Hacemos que este componente pueda ser usado en otros archivos