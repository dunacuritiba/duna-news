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
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`,
        );

        const data = await response.json();

        if (data.status === "ok") {
          const formattedNews = data.articles
            .filter((article) => article.title && article.urlToImage)
            .map((article, index) => {
              let domain = "google.com";
              try {
                domain = new URL(article.url).hostname;
              } catch {
                // domain já tem valor padrão "google.com"
              }

              const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

              return {
                id: article.url || index,
                author: article.source.name || "Fonte Desconhecida",
                avatar: logoUrl, // Agora usa a logo real do site!
                time: new Date(article.publishedAt).toLocaleTimeString(
                  "pt-BR",
                  { hour: "2-digit", minute: "2-digit" },
                ),
                category: category.charAt(0).toUpperCase() + category.slice(1),
                title: article.title,
                description: article.description,
                image: article.urlToImage,
                url: article.url,
                likes: Math.floor(Math.random() * 80) + 12,
                comments: [],
                isLiked: false,
              };
            });

          setArticles(formattedNews);
        } else {
          throw new Error(data.message || "Erro ao carregar notícias.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]);

  return (
    <div>
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

        {loading && (
          <div className="state-container">
            <div className="spinner"></div>
            <p>Atualizando o feed...</p>
          </div>
        )}

        {error && (
          <div className="state-container">
            <AlertCircle color="#ff2d55" style={{ marginBottom: 8 }} />
            <p>{error}</p>
          </div>
        )}

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
