import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Heart, MessageSquare, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Article } from "@/types";
import { formatDate } from "@/lib/utils";

interface ArticleViewerProps {
  article: Article | null;
  onClose: () => void;
  visible: boolean;
}

const ArticleViewer = ({ article, onClose, visible }: ArticleViewerProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close the article
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (visible && panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, onClose]);

  // Add or remove viewer-open class on body
  useEffect(() => {
    if (visible) {
      document.body.classList.add('viewer-open');
    } else {
      document.body.classList.remove('viewer-open');
    }
    
    return () => {
      document.body.classList.remove('viewer-open');
    };
  }, [visible]);

  // Scroll to top when opening a new article
  useEffect(() => {
    if (visible && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [article, visible]);

  if (!article) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Mobile overlay background */}
          <motion.div 
            className="article-viewer-overlay fixed inset-0 z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Article viewer panel */}
          <motion.div
            ref={panelRef}
            className="w-full lg:w-1/2 lg:pl-8 mt-8 lg:mt-0 fixed lg:relative right-0 top-0 lg:top-auto h-screen lg:h-auto z-40 article-viewer-mobile"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div 
              ref={contentRef}
              className="gradient-bg rounded-xl shadow-lg p-8 h-full lg:h-auto overflow-y-auto max-h-screen relative article-viewer-content"
            >
              {/* Floating close button */}
              <button 
                onClick={onClose}
                className="article-close-btn bg-primary hover:bg-secondary text-white rounded-full p-2.5 transition duration-300"
                aria-label="Close article"
              >
                <X size={20} />
              </button>
              
              {/* Back button (mobile only) */}
              <button 
                onClick={onClose}
                className="lg:hidden flex items-center text-muted-foreground hover:text-secondary transition duration-300 mb-4"
                aria-label="Go back to article list"
              >
                <ArrowLeft size={16} className="mr-1" />
                <span>Back to articles</span>
              </button>
              
              <div className="mb-6 pt-6 lg:pt-0">
                <div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary bg-opacity-20 text-secondary">
                    {article.category}
                  </span>
                  <span className="ml-3 text-sm text-muted-foreground">
                    {formatDate(article.published)}
                  </span>
                </div>
              </div>
              
              <h2 className="font-space font-bold text-2xl md:text-3xl mb-4">
                {article.title}
              </h2>
              
              <div className="mb-6 h-60 overflow-hidden rounded-lg">
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
              
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <button className="text-muted-foreground hover:text-secondary transition duration-300">
                      <Heart size={20} />
                    </button>
                    <button className="text-muted-foreground hover:text-secondary transition duration-300">
                      <MessageSquare size={20} />
                    </button>
                    <button className="text-muted-foreground hover:text-secondary transition duration-300">
                      <Share size={20} />
                    </button>
                  </div>
                  <Button className="gradient-button rounded-full">
                    Read More
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ArticleViewer;
