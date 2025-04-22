import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";
import { setupAdminRoutes } from "./admin-routes";
import { runMigrations } from "./migrations";

export async function registerRoutes(app: Express): Promise<Server> {
  try {
    // Run database migrations
    await runMigrations();
    
    // Setup authentication
    setupAuth(app);
    
    // Setup admin routes
    setupAdminRoutes(app);

    // Public API routes
    app.get("/api/articles", async (req, res) => {
      try {
        // Only show published articles (not drafts) to the public
        const articles = await storage.getAllArticles({ isDraft: false });
        res.json(articles);
      } catch (error) {
        console.error("Error fetching articles:", error);
        res.status(500).json({ message: "Failed to fetch articles" });
      }
    });
    
    app.get("/api/categories", async (req, res) => {
      try {
        const categories = await storage.getAllCategories();
        res.json(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Failed to fetch categories" });
      }
    });
    
    app.get("/api/articles/:id", async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid article ID" });
        }
        
        const article = await storage.getArticleById(id);
        if (!article || article.isDraft) {
          return res.status(404).json({ message: "Article not found" });
        }
        
        res.json(article);
      } catch (error) {
        console.error("Error fetching article:", error);
        res.status(500).json({ message: "Failed to fetch article" });
      }
    });
    
    app.get("/api/articles/slug/:slug", async (req, res) => {
      try {
        const { slug } = req.params;
        const article = await storage.getArticleBySlug(slug);
        
        if (!article || article.isDraft) {
          return res.status(404).json({ message: "Article not found" });
        }
        
        res.json(article);
      } catch (error) {
        console.error("Error fetching article by slug:", error);
        res.status(500).json({ message: "Failed to fetch article" });
      }
    });
    
    app.get("/api/articles/category/:categoryId", async (req, res) => {
      try {
        const categoryId = parseInt(req.params.categoryId);
        if (isNaN(categoryId)) {
          return res.status(400).json({ message: "Invalid category ID" });
        }
        
        // Get articles by category (only published)
        const articles = await storage.getAllArticles({ isDraft: false });
        const filteredArticles = articles.filter(article => article.categoryId === categoryId);
        
        res.json(filteredArticles);
      } catch (error) {
        console.error("Error fetching articles by category:", error);
        res.status(500).json({ message: "Failed to fetch articles by category" });
      }
    });
    
    app.post("/api/contact", async (req, res) => {
      try {
        const validatedData = insertMessageSchema.parse(req.body);
        
        const message = await storage.createMessage(validatedData);
        res.status(201).json({ message: "Message sent successfully", id: message.id });
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          return res.status(400).json({ message: validationError.message });
        }
        
        console.error("Error creating message:", error);
        res.status(500).json({ message: "Failed to send message" });
      }
    });
    
    // Error handling middleware
    app.use((err: any, req: any, res: any, next: any) => {
      console.error('Server error:', err);
      res.status(500).json({ message: "Internal server error" });
    });
  } catch (error) {
    console.error("Error during setup:", error);
    // Continue to create server even if setup fails
  }

  const httpServer = createServer(app);
  return httpServer;
}
