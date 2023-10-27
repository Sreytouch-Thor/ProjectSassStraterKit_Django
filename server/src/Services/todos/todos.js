import {
  postTodoModel,
  getTodosModel,
  putTodoModel,
  deleteTodoModel
} from '../../Model/sql/todos/todos.js';

export const getTodos = async (req, res) => {
  let org_id = req.query.org_id;

  let result = await getTodosModel(org_id);

  res.status(200).send(result);
};

export const postTodo = async (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let author = req.body.author;
  let org_id = req.body.org_id;
  let status = req.body.status;
  let date = req.body.date;
  
  
  // Add condition to allow task creation or not
  if (title !== "" && description !== "" && status !== "" && date !== "") {
    await postTodoModel(title, description, author, org_id, status, date);
    res.status(200).send('Post Successful');
  } else {
    // Condition is not met, prevent task creation
    res.status(403).send('Task creation not allowed');
  }
};

export const putTodo = async (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let author = req.body.author;
  let todo_id = req.body.todo_id;
  let status = req.body.status;
  let date = req.body.date;

  await putTodoModel(title, description, author, todo_id, status, date,);

  res.status(200).send('Put Successful');
};

export const deleteTodo = async (req, res) => {
  let todo_id = req.query.todo_id;

  await deleteTodoModel(todo_id);

  res.status(200).send('Delete Successful');
};
