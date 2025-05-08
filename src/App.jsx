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
  const [filtros, setFiltros] = useState({ banca: '', ano: '', materia: '', assunto: '' })
  const [filtradas, setFiltradas] = useState([])
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

  useEffect(() => {
    const r = questoes.filter(q =>
      (!filtros.banca || q.banca === filtros.banca) &&
      (!filtros.ano || q.ano === filtros.ano) &&
      (!filtros.materia || q.materia === filtros.materia) &&
      (!filtros.assunto || q.assunto === filtros.assunto)
    )
    setFiltradas(r)
    setIndex(0)
    setResposta(null)
    setConfirmado(false)
  }, [filtros, questoes])

  const atual = filtradas[index]
  const letras = ['A', 'B', 'C', 'D', 'E']
  const corretaIndex = atual ? atual.gabarito.charCodeAt(0) - 97 : null

  const cor = (i) => {
    if (!confirmado) return '#000'
    if (i === corretaIndex) return 'green'
    if (i === resposta && i !== corretaIndex) return 'red'
    return '#000'
  }

  const handleProxima = () => {
    setIndex(index + 1)
    setResposta(null)
    setConfirmado(false)
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center' }}>🎯 QSelect - Painel do Aluno</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        <select onChange={e => setFiltros({ ...filtros, banca: e.target.value })}>
          <option value="">Todas as Bancas</option>
          <option value="Cesgranrio">Cesgranrio</option>
          <option value="Vunesp">Vunesp</option>
          <option value="Nucepe">Nucepe</option>
          <option value="FCC">FCC</option>
          <option value="FGV">FGV</option>
          <option value="Cebraspe">Cebraspe</option>
        </select>
        <select onChange={e => setFiltros({ ...filtros, ano: e.target.value })}>
          <option value="">Todos os Anos</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
        <select onChange={e => setFiltros({ ...filtros, materia: e.target.value })}>
          <option value="">Todas as Matérias</option>
          <option value="Língua Portuguesa">Língua Portuguesa</option>
          <option value="Raciocínio Lógico">Raciocínio Lógico</option>
          <option value="Informática">Informática</option>
          <option value="Direito Administrativo">Direito Administrativo</option>
          <option value="Direito Constitucional">Direito Constitucional</option>
        </select>
        <select onChange={e => setFiltros({ ...filtros, assunto: e.target.value })}>
          <option value="">Todos os Assuntos</option>
          <option value="Interpretação de Textos">Interpretação de Textos</option>
          <option value="Crase">Crase</option>
          <option value="Pontuação">Pontuação</option>
          <option value="Proposições Lógicas">Proposições Lógicas</option>
          <option value="Word">Word</option>
        </select>
      </div>

      {!atual ? (
        <p style={{ fontWeight: 'bold' }}>Nenhuma questão com esses filtros.</p>
      ) : (
        <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <strong style={{ display: 'block', fontSize: '1.2rem', marginBottom: 10 }}>{atual.enunciado}</strong>
          {atual.alternativas.map((alt, i) => (
            <label key={i} style={{ display: 'block', marginBottom: 8, color: cor(i), fontWeight: confirmado && i === corretaIndex ? 'bold' : 'normal' }}>
              <input
                type="radio"
                name={`q_${atual.id}`}
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
              onClick={() => setConfirmado(true)}
              disabled={resposta === null}
              style={{ marginTop: 10, backgroundColor: '#007bff', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: 8 }}
            >Confirmar</button>
          )}
          {confirmado && (
            <>
              <p style={{ marginTop: 10, fontWeight: 'bold', color: resposta === corretaIndex ? 'green' : 'red' }}>
                {resposta === corretaIndex ? '✔️ Resposta correta!' : `❌ Errada. Gabarito: ${atual.gabarito.toUpperCase()}`}
              </p>
              <details>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>💬 Comentário do professor</summary>
                <p>{atual.comentario}</p>
              </details>
              {index < filtradas.length - 1 && (
                <div style={{ textAlign: 'right' }}>
                  <button
                    onClick={handleProxima}
                    style={{ backgroundColor: '#28a745', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: 8 }}
                  >Próxima questão →</button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
