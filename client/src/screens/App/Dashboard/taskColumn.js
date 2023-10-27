import React from 'react';
import styled from 'styled-components';
import { colors, breakpoints } from '../../../styles/theme';
import Date from '../../../components/DateString/date';

const Wrapper = styled.div`
  padding: 1.25rem 1rem;
  @media (min-width: ${breakpoints.small}) {
    padding: 1.5rem;
  }
`;


const Dd = styled.dd`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  @media (min-width: ${breakpoints.medium}) {
    display: block;
  }
  @media (min-width: ${breakpoints.large}) {
    display: flex;
  }
`;



const Pill = styled.div`
  margin-top: 10rem;
  display: inline-flex;
  align-items: baseline;
  color: ${colors.white};
  /* background-color: ${({ pillColor }) => pillColor}; */
  background-color: ${(props) => {
    const todo = props.children[1];
    if (todo == "To Do") return "#ff7676";
    if (todo == "InProgress") return "#89beff"; 
    if (todo == "InReview") return "#ffbb62"; 
    if (todo == "Done") return "#00b300"; 
    console.log(todo);
  }};
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding:0.725rem 1.625rem;
  @media (min-width: ${breakpoints.medium}) {
    margin-top: 1.5rem;
  }
  @media (min-width: ${breakpoints.large}) {
    margin-top: 0;
  }
`;

const StatColumn = ({ 
  title, 
  description, 
  date, 
  svg, 
  diff, 
  status, 
 }) => (
  <Wrapper>
    <dl>
      <h2>{title}</h2>
        {description && <h3>{description}</h3>}
        {date && <div><Date dateString = {date} /></div>}
        {status && <div>{status}</div>}
      <Dd>
        <Pill>
          {svg}
          {diff}
        </Pill>
      </Dd>
    </dl>
  </Wrapper>
);

export default StatColumn;
