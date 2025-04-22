import { Express, Request, Response } from "express";
import { storage } from "./storage";
import { isAdmin } from "./auth";
import { insertArticleSchema, insertCategorySchema } from "@shared/schema";
import slugify from "slugify";

export function setupAdminRoutes(app: Express) {
  // Admin user routes
  app.get("/api/admin/user", (req, res) => {
    // If not logged in, return 401
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Return user data
    res.json(req.user);
  });

  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  // Login and registration routes are handled by auth.ts

  // Admin articles routes
  app.get("/api/admin/articles", isAdmin, async (req, res) => {
    try {
      const articles = await storage.getAllArticles({ isDraft: undefined });
      res.json(articles);
    } catch (error) {
      console.error("Error getting articles:", error);
      res.status(500).json({ message: "Failed to get articles" });
    }
  });

  app.get("/api/admin/articles/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getArticleById(id);

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      res.json(article);
    } catch (error) {
      console.error("Error getting article:", error);
      res.status(500).json({ message: "Failed to get article" });
    }
  });

  app.post("/api/admin/articles", isAdmin, async (req, res) => {
    try {
      // Validate request body
      const validationResult = insertArticleSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid article data",
          errors: validationResult.error.format(),
        });
      }

      // Process data
      const articleData = validationResult.data;
      
      // If slug not provided, generate one from title
      if (!articleData.slug) {
        articleData.slug = slugify(articleData.title, { lower: true, strict: true });
      }

      // Set author ID to current user
      articleData.authorId = req.user!.id;

      // Create article
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  app.put("/api/admin/articles/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if article exists
      const existingArticle = await storage.getArticleById(id);
      if (!existingArticle) {
        return res.status(404).json({ message: "Article not found" });
      }

      // Update article
      const articleData = req.body;
      
      // If slug not provided but title changed, regenerate slug
      if (!articleData.slug && articleData.title && articleData.title !== existingArticle.title) {
        articleData.slug = slugify(articleData.title, { lower: true, strict: true });
      }

      // Set updatedAt to current date
      articleData.updatedAt = new Date().toISOString();

      const updatedArticle = await storage.updateArticle(id, articleData);
      res.json(updatedArticle);
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  app.delete("/api/admin/articles/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if article exists
      const existingArticle = await storage.getArticleById(id);
      if (!existingArticle) {
        return res.status(404).json({ message: "Article not found" });
      }

      // Delete article
      const success = await storage.deleteArticle(id);
      if (success) {
        res.status(200).json({ message: "Article deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete article" });
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Admin categories routes
  app.get("/api/admin/categories", isAdmin, async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error getting categories:", error);
      res.status(500).json({ message: "Failed to get categories" });
    }
  });

  app.get("/api/admin/categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategoryById(id);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      console.error("Error getting category:", error);
      res.status(500).json({ message: "Failed to get category" });
    }
  });

  app.post("/api/admin/categories", isAdmin, async (req, res) => {
    try {
      // Validate request body
      const validationResult = insertCategorySchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid category data",
          errors: validationResult.error.format(),
        });
      }

      // Process data
      const categoryData = validationResult.data;
      
      // If slug not provided, generate one from name
      if (!categoryData.slug) {
        categoryData.slug = slugify(categoryData.name, { lower: true, strict: true });
      }

      // Create category
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/admin/categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if category exists
      const existingCategory = await storage.getCategoryById(id);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Update category
      const categoryData = req.body;
      
      // If slug not provided but name changed, regenerate slug
      if (!categoryData.slug && categoryData.name && categoryData.name !== existingCategory.name) {
        categoryData.slug = slugify(categoryData.name, { lower: true, strict: true });
      }

      const updatedCategory = await storage.updateCategory(id, categoryData);
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if category exists
      const existingCategory = await storage.getCategoryById(id);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Delete category
      const success = await storage.deleteCategory(id);
      if (success) {
        res.status(200).json({ message: "Category deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete category" });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Admin messages routes
  app.get("/api/admin/messages", isAdmin, async (req, res) => {
    try {
      const messages = await storage.getAllMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error getting messages:", error);
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  app.get("/api/admin/messages/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.getMessageById(id);

      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      res.json(message);
    } catch (error) {
      console.error("Error getting message:", error);
      res.status(500).json({ message: "Failed to get message" });
    }
  });

  app.put("/api/admin/messages/:id/read", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if message exists
      const existingMessage = await storage.getMessageById(id);
      if (!existingMessage) {
        return res.status(404).json({ message: "Message not found" });
      }

      // Mark message as read
      const updatedMessage = await storage.markMessageAsRead(id);
      res.json(updatedMessage);
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  app.delete("/api/admin/messages/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if message exists
      const existingMessage = await storage.getMessageById(id);
      if (!existingMessage) {
        return res.status(404).json({ message: "Message not found" });
      }

      // Delete message
      const success = await storage.deleteMessage(id);
      if (success) {
        res.status(200).json({ message: "Message deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete message" });
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  // Admin dashboard stats
  app.get("/api/admin/stats", isAdmin, async (req, res) => {
    try {
      const articlesCount = (await storage.getAllArticles()).length;
      const categoriesCount = (await storage.getAllCategories()).length;
      const messagesCount = (await storage.getAllMessages()).length;
      const usersCount = (await storage.getAllUsers()).length;

      res.json({
        articlesCount,
        categoriesCount,
        messagesCount,
        usersCount,
      });
    } catch (error) {
      console.error("Error getting admin stats:", error);
      res.status(500).json({ message: "Failed to get admin stats" });
    }
  });
}