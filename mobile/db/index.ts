/**
 * GenBrain — WatermelonDB Initialization
 *
 * Sets up the database with the schema and model classes.
 * Uses LokiJS adapter for Expo compatibility (no native SQLite required).
 */

import { Database } from "@nozbe/watermelondb";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";

import { schema } from "./schema";
import User from "./models/User";
import Card from "./models/Card";
import Category from "./models/Category";
import CardInteraction from "./models/CardInteraction";
import QuizAttempt from "./models/QuizAttempt";
import DailyStreak from "./models/DailyStreak";

// Create adapter (LokiJS for Expo managed workflow)
const adapter = new LokiJSAdapter({
  schema,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
});

// Create database instance
const database = new Database({
  adapter,
  modelClasses: [
    User,
    Card,
    Category,
    CardInteraction,
    QuizAttempt,
    DailyStreak,
  ],
});

export default database;

// Re-export models for convenient access
export { User, Card, Category, CardInteraction, QuizAttempt, DailyStreak };
