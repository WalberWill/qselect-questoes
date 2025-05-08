import { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDK-H0oqDfJbLq6bE97IXLMTLW40kz0jVM",
  authDomain: "qselect-e87fb.firebaseapp.com",
  projectId: "qselect-e87fb",
  storageBucket: "qselect-e87fb.firebasestorage.app",
  messagingSenderId: "213308533345",
  appId: "1:213308533345:web:57dd98e5407a22c53c5820"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default function App() {
  const [questoes, setQuestoes] = useState([])
  const [respostas, setRespostas] = useState({})
  const [confirmadas, setConfirmadas] = useState({})

  useEffect(() => {
    async function fetchData() {
      const snap = await getDocs(collection(db, 'questoes'))
      const lista = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setQuestoes(lista)
    }
    fetchData()
  }, [])

  const handleSelect = (id, i) => {
    setRespostas(prev => ({ ...prev, [id]: i }))
  }

  const handleConfirmar = (id) => {
    setConfirmadas(prev => ({ ...prev, [id]: true }))
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>🧠 QSelect - Questões</h1>
      {questoes.map(q => (
        <div key={q.id} style={{
          marginBottom: 30,
          padding: 20,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <strong style={{ display: 'block', fontSize: '1.2rem', marginBottom: 10 }}>{q.enunciado}</strong>
          <div style={{ marginBottom: 10 }}>
            {q.alternativas.map((alt, i) => (
              <label key={i} style={{ display: 'block', marginBottom: 5 }}>
                <input
                  type="radio"
                  name={`q_${q.id}`}
                  disabled={confirmadas[q.id]}
                  checked={respostas[q.id] === i}
                  onChange={() => handleSelect(q.id, i)}
                  style={{ marginRight: 8 }}
                />
                {alt}
              </label>
            ))}
          </div>
          {!confirmadas[q.id] && (
            <button
              onClick={() => handleConfirmar(q.id)}
              style={{
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 8,
                cursor: 'pointer'
              }}>
              Confirmar
            </button>
          )}
          {confirmadas[q.id] && (
            <div style={{ marginTop: 10 }}>
              {respostas[q.id] === q.gabarito.charCodeAt(0) - 97
                ? <p style={{ color: 'green', fontWeight: 'bold' }}>✔️ Resposta correta!</p>
                : <p style={{ color: 'red', fontWeight: 'bold' }}>❌ Errado! Gabarito: {q.gabarito.toUpperCase()}</p>}
              <details>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>💬 Comentário do professor</summary>
                <p>{q.comentario}</p>
              </details>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
