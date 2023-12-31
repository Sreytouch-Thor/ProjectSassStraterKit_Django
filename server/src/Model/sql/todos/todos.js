import db from '../../../Database/sql/db.js';

export const postTodoModel = async (title, description, author, org_id, status, date ) => {
  let text = `INSERT INTO todos(title, description, author, org_id, status, date)
              VALUES ($1, $2, $3, $4, $5, $6)`;
  let values = [title, description, author, org_id, status, date];

  await db.query(text, values);

  return;
};

export const getTodosModel = async (org_id) => {
  let text = `SELECT * FROM todos WHERE org_id=$1`;
  let values = [org_id];

  let queryResult = await db.query(text, values);

  return queryResult.rows;
};

export const putTodoModel = async (title, description, author, todo_id, status, date) => {
  let text = `UPDATE todos SET title= $1, description=$2, author=$3, status=$5, date=$6
              WHERE id = $4`;
  let values = [title, description, author, todo_id, status, date];

  await db.query(text, values);

  return;
};

export const deleteTodoModel = async (todo_id) => {
  let text = `DELETE FROM todos 
              WHERE id=$1`;
  let values = [todo_id];

  await db.query(text, values);

  return;
};
