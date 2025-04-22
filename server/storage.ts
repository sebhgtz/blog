import { eq, desc, and, like, sql } from "drizzle-orm";
import { db } from "./db";
import { 
  users, type User, type InsertUser,
  articles, type Article, type InsertArticle, type UpdateArticle,
  messages, type Message, type InsertMessage,
  categories, type Category, type InsertCategory 
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Category methods
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  
  // Article methods
  getAllArticles(options?: { isDraft?: boolean, limit?: number }): Promise<Article[]>;
  getArticleById(id: number): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<UpdateArticle>): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;
  searchArticles(query: string): Promise<Article[]>;
  
  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getAllMessages(): Promise<Message[]>;
  getMessageById(id: number): Promise<Message | undefined>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  deleteMessage(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // ===== User methods =====
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }
  
  // ===== Category methods =====
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }
  
  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const [category] = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();
    return category;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount > 0;
  }
  
  async getAllCategories(): Promise<Category[]> {
    return await db
      .select()
      .from(categories)
      .orderBy(categories.name);
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    return category;
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug));
    return category;
  }
  
  // ===== Article methods =====
  async getAllArticles(options?: { isDraft?: boolean, limit?: number }): Promise<Article[]> {
    const query = db
      .select()
      .from(articles)
      .orderBy(desc(articles.published));
      
    if (options?.isDraft !== undefined) {
      query.where(eq(articles.isDraft, options.isDraft));
    }
    
    if (options?.limit) {
      query.limit(options.limit);
    }
    
    return await query;
  }
  
  async getArticleById(id: number): Promise<Article | undefined> {
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id));
    return article;
  }
  
  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.slug, slug));
    return article;
  }
  
  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    // Update the updatedAt field on creation
    const articleWithUpdatedAt = {
      ...insertArticle,
      updatedAt: new Date()
    };
    
    const [article] = await db
      .insert(articles)
      .values(articleWithUpdatedAt)
      .returning();
    return article;
  }
  
  async updateArticle(id: number, updateData: Partial<UpdateArticle>): Promise<Article | undefined> {
    // Always update the updatedAt field
    const dataWithUpdatedAt = {
      ...updateData,
      updatedAt: new Date()
    };
    
    const [article] = await db
      .update(articles)
      .set(dataWithUpdatedAt)
      .where(eq(articles.id, id))
      .returning();
    return article;
  }
  
  async deleteArticle(id: number): Promise<boolean> {
    const result = await db
      .delete(articles)
      .where(eq(articles.id, id));
    return result.rowCount > 0;
  }
  
  async searchArticles(query: string): Promise<Article[]> {
    const searchQuery = `%${query}%`;
    return await db
      .select()
      .from(articles)
      .where(
        or(
          like(articles.title, searchQuery),
          like(articles.excerpt, searchQuery),
          like(articles.content, searchQuery)
        )
      )
      .orderBy(desc(articles.published));
  }
  
  // ===== Message methods =====
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }
  
  async getAllMessages(): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .orderBy(desc(messages.createdAt));
  }
  
  async getMessageById(id: number): Promise<Message | undefined> {
    const [message] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, id));
    return message;
  }
  
  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const [message] = await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
    return message;
  }
  
  async deleteMessage(id: number): Promise<boolean> {
    const result = await db
      .delete(messages)
      .where(eq(messages.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();

// Helper function for OR conditions
function or(...conditions: any[]) {
  return sql`(${conditions.join(' OR ')})`;
}
