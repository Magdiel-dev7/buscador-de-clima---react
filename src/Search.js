import { useState, useEffect } from 'react';
import './Search.css';

function Search(props) {
  const [inputCidade, setInputCidade] = useState("");
  const [cidadeDados, setCidadeDados] = useState(null);
  const [erroMensagem, setErroMensagem] = useState("");

  function searchInput(e) {
    e.preventDefault();
    if (!inputCidade) return;

    setErroMensagem("");
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(inputCidade)}&appid=4d8fb5b93d4af21d66a2948710284366&units=metric&lang=pt_br`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          if (response.status === 404) throw new Error("Cidade não encontrada.");
          throw new Error("Erro ao buscar dados do clima.");
        }
        return response.json();
      })
      .then(data => setCidadeDados(data))
      .catch(err => {
        setErroMensagem(err.message);
        setCidadeDados(null);
      });
  }

  // 1. O useEffect agora guarda a lógica e aplica o fundo sem dependências ocultas
  useEffect(() => {
    const obterFundoDinamico = () => {
      if (!cidadeDados || !cidadeDados.weather) {
        return 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)'; 
      }

      const infoClima = cidadeDados.weather[0];
      const IDClima = infoClima.id; 
      const icone = infoClima.icon; 
      const temp = cidadeDados.main.temp;

      if (icone.endsWith('n')) {
        return 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'; 
      }
      if (IDClima >= 200 && IDClima < 600) {
        return 'linear-gradient(135deg, #64748b 0%, #475569 100%)'; 
      }
      if (temp > 30) {
        return 'linear-gradient(135deg, #f97316 0%, #facc15 100%)'; 
      }
      if (temp < 12 || (IDClima >= 600 && IDClima < 700)) {
        return 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)'; 
      }
      return 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)'; 
    };

    const fundo = obterFundoDinamico();
    document.body.style.background = fundo;
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.transition = "background 0.5s ease";

    return () => {
      document.body.style.background = "";
    };
  }, [cidadeDados]); // <--- Agora o React sabe que a única dependência real é o cidadeDados

  const ehFundoEscuro = () => {
    if (!cidadeDados) return false;
    const icone = cidadeDados.weather[0].icon;
    const IDClima = cidadeDados.weather[0].id;
    return icone.endsWith('n') || (IDClima >= 200 && IDClima < 600);
  };

  return (
    <div className={`searchWraper ${ehFundoEscuro() ? 'fundo-escuro' : ''}`}>
      <div className="search">
        <h2>Descubra o Clima 🌤️</h2>
        <form onSubmit={searchInput}>
          <input 
            placeholder={props.placeholder} 
            type="text" 
            value={inputCidade}
            onChange={(e) => setInputCidade(e.target.value)} 
          />
          <input type="submit" value="Buscar" />
        </form>
      </div>

      {erroMensagem && (
        <div className="error-box">❌ {erroMensagem}</div>
      )}

      {cidadeDados && cidadeDados.weather && cidadeDados.main ? (
        <div className="weather-result">
          <h3>{cidadeDados.name}, {cidadeDados.sys?.country}</h3>
          
          <div className="weather-info">
            <span className="weather-temp">
              {Math.round(cidadeDados.main.temp)}°C
            </span>
            <img 
              className="weather-icon"
              src={`https://openweathermap.org/img/wn/${cidadeDados.weather[0].icon}@2x.png`} 
              alt="Clima" 
            />
          </div>

          <p className="weather-desc">
            {cidadeDados.weather[0]?.description}
          </p>

          <div className="weather-details">
            <div className="detail-item">
              <span>🌡️ Sensação</span>
              <strong>{Math.round(cidadeDados.main.feels_like)}°C</strong>
            </div>
            
            <div className="detail-item">
              <span>💧 Umidade</span>
              <strong>{cidadeDados.main.humidity}%</strong>
            </div>

            <div className="detail-item">
              <span>🍃 Vento</span>
              <strong>{Math.round((cidadeDados.wind?.speed || 0) * 3.6)} km/h</strong>
            </div>

            <div className="detail-item">
              <span>📉 Pressão</span>
              <strong>{cidadeDados.main.pressure} hPa</strong>
            </div>
          </div>
        </div>
      ) : (
        !erroMensagem && (
          <div className="placeholder-text">
            <p>Digite uma cidade acima para ver os detalhes em tempo real.</p>
          </div>
        )
      )}
      
      <footer className="app-footer">
        &copy; {new Date().getFullYear()} <strong>Magdiel Barbosa</strong> <span className="footer-icon">🚀</span> Desenvolvedor Jr.
      </footer>
    </div>
  );
}

export default Search;