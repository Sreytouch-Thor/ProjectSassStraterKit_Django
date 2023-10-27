import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import Tasks from './task';
import { colors, breakpoints } from '../../../styles/theme';
import AuthContext from '../../../utils/authContext';
import ApiContext from '../../../utils/apiContext';
import getOrgId from '../../../utils/orgId';
import { Empty } from 'antd';
import axios from '../../../services/axios';
import Total from './total';

const Title = styled.h1`
  font-weight: 600;
  color: ${colors.gray900};
  font-size: 1.5rem;
`;
const Title1 = styled.h1`
  font-size: 1.5rem;
  color: ${colors.gray900};
  font-size: 1rem;
`;
const Title2 = styled.h1`
  font-weight: 600;
  font-size: 1.5rem;
  margin-top: 2.20rem;
  color: ${colors.gray900};
  font-size: 1rem;
`;

const Card = styled.div`
  background-color: ${colors.gray100};
  overflow: hidden;
  border-radius: 0.5rem;
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  @media (min-width: ${breakpoints.medium}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;
const CardTotal = styled.div`
  background-color: ${colors.gray100};
  overflow: hidden;
  border-radius: 0.5rem;
  margin-top: 1.25rem;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  @media (min-width: ${breakpoints.medium}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const Dashboard = () => {
  const org_id = getOrgId();
  const { authState } = useContext(AuthContext);
  const { fetchFailure, fetchInit, fetchSuccess, apiState } = useContext(ApiContext);
  const { isLoading } = apiState;
  let token = authState?.user.jwt_token;
  const headers = { Authorization: `Bearer ${token}` };

  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (org_id !== '[org_id]') fetchTodos();
  }, [org_id]);

  const fetchTodos = async () => {
    fetchInit();
    let params = { org_id };
    let result = await axios.get(`/api/get/todos`, { params, headers }).catch((err) => {
      fetchFailure(err);
    });
    setTodos(result?.data);
    fetchSuccess();
  };

  return (
    <div>
      <Title>Dashboard</Title>
      <Title1>Total in tasks:</Title1>
      <CardTotal>
        <Total/>
      </CardTotal>
      <Title2>All Tasks:</Title2>
      <Card tip="Loading..." spinning={isLoading}>
        {todos && todos.length !== 0 ? (
          todos
            .map((todo) => <Tasks key={todo.id} todo={todo} />)
        ) : (
          <Empty />
        )}
      </Card>
    </div>
  );
};

export default Dashboard;