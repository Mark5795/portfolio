import { Pool } from 'pg'

export type ProjectComment = {
  id: number
  projectSlug: string
  name: string
  message: string
  createdAt: string
  approved: boolean
}

const database = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
})

const databaseReady = database.query(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_slug TEXT NOT NULL,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved BOOLEAN NOT NULL DEFAULT FALSE
  )
`)

const commentFields = `
  SELECT comments.id, comments.project_slug AS "projectSlug", comments.name,
    comments.message, comments.created_at AS "createdAt", comments.approved
  FROM comments
`

export const listProjectComments = async (projectSlug: string): Promise<ProjectComment[]> => {
  await databaseReady
  const result = await database.query<ProjectComment>(`${commentFields}
  WHERE comments.project_slug = $1 AND comments.approved = TRUE
  ORDER BY comments.id DESC`, [projectSlug])
  return result.rows
}

export const listAllComments = async (): Promise<ProjectComment[]> => {
  await databaseReady
  const result = await database.query<ProjectComment>(`${commentFields}
  ORDER BY comments.id DESC`)
  return result.rows
}

export const deleteComment = async (commentId: number): Promise<boolean> => {
  await databaseReady
  const result = await database.query('DELETE FROM comments WHERE id = $1', [commentId])
  return result.rowCount === 1
}

export const approveComment = async (commentId: number): Promise<boolean> => {
  await databaseReady
  const result = await database.query(
    'UPDATE comments SET approved = TRUE WHERE id = $1',
    [commentId],
  )
  return result.rowCount === 1
}

export const createProjectComment = async (
  projectSlug: string,
  name: string,
  message: string,
): Promise<ProjectComment> => {
  await databaseReady
  const result = await database.query<ProjectComment>(`WITH inserted AS (
    INSERT INTO comments (project_slug, name, message)
    VALUES ($1, $2, $3)
    RETURNING id
  )
  ${commentFields}
  JOIN inserted ON inserted.id = comments.id`, [projectSlug, name, message])
  return result.rows[0]
}
