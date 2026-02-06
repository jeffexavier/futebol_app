
import './Checkin.css';

export function Checkin() {
    return (
        <>
        <div className="mobile-container">
            <h1 className="title">Pelada de Quarta ⚽</h1>
            <form>
                <div className="input-group">
                    <input
                        type="text"
                        className="big-input"
                        placeholder="Nome do Jogador"
                        value=""
                    />
                </div>
                <button type="submit" className="big-button">
                    ENTRAR NA FILA
                </button>
            </form>
        </div>
        </>
    )
}