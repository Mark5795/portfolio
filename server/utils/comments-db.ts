import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

export type ProjectComment = {
  id: number
  projectSlug: string
  name: string
  message: string
  createdAt: string
}

const databasePath = process.env.COMMENTS_DB_PATH || join(process.cwd(), 'data', 'comments.sqlite')
mkdirSync(dirname(databasePath), { recursive: true })

const database = new Database(databasePath)
database.pragma('journal_mode = WAL')
database.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_slug TEXT NOT NULL,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`)

const listCommentsStatement = database.prepare(`
  SELECT id, project_slug AS projectSlug, name, message, created_at AS createdAt
  FROM comments
  WHERE project_slug = ?
  ORDER BY id DESC
`)

const listAllCommentsStatement = database.prepare(`
  SELECT id, project_slug AS projectSlug, name, message, created_at AS createdAt
  FROM comments
  ORDER BY id DESC
`)

const createCommentStatement = database.prepare(`
  INSERT INTO comments (project_slug, name, message)
  VALUES (?, ?, ?)
`)

const deleteCommentStatement = database.prepare('DELETE FROM comments WHERE id = ?')

export const listProjectComments = (projectSlug: string): ProjectComment[] =>
  listCommentsStatement.all(projectSlug) as ProjectComment[]

export const listAllComments = (): ProjectComment[] =>
  listAllCommentsStatement.all() as ProjectComment[]

export const deleteComment = (commentId: number) =>
  deleteCommentStatement.run(commentId).changes > 0

export const createProjectComment = (projectSlug: string, name: string, message: string): ProjectComment => {
  const result = createCommentStatement.run(projectSlug, name, message)
  return database.prepare(`
    SELECT id, project_slug AS projectSlug, name, message, created_at AS createdAt
    FROM comments
    WHERE id = ?
  `).get(result.lastInsertRowid) as ProjectComment
}
