function NotFoundPage() {
  return (
    <div className="card">
      <p className="eyebrow">Ops!</p>
      <h2>Esta página se perdeu entre as estantes...</h2>
      <p className="lede">Parece que você tentou acessar uma seção que não existe. Que tal voltar para a página inicial?</p>
      <a className="primary" href="/dashboard">
        Voltar à página inicial
      </a>
    </div>
  )
}

export default NotFoundPage
