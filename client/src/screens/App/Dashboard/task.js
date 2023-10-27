import React from 'react';
import styled, { css } from 'styled-components';
import { colors, breakpoints } from '../../../styles/theme';
import TaskColumn from './taskColumn';


const BorderDiv = styled.div`
  overflow: hidden;
  border-radius: 0.5rem;
  margin-top: 1.25rem;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  @media (min-width: ${breakpoints.medium}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (min-width: ${breakpoints.medium}) {
    border-radius: 0.5rem;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap:10px;
    background-color:${colors.white};
    margin-top: 0.9rem;
    margin-right: 0.9rem;
  
    border-left: 1px solid ${colors.gray200};
  }
  @media (max-width: ${breakpoints.medium}) {
    border-top: 1px solid ${colors.gray200};
  }
`;


const Tasks = ({todo}) => (    
      <BorderDiv>  
        <TaskColumn
            title={todo.title}
            description={todo.description}
            date={todo.date}
            diff={todo.status}
            pillColor={colors.green100}
            pillTextColor={colors.green800}
        > 
          </TaskColumn>
      </BorderDiv>
);

export default Tasks;

