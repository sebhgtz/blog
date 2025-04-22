import { db } from "./db";
import { createAdminUser } from "./auth";
import { sql } from "drizzle-orm";

/**
 * This function creates the database tables if they don't exist
 * and seeds initial data
 */
export async function runMigrations() {
  try {
    console.log("Starting database migrations...");
    
    // Create tables based on schema
    await createTables();
    
    // Create default admin user (if doesn't exist)
    await createAdminUser("admin", "admin123");
    
    console.log("Database migrations completed successfully");
  } catch (error) {
    console.error("Error running migrations:", error);
    throw error;
  }
}

async function createTables() {
  // Create tables using raw SQL for better control
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      is_admin BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    
    CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      category_id INTEGER REFERENCES categories(id),
      image_url TEXT NOT NULL,
      published TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      author_id INTEGER REFERENCES users(id),
      is_draft BOOLEAN NOT NULL DEFAULT FALSE
    );
    
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      consent BOOLEAN NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      is_read BOOLEAN NOT NULL DEFAULT FALSE
    );
  `);
  
  console.log("Database tables created (if they didn't exist)");
  
  // Seed initial categories
  const defaultCategories = [
    { name: "Web Development", slug: "web-development", description: "Articles about web development technologies and practices" },
    { name: "AI & ML", slug: "ai-ml", description: "Artificial Intelligence and Machine Learning topics" },
    { name: "Security", slug: "security", description: "Cybersecurity best practices and news" }
  ];
  
  // Insert categories if they don't exist
  for (const category of defaultCategories) {
    await db.execute(sql`
      INSERT INTO categories (name, slug, description)
      VALUES (${category.name}, ${category.slug}, ${category.description})
      ON CONFLICT (slug) DO NOTHING;
    `);
  }
}