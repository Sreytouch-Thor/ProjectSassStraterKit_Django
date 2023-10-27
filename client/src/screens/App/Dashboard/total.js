import React, {useEffect, useState, useContext} from 'react';
import styled, { css } from 'styled-components';
import { colors, breakpoints } from '../../../styles/theme';
import getOrgId from '../../../utils/orgId';
import TotalColumn from './totalColumn';
import AuthContext from '../../../utils/authContext';
import ApiContext from '../../../utils/apiContext';
import axios from '../../../services/axios';
import ArrowUp from '../../../components/App/svgs/arrowUp';
import ArrowDown from '../../../components/App/svgs/arrowDown';

const BorderDiv = styled.div`
  overflow: hidden;
  border-radius: 0.3rem;
  margin-top: 1.25rem;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  @media (min-width: ${breakpoints.medium}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (min-width: ${breakpoints.medium}) {
    border-radius: 0.3rem;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 2px;
    background-color:${colors.white};
    margin-top: 0.9rem;
    margin-right: 0.5rem;
  
    border-left: 1px solid ${colors.gray200};
  }
  @media (max-width: ${breakpoints.medium}) {
    border-top: 1px solid ${colors.gray200};
  }
`;

const arrowStyles = css`
  margin-left: -0.25rem;
  margin-right: 0.125rem;
  flex-shrink: 0;
  align-self: center;
`;
const StyledArrowUp = styled(ArrowUp)`
  color: ${colors.green500};
  ${arrowStyles}
`;

const Total = () => {    
  const org_id = getOrgId();
  const { authState } = useContext(AuthContext);
  const { fetchFailure, fetchInit, fetchSuccess, apiState } = useContext(ApiContext);
  const { isLoading } = apiState;
  let token = authState?.user.jwt_token;
  const headers = { Authorization: `Bearer ${token}` };

  const [todos, setTodos] = useState([]);
  const [todoCount, setTodoCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [inReviewCount, setInReviewCount] = useState(0);
  const [DoneCount, setDoneCount] = useState(0);

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
  useEffect(() => {
    // Count the number of tasks for each status
    const todoTasks = todos.filter((task) => task.status == 'To Do');
    const inProgressTasks = todos.filter((task) => task.status == 'InProgress');
    const inReviewTasks = todos.filter((task) => task.status == 'InReview');
    const doneTasks = todos.filter((task) => task.status == 'Done');

    setTodoCount(todoTasks.length);
    setInProgressCount(inProgressTasks.length);
    setInReviewCount(inReviewTasks.length);
    setDoneCount(doneTasks.length);
  }, [todos]);

  return (
    <>
    <BorderDiv>
      <TotalColumn
        title="To Do"
        number={todoCount.toString()}
        svg={<StyledArrowUp />}
        diffDescription="Increased by"
        diff="0%"  
        pillColor={colors.green100}
        pillTextColor={colors.green800}
      />
    </BorderDiv>
    <BorderDiv>
      <TotalColumn
        title="In Progress"
        number={inProgressCount.toString()}
        svg={<StyledArrowUp />}
        diffDescription="Increased by"
        diff="50%"
        pillColor={colors.green100}
        pillTextColor={colors.green800}
      />
    </BorderDiv>
    <BorderDiv>
      <TotalColumn
        title="In Review"
        number={inReviewCount.toString()}
        svg={<StyledArrowUp />}
        diffDescription="Increased by"
        diff="80%"
        pillColor={colors.green100}
        pillTextColor={colors.green800}
      />
    </BorderDiv>
    <BorderDiv>
      <TotalColumn
        title="Done"
        number={DoneCount.toString()}
        svg={<StyledArrowUp />}
        diffDescription="Increased by"
        diff="100%"
        pillColor={colors.green100}
        pillTextColor={colors.green800}
      />
    </BorderDiv>
 
    </>
  )
};

export default Total;

