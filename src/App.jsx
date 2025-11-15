import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newGame, setNewGame] = useState({
        title: '',
        developer: '',
        releaseYear: '',
        genre: '',
        platform: 'Multiplatform'
    });
    // Nuevo estado para controlar la visibilidad del formulario de añadir
    const [showAddForm, setShowAddForm] = useState(false);

    // Función para obtener todos los juegos de la API
    const fetchGames = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/games`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setGames(data);
        } catch (err) {
            console.error("Error fetching games:", err);
            setError(`Failed to load games: ${err.message}. Ensure backend is running.`);
        } finally {
            setLoading(false);
        }
    };

    // useEffect para cargar los juegos al montar el componente
    useEffect(() => {
        fetchGames();
    }, []);

    // Maneja los cambios en los inputs del formulario de nuevo juego
    const handleNewGameChange = (e) => {
        const { name, value } = e.target;
        setNewGame(prevGame => ({ ...prevGame, [name]: value }));
    };

    // Maneja el envío del formulario para añadir un nuevo juego
    const handleAddGame = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            const response = await fetch(`${API_BASE_URL}/games`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGame),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const addedGame = await response.json();
            setGames(prevGames => [...prevGames, addedGame]); // Añade el nuevo juego a la lista
            setNewGame({ // Resetea el formulario
                title: '',
                developer: '',
                releaseYear: '',
                genre: '',
                platform: 'Multiplatform'
            });
            setShowAddForm(false); // Oculta el formulario después de añadir
        } catch (err) {
            console.error("Error adding new game:", err);
            setError(`Error adding game: ${err.message}`);
        }
    };

    // Muestra un mensaje de carga mientras se obtienen los juegos
    if (loading) {
        return <div className="app-container">Loading games...</div>;
    }

    // Renderiza la aplicación principal
    return (
        <div className="app-container">
            <h1>GameTracker</h1>
            <p>Your personal video game collection.</p>

            {/* Sección del botón para mostrar/ocultar el formulario */}
            <section className="add-game-toggle-section">
                <button
                    className="toggle-add-form-btn"
                    onClick={() => setShowAddForm(!showAddForm)} // Alterna el estado de visibilidad
                >
                    {showAddForm ? 'Hide Form' : 'Add New Game'}
                </button>
            </section>

            {/* Renderizado condicional del formulario de añadir juego */}
            {showAddForm && (
                <section className="add-game-section">
                    <h2>Add New Game</h2>
                    {error && <p className="error-message">{error}</p>}
                    <form onSubmit={handleAddGame} className="game-form">
                        <div className="form-group">
                            <label htmlFor="title">Title:</label>
                            <input type="text" id="title" name="title" value={newGame.title} onChange={handleNewGameChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="developer">Developer:</label>
                            <input type="text" id="developer" name="developer" value={newGame.developer} onChange={handleNewGameChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="releaseYear">Release Year:</label>
                            <input type="number" id="releaseYear" name="releaseYear" value={newGame.releaseYear} onChange={handleNewGameChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="genre">Genre:</label>
                            <input type="text" id="genre" name="genre" value={newGame.genre} onChange={handleNewGameChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="platform">Platform:</label>
                            <select id="platform" name="platform" value={newGame.platform} onChange={handleNewGameChange} required>
                                <option value="Multiplatform">Multiplatform</option>
                                <option value="PC">PC</option>
                                <option value="PlayStation">PlayStation</option>
                                <option value="Xbox">Xbox</option>
                                <option value="Nintendo Switch">Nintendo Switch</option>
                                <option value="Mobile">Mobile</option>
                            </select>
                        </div>
                        <button type="submit" className="submit-btn">Add Game</button>
                    </form>
                </section>
            )}

            {/* Sección de la lista de juegos */}
            <h2>Game List ({games.length})</h2>
            <div className="game-list">
                {games.length === 0 ? (
                    <p>No games in your collection. Start adding some!</p>
                ) : (
                    games.map((game) => (
                        <div key={game._id} className="game-card">
                            <h3>{game.title}</h3>
                            <p><strong>Developer:</strong> {game.developer}</p>
                            <p><strong>Release Year:</strong> {game.releaseYear}</p>
                            <p><strong>Genre:</strong> {game.genre}</p>
                            <p><strong>Platform:</strong> {game.platform}</p>
                            <div className="game-actions">
                                <button className="edit-btn">Edit</button>
                                <button className="delete-btn">Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default App;