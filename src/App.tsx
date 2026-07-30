import { useState, useEffect, useRef } from 'react'
import type { FormEvent } from 'react'
import { Calendar, Clock, MapPin, Menu, X } from 'lucide-react'
import './App.css'
import landingBg from './assets/landing.jpeg'
import landingCel from './assets/landing-cel.jpeg'

function App() {
  const [nome, setNome] = useState('')
  const [vaiAoEvento, setVaiAoEvento] = useState('sim')
  const [qtdAdultos, setQtdAdultos] = useState('1')
  const [qtdCriancas, setQtdCriancas] = useState('0')
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 })
  const [navScrolled, setNavScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [countdownVisible, setCountdownVisible] = useState(false)
  const countdownRef = useRef<HTMLElement>(null)

  const telefoneWhatsApp = "5512988358662"

  useEffect(() => {
    const targetDate = new Date('2026-09-05T13:00:00').getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
          horas: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutos: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          segundos: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = countdownRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCountdownVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 700) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleRSVP = (e: FormEvent) => {
    e.preventDefault()

    let texto = `Olá! Meu nome é *${nome}*.%0A`
    if (vaiAoEvento === 'sim') {
      texto += `Confirmo minha presença no casamento civil! 🥂%0A%0A`
      texto += `*Adultos:* ${qtdAdultos}%0A`
      texto += `*Crianças:* ${qtdCriancas}`
    } else {
      texto += `Infelizmente não poderei comparecer, mas desejo muitas felicidades! ❤️`
    }

    const url = `https://wa.me/${telefoneWhatsApp}?text=${texto}`
    window.open(url, '_blank')
  }

  const closeMenu = () => setMenuOpen(false)

  const navItems = (
    <>
      <a href="#home" onClick={closeMenu}>Home</a>
      <a href="#contagem" onClick={closeMenu}>O Casal</a>
      <a href="#rsvp" onClick={closeMenu}>Confirme sua presença</a>
    </>
  )

  return (
    <>
      <nav className={`navbar${navScrolled ? ' scrolled' : ''}${menuOpen ? ' open' : ''}`}>
        <div className="nav-links nav-links-desktop">
          {navItems}
        </div>
        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Fora da navbar: backdrop-filter no scroll não prende o overlay */}
      <div
        className={`nav-drawer${menuOpen ? ' open' : ''}`}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      >
        <a href="#home" onClick={(e) => { e.stopPropagation(); closeMenu() }}>Home</a>
        <a href="#contagem" onClick={(e) => { e.stopPropagation(); closeMenu() }}>O Casal</a>
        <a href="#rsvp" onClick={(e) => { e.stopPropagation(); closeMenu() }}>Confirme sua presença</a>
      </div>

      <section id="home" className="hero">
        <picture className="hero-picture">
          <source media="(max-width: 700px)" srcSet={landingCel} />
          <img
            className="hero-media"
            src={landingBg}
            alt="Fábia Alves e Bruno Bertoni"
            fetchPriority="high"
          />
        </picture>
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-content">
          <p className="hero-eyebrow animate-up">Casamento Civil</p>
          <h1 className="hero-title animate-up delay-1">Fábia Alves &amp; Bruno Bertoni</h1>
          <p className="hero-date animate-up delay-2">05 de setembro de 2026</p>
          <a href="#rsvp" className="hero-cta animate-up delay-3">Confirmar presença</a>
        </div>
      </section>

      <section
        id="contagem"
        ref={countdownRef}
        className={`countdown-section${countdownVisible ? ' visible' : ''}`}
      >
        <h2 className="section-title">Contagem regressiva</h2>
        <div className="countdown-container">
          <div className="countdown-box">
            <span className="countdown-number">{timeLeft.dias}</span>
            <span className="countdown-label">Dias</span>
          </div>
          <div className="countdown-box">
            <span className="countdown-number">{timeLeft.horas}</span>
            <span className="countdown-label">Horas</span>
          </div>
          <div className="countdown-box">
            <span className="countdown-number">{timeLeft.minutos}</span>
            <span className="countdown-label">Minutos</span>
          </div>
          <div className="countdown-box">
            <span className="countdown-number">{timeLeft.segundos}</span>
            <span className="countdown-label">Segundos</span>
          </div>
        </div>
      </section>

      <section id="detalhes" className="intro-section">
        <p className="intro-text">
          É oficial: vamos nos casar! Antes de subirmos ao altar no ano que vem, daremos o nosso
          primeiro &ldquo;sim&rdquo; perante a lei. Para marcar o início desse novo capítulo, queremos reunir as
          pessoas mais especiais da nossa vida para comemorar do jeito que mais amamos:
          com um bom churrasco, carinho e muita alegria.
        </p>

        <p className="intro-note">
          Água, refrigerante e comida ficam por nossa conta.
          Se quiser algo alcoólico, traga a sua favorita para celebrar conosco.
        </p>

        <div className="details-row">
          <div className="detail-item">
            <Calendar size={22} strokeWidth={1.5} />
            <span>05 de setembro de 2026</span>
          </div>
          <div className="detail-item">
            <Clock size={22} strokeWidth={1.5} />
            <span>13:00 horas</span>
          </div>
          <div className="detail-item">
            <MapPin size={22} strokeWidth={1.5} />
            <span>Caminho das Araras, 2000</span>
          </div>
        </div>
      </section>

      <section id="rsvp" className="rsvp-section">
        <h2 className="section-title">Confirme sua presença</h2>

        <div className="rsvp-card">
          <form onSubmit={handleRSVP}>
            <div className="form-group row">
              <label htmlFor="nome">Nome completo</label>
              <div className="input-container">
                <input
                  id="nome"
                  type="text"
                  className="form-control"
                  placeholder="Insira seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group row">
              <label>Você irá ao evento?</label>
              <div className="input-container radio-group">
                <label>
                  <input
                    type="radio"
                    name="presenca"
                    value="sim"
                    checked={vaiAoEvento === 'sim'}
                    onChange={(e) => setVaiAoEvento(e.target.value)}
                  /> Sim
                </label>
                <label>
                  <input
                    type="radio"
                    name="presenca"
                    value="nao"
                    checked={vaiAoEvento === 'nao'}
                    onChange={(e) => setVaiAoEvento(e.target.value)}
                  /> Não
                </label>
              </div>
            </div>

            {vaiAoEvento === 'sim' && (
              <>
                <div className="form-group row">
                  <label htmlFor="adultos">
                    Quantidade de adultos
                    <small>(incluindo você)</small>
                  </label>
                  <div className="input-container">
                    <select
                      id="adultos"
                      className="form-control"
                      value={qtdAdultos}
                      onChange={(e) => setQtdAdultos(e.target.value)}
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="criancas">Quantidade de crianças</label>
                  <div className="input-container">
                    <select
                      id="criancas"
                      className="form-control"
                      value={qtdCriancas}
                      onChange={(e) => setQtdCriancas(e.target.value)}
                    >
                      {[0, 1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="submit-btn">
              Confirmar presença
            </button>
          </form>
        </div>
      </section>
    </>
  )
}

export default App
