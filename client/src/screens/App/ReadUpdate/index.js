import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import AuthContext from '../../../utils/authContext';
import ApiContext from '../../../utils/apiContext';
import getOrgId from '../../../utils/orgId';
import Todo from './todo';
import { Empty, Spin } from 'antd';
import axios from '../../../services/axios';

const StyledMain = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 1.25rem;
`;

const ReadUpdate = () => {
  const org_id = getOrgId();
  const { authState } = useContext(AuthContext);
  const { fetchFailure, fetchInit, fetchSuccess, apiState } = useContext(ApiContext);
  const { isLoading } = apiState;
  let token = authState?.user.jwt_token;
  const headers = { Authorization: `Bearer ${token}` };

  const [todos, setTodos] = useState([]);

  //Edit Todo state and form state
  const [isEditting, setEdit] = useState(false);
  const [editTodoID, setTodoID] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editDate, setEditDate] = useState('');


  // ===========Style Table =================



const Table = styled.table`
min-width: 100%;
`;

const ThBase = styled.th`
padding: 1rem 1.5rem;
background-color: #808080;
font-weight: medium;
font-size: 1rem;
line-height: 1rem;
text-transform: uppercase;
color: white;
letter-spacing: 0.05em;
`;

const StyledTh1 = styled(ThBase)`
  text-align: left;
`;

const StyledTh2 = styled(ThBase)`
  text-align: left;
`;

const StyledTh3 = styled(ThBase)`
  text-align: left;
`;
const StyledTh4 = styled(ThBase)`
  text-align: left;
`;
const StyledTh5 = styled(ThBase)`
  text-align: count;
`;


  /* eslint-disable */
  useEffect(() => {
    if (org_id !=='[org_id]') fetchTodos();
  }, [org_id]);
  /* eslint-enable */

  const fetchTodos = async () => {
    fetchInit();

    let params = { org_id };

    let result = await axios.get(`/api/get/todos`, { params, headers }).catch((err) => {
      fetchFailure(err);
    });

    setTodos(result?.data);
    fetchSuccess();
  };

  const deleteTodo = async (todo) => {
    fetchInit();
    let todo_id = todo.id;

    let params = { todo_id };
    await axios.delete(`/api/delete/todo`, { params, headers }).catch((err) => {
      fetchFailure(err);
    });

    setEdit(false);

    setTimeout(() => fetchTodos(), 300);
    fetchSuccess();
  };

  const putTodo = async (event, todo) => {
    event.preventDefault();
    fetchInit();
    let title = event.target.title.value;
    let description = event.target.description.value;
    let author = authState?.user.username;
    let todo_id = todo.id;
    let status = event.target.status.value;
    let date = event.target.date.value;

    let data = { title, description, author, todo_id, status, date };
    await axios.put(`/api/put/todo`, data, { headers }).catch((err) => {
      fetchFailure(err);
    });

    setEdit(false);
    //Save data to context to limit api calls
    setTimeout(() => fetchTodos(), 300);
    fetchSuccess();
  };

  const editTodo = (todo) => {
    setEdit(true);
    setTodoID(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setEditStatus(todo.status);
    setEditDate(todo.date);
  };

  const handleEditTitleChange = (event) => {
    setEditTitle(event.target.value);
  };
  
  const handleEditDescChange = (event) => {
    setEditDescription(event.target.value);
  };
  
  const handleEditStatusChange = (event) => {
    setEditStatus(event.target.value);
  };

  const handleEditDateChange = (event) => {
    setEditDate(event.target.value);
  };

  return (
    <StyledMain>
      <Title>Todos: </Title>
      <Table>
        <thead>
          <tr>
            <StyledTh1>Title</StyledTh1>
            <StyledTh2>Discription</StyledTh2>
            <StyledTh3>Status</StyledTh3>
            <StyledTh4>Date</StyledTh4>
            <StyledTh5>Actions</StyledTh5>
          </tr>
        </thead>
      </Table>
        <Spin tip="Loading..." spinning={isLoading}>
          {todos.length !== 0 ? (
            todos.map((todo) => (
              <Todo
                todo={todo}
                isEditting={isEditting}
                editTodoID={editTodoID}
                handleEditTitleChange={handleEditTitleChange}
                editTitle={editTitle}
                handleEditDescChange={handleEditDescChange}
                editDescription={editDescription}
                handleEditStatusChange={handleEditStatusChange}
                editStatus={editStatus}
                handleEditDateChange={handleEditDateChange}
                editDate={editDate}
                editTodo={editTodo}
                deleteTodo={deleteTodo}
                putTodo={putTodo}
                setEdit={setEdit}
              />
            ))
          ) : (
            <Empty />
          )}
        </Spin>
      
    </StyledMain>
  );
};

export default ReadUpdate;
