import { motion } from "framer-motion";
import { Article } from "@/types";
import { formatDate } from "@/lib/utils";

interface ArticlePreviewProps {
  article: Article;
  onClick: () => void;
}

const ArticlePreview = ({ article, onClick }: ArticlePreviewProps) => {
  return (
    <motion.div
      className="gradient-bg rounded-xl shadow-lg mb-6 overflow-hidden cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-2/3 p-6">
          <div className="flex items-center mb-3">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary bg-opacity-20 text-secondary">
              {article.category}
            </span>
            <span className="ml-3 text-sm text-muted-foreground">
              {formatDate(article.published)}
            </span>
          </div>
          <h3 className="font-space font-bold text-xl mb-2">{article.title}</h3>
          <p className="text-muted-foreground line-clamp-3">{article.excerpt}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ArticlePreview;
