import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  ChevronRight,
  Send,
  Newspaper,
} from "lucide-react";

export function NewsCard({ post }) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [newComment, setNewComment] = useState("");
  const [imageError, setImageError] = useState(false);

  const handleLike = () => {
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments([
      ...comments,
      { id: Date.now(), user: "Você", text: newComment },
    ]);
    setNewComment("");
  };

  return (
    <article className="apple-card">
      <div className="card-header">
        {!imageError ? (
          <img
            src={post.avatar}
            alt={post.author}
            className="avatar"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="avatar flex-center bg-gray-200">
            <Newspaper size={18} color="#86868b" />
          </div>
        )}
        <div className="source-meta">
          <div className="source-name">{post.author}</div>
          <div className="post-date">Hoje • {post.time}</div>
        </div>
      </div>

      <div className="card-body">
        <h2 className="news-title">{post.title}</h2>
        <p className="news-description">{post.description}</p>
      </div>

      {post.image && (
        <div className="media-wrapper">
          <img
            src={post.image}
            alt={post.title}
            onError={(e) => {
              e.target.parentElement.style.display = "none";
            }}
          />
        </div>
      )}

      <div className="card-metrics">
        <span>{likes} curtidas</span>
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="read-more-link"
        >
          Ler artigo <ChevronRight size={14} />
        </a>
      </div>

      <div className="card-actions">
        <button
          onClick={handleLike}
          className={`action-btn ${isLiked ? "liked" : ""}`}
        >
          <Heart />
          <span>Curtir</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="action-btn"
        >
          <MessageCircle />
          <span>{comments.length > 0 ? comments.length : "Comentar"}</span>
        </button>

        <button
          onClick={() =>
            navigator.share
              ? navigator.share({ title: post.title, url: post.url })
              : alert("Link copiado!")
          }
          className="action-btn"
        >
          <Share2 />
          <span>Enviar</span>
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {comments.length > 0 && (
            <div className="comment-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <span className="user">{comment.user}</span>
                  <span className="text">{comment.text}</span>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddComment} className="comment-form">
            <input
              type="text"
              placeholder="Adicionar comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit">
              <Send />
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
