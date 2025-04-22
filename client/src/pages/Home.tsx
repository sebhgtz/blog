import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Article } from "@/types";
import ArticlePreview from "@/components/ArticlePreview";
import ArticleViewer from "@/components/ArticleViewer";

const Home = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isViewerVisible, setIsViewerVisible] = useState(false);

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  // Lock body scroll when viewing an article on mobile
  useEffect(() => {
    if (isViewerVisible && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isViewerVisible]);

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setIsViewerVisible(true);
  };

  const closeArticleViewer = () => {
    setIsViewerVisible(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen"
    >
      <div className="flex flex-col lg:flex-row relative">
        {/* Article list column */}
        <div 
          className={`w-full ${isViewerVisible ? 'lg:w-1/2 lg:pr-8' : 'lg:w-full'} transition-all duration-500 ${isViewerVisible ? 'hidden lg:block' : 'block'}`}
        >
          <motion.h2 
            variants={itemVariants}
            className="font-space font-bold text-3xl mb-8 text-secondary"
          >
            Latest Articles
          </motion.h2>
          
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="gradient-bg rounded-xl p-6 animate-pulse">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-48 bg-muted rounded-lg"></div>
                    <div className="md:w-2/3 md:pl-6 mt-4 md:mt-0">
                      <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                      <div className="h-8 bg-muted rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-muted rounded w-full mb-2"></div>
                      <div className="h-4 bg-muted rounded w-full mb-2"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : articles && articles.length > 0 ? (
            <div>
              {articles.map((article) => (
                <motion.div 
                  key={article.id} 
                  variants={itemVariants}
                >
                  <ArticlePreview 
                    article={article} 
                    onClick={() => handleArticleClick(article)} 
                  />
                </motion.div>
              ))}
              
              <motion.div 
                variants={itemVariants}
                className="mt-8 flex justify-center"
              >
                <Button className="gradient-button rounded-full">
                  Load More Articles
                </Button>
              </motion.div>
            </div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-10"
            >
              <p className="text-muted-foreground mb-4">No articles found.</p>
              <Button className="gradient-button rounded-full">
                Check Back Later
              </Button>
            </motion.div>
          )}
        </div>
        
        {/* Article viewer */}
        <ArticleViewer 
          article={selectedArticle} 
          onClose={closeArticleViewer}
          visible={isViewerVisible}
        />
      </div>
    </motion.section>
  );
};

export default Home;
