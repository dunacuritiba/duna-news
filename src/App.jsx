import { useState, useEffect } from "react";
import { NewsCard } from "./components/NewsCard";
import { AlertCircle, FolderGit2 } from "lucide-react";
import "./App.css";
import dunaLogo from "./assets/286461205.png";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

export default function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("technology");

  // Mapeamento de categorias suportadas pela GNews API
  const categories = [
    { label: "Tecnologia", value: "technology" },
    { label: "Negócios", value: "business" },
    { label: "Esportes", value: "sports" },
    { label: "Entretenimento", value: "entertainment" },
    { label: "Saúde", value: "health" },
    { label: "Ciência", value: "science" },
  ];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!API_KEY) {
          throw new Error("Chave da API não configurada no arquivo .env");
        }

        const targetUrl = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=pt&apikey=${API_KEY}`;

        // Utilizando o proxy allorigins (mais estável para respostas JSON)
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

        const response = await fetch(proxyUrl);

        if (!response.ok) {
          throw new Error(`Erro na rede: ${response.statusText}`);
        }

        const wrapperData = await response.json();

        // O allorigins retorna o JSON da API dentro da propriedade 'contents' como string
        const data = JSON.parse(wrapperData.contents);

        if (data.errors) {
          throw new Error(data.errors[0]);
        }

        if (data.articles) {
          const formattedNews = data.articles
            .filter((article) => article.title && article.image)
            .map((article, index) => {
              let domain = "google.com";
              try {
                domain = new URL(article.url || article.source.url).hostname;
              } catch {
                // domínio padrão
              }

              return {
                id: article.url || index,
                author: article.source.name || "Fonte Desconhecida",
                avatar: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
                time: new Date(article.publishedAt).toLocaleTimeString(
                  "pt-BR",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                ),
                category: category.charAt(0).toUpperCase() + category.slice(1),
                title: article.title,
                description: article.description,
                image: article.image,
                url: article.url,
                likes: Math.floor(Math.random() * 80) + 12,
                comments: [],
                isLiked: false,
              };
            });

          setArticles(formattedNews);
        } else {
          setArticles([]);
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
      {/* Header com estilo Glassmorphism e Link para o GitHub */}
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
            href="https://github.com" // Substitua pela URL do seu repositório no GitHub
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
        {/* Filtros em formato de pílulas */}
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
            <p>Atualizando o feed...</p>
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
