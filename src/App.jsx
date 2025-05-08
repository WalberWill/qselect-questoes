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
    <div style={{ padding: 20 }}>
      <h1>QSelect - Questões</h1>
      {questoes.map(q => (
        <div key={q.id} style={{ marginBottom: 30, padding: 10, border: '1px solid #ccc' }}>
          <strong>{q.enunciado}</strong>
          <div>
            {q.alternativas.map((alt, i) => (
              <div key={i}>
                <label>
                  <input
                    type="radio"
                    name={`q_${q.id}`}
                    disabled={confirmadas[q.id]}
                    checked={respostas[q.id] === i}
                    onChange={() => handleSelect(q.id, i)}
                  />
                  {alt}
                </label>
              </div>
            ))}
          </div>
          {!confirmadas[q.id] && (
            <button onClick={() => handleConfirmar(q.id)}>Confirmar</button>
          )}
          {confirmadas[q.id] && (
            <div>
              {respostas[q.id] === q.gabarito.charCodeAt(0) - 97
                ? <p style={{ color: 'green' }}>✔️ Resposta correta!</p>
                : <p style={{ color: 'red' }}>❌ Errado! Gabarito: {q.gabarito.toUpperCase()}</p>}
              <details>
                <summary>Comentário do professor</summary>
                <p>{q.comentario}</p>
              </details>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
