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
  const [index, setIndex] = useState(0)
  const [resposta, setResposta] = useState(null)
  const [confirmado, setConfirmado] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const snap = await getDocs(collection(db, 'questoes'))
      const lista = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setQuestoes(lista)
    }
    fetchData()
  }, [])

  if (questoes.length === 0) return <p style={{ padding: 20 }}>Carregando questões...</p>

  const q = questoes[index]
  const corretaIndex = q.gabarito.charCodeAt(0) - 97
  const letras = ['A', 'B', 'C', 'D', 'E']

  const handleConfirmar = () => setConfirmado(true)
  const handleProxima = () => {
    setIndex(index + 1)
    setResposta(null)
    setConfirmado(false)
  }

  const cor = (i) => {
    if (!confirmado) return '#000'
    if (i === corretaIndex) return 'green'
    if (i === resposta && i !== corretaIndex) return 'red'
    return '#000'
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center' }}>🧠 QSelect - Questões</h1>
      <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <strong style={{ display: 'block', fontSize: '1.2rem', marginBottom: 10 }}>{q.enunciado}</strong>
        {q.alternativas.map((alt, i) => (
          <label key={i} style={{ display: 'block', marginBottom: 8, color: cor(i), fontWeight: confirmado && i === corretaIndex ? 'bold' : 'normal' }}>
            <input
              type="radio"
              name={`q_${q.id}`}
              disabled={confirmado}
              checked={resposta === i}
              onChange={() => setResposta(i)}
              style={{ marginRight: 8 }}
            />
            <strong>{letras[i]})</strong> {alt}
          </label>
        ))}
        {!confirmado && (
          <button
            onClick={handleConfirmar}
            disabled={resposta === null}
            style={{ marginTop: 10, backgroundColor: '#007bff', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: 8 }}
          >Confirmar</button>
        )}
        {confirmado && (
          <>
            <p style={{ marginTop: 10, fontWeight: 'bold', color: resposta === corretaIndex ? 'green' : 'red' }}>
              {resposta === corretaIndex ? '✔️ Resposta correta!' : `❌ Resposta errada. Gabarito: ${q.gabarito.toUpperCase()}`}
            </p>
            <details style={{ marginBottom: 10 }}>
              <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>💬 Comentário do professor</summary>
              <p>{q.comentario}</p>
            </details>
            {index < questoes.length - 1 ? (
              <div style={{ textAlign: 'right' }}>
                <button
                  onClick={handleProxima}
                  style={{ backgroundColor: '#28a745', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: 8 }}
                >Próxima questão →</button>
              </div>
            ) : (
              <p style={{ fontWeight: 'bold' }}>Você chegou ao fim das questões!</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
