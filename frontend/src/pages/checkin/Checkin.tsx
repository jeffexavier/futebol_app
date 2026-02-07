import { useState} from 'react';
import type { SyntheticEvent } from 'react';
import { createCheckin } from '../../services/checkinService';
import './Checkin.css';

export default function Checkin() {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: String, type: 'success' | 'error' } | null>(null);

    async function handleSubmit() {
      if(!name.trim()) return;

      setLoading(true);
      setMessage(null);

      try {
        await createCheckin(name);

        setMessage({ text: `☑️ ${name} entrou na fila!`, type: 'success'});
        setName('');

        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        console.error(error);
        setMessage({ text: '❌ Erro ao fazer colocar nome na lista.', type: 'error'});
      } finally {
        setLoading(false)
      }
    };

    return (
        <>
        <div className="mobile-container">
            <h1 className="title">Pelada de Quarta ⚽</h1>
            <div className="input-group">
                <input
                    type="text"
                    className="big-input"
                    placeholder="Nome do Jogador"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <button
                type="button"
                className="big-button"
                onClick={handleSubmit}>
                    COLOCAR NOME NA LISTA
            </button>
        </div>
        </>
    )
}