import mysql from 'mysql2/promise';
import { config } from '../config/env.js';

export function createPool() {
  return mysql.createPool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    waitForConnections: config.db.waitForConnections,
    connectionLimit: config.db.connectionLimit,
    queueLimit: config.db.queueLimit,
    enableKeepAlive: config.db.enableKeepAlive,
    keepAliveInitialDelay: config.db.keepAliveInitialDelay,
    namedPlaceholders: false,
  });
}

let pool;

export function getPool() {
  if (!pool) pool = createPool();
  return pool;
}
