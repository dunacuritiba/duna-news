import { useState, useEffect } from "react";
import { NewsCard } from "./components/NewsCard";
import { AlertCircle, FolderGit2 } from "lucide-react";
import "./App.css";
import dunaLogo from "./assets/286461205.png";

export default function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("TECHNOLOGY");

  // Mapeamento de tópicos suportados pelo Google News (em português)
  const categories = [
    { label: "Tecnologia", value: "TECHNOLOGY" },
    { label: "Negócios", value: "BUSINESS" },
    { label: "Esportes", value: "SPORTS" },
    { label: "Entretenimento", value: "ENTERTAINMENT" },
    { label: "Saúde", value: "HEALTH" },
    { label: "Ciência", value: "SCIENCE" },
  ];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        // Feed do Google News Brasil para o tópico selecionado
        const rssUrl = `https://news.google.com/rss/headlines/section/topic/${category}?hl=pt-BR&gl=BR&ceid=BR:pt-419`;

        // Conversor gratuito de RSS para JSON (sem bloqueio de CORS no GitHub Pages)
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("Não foi possível conectar ao servidor de notícias.");
        }

        const data = await response.json();

        if (data.status === "ok" && data.items) {
          const formattedNews = data.items.map((item, index) => {
            // Tenta extrair o veículo original da fonte ou usa o próprio link
            let domain = "news.google.com";
            try {
              domain = new URL(item.link).hostname;
            } catch {
              // mantém o domínio padrão
            }

            // Tenta resgatar a primeira imagem presente no conteúdo HTML da notícia
            const imgMatch = item.description
              ? item.description.match(/src="([^"]+)"/)
              : null;
            const fallbackImage = `https://picsum.photos/seed/${index + Date.now()}/600/350`;

            return {
              id: item.guid || item.link || index,
              author: item.author || "Google News",
              avatar: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
              time: new Date(item.pubDate).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              category: category.charAt(0) + category.slice(1).toLowerCase(),
              title: item.title,
              description: item.description
                ? item.description.replace(/<[^>]*>?/gm, "")
                : item.title, // Limpa tags HTML
              image: imgMatch ? imgMatch[1] : fallbackImage,
              url: item.link,
              likes: Math.floor(Math.random() * 80) + 12,
              comments: [],
              isLiked: false,
            };
          });

          setArticles(formattedNews);
        } else {
          throw new Error("Nenhuma notícia encontrada no momento.");
        }
      } catch (err) {
        setError(err.message || "Erro ao carregar notícias.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]);

  return (
    <div>
      {/* Header estilo Apple */}
      <header className="apple-header">
        <div className="header-container">
          <div className="brand">
            <img
              src={dunaLogo}
              alt="Duna News Logo"
              className="duna-logo-img"
            />
            <h1>Duna News</h1>
          </div>

          <a
            href="https://github.com/dunacuritiba/duna-news"
            target="_blank"
            rel="noopener noreferrer"
            className="github-btn"
            title="Ver código no GitHub"
          >
            <FolderGit2 size={20} />
            <span>GitHub</span>
          </a>
        </div>
      </header>

      <main className="main-container">
        {/* Filtros em pílula */}
        <div className="category-filter">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`pill-btn ${category === cat.value ? "active" : ""}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Estado de Carregamento */}
        {loading && (
          <div className="state-container">
            <div className="spinner"></div>
            <p>Atualizando o feed do Duna News...</p>
          </div>
        )}

        {/* Estado de Erro */}
        {error && (
          <div className="state-container">
            <AlertCircle color="#ff2d55" style={{ marginBottom: 8 }} />
            <p>{error}</p>
          </div>
        )}

        {/* Feed de Notícias */}
        {!loading && !error && (
          <div>
            {articles.length > 0 ? (
              articles.map((post) => <NewsCard key={post.id} post={post} />)
            ) : (
              <div className="state-container">
                <p>Nenhuma publicação disponível no momento.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
