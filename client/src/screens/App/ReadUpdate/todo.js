import React from 'react';
import styled from 'styled-components';
import Card from '../../../components/Common/Card';
import { colors, breakpoints } from '../../../styles/theme';
import { FiEdit as EditIcon,FiTrash2 as DeleteIcon } from "react-icons/fi"
import CancelButton from '../../../components/Common/buttons/CancelButton';
import FieldLabel from '../../../components/Common/forms/FieldLabel';
import TextArea from '../../../components/Common/forms/TextArea';
import TextInput from '../../../components/Common/forms/TextInput';
import Button from '../../../components/Common/buttons/SecondaryButton';
import Date from '../../../components/DateString/date';

// ============ Style in Table==================
const Wrapper = styled.div`
  display: none;
  @media (min-width: ${breakpoints.small}) {
    display: block;
  }
  margin-top: 0.5rem; 
  vertical-align: middle;
  min-width: 100%;
  overflow-x: auto;
  overflow: hidden;
`;
const Text = styled.h1`
  font-weight: 600;
  color: ${colors.gray900};
  font-size: 1.5rem;
  text-align: center;
`;

const Table = styled.table`
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  min-width: 100%;
`;

const TableBody = styled.tbody`
  background-color: ${colors.white};
`;

const TdBase = styled.td`
  padding: 1rem 1.5rem;
  white-space: nowrap;
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

const StyledTd1 = styled(TdBase)`
  max-width: 0rem;
  width: 16%;
  text-align: left;
`;

const TransactionName = styled.div`
  display: flex;
`;

const StyledTd2 = styled(TdBase)`
  max-width: 0rem;
  width: 27%;
  text-align: left;

`;
const StyledTd3 = styled(TdBase)`
  text-align: left;
  width: 20%;
`;
const StyledTd4 = styled(TdBase)`
    text-align: left;
    max-width: 0rem;
    width: 18%;
`;
const StyledTd5 = styled(TdBase)`
    text-align: count;
    width:19%;

`;

const PaymentButton = styled.div`
  display: inline-flex;
  overflow: hidden;

 
`;

const Title = styled.p`
  color:black;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Status = styled.span`
  display: inline-flex;
  align-items: center;
  /* padding: 0.600rem 0.900rem; */
  border-radius: 1111px;
  font-size: 0.90rem;
  font-weight: 500;
  line-height: 1rem;
  color: white;
  padding: ${(props) => {
    const todo = props.children;
    if (todo == "To Do" || todo == "Done" ) return "0.600rem 1.900rem"; 
    if (todo == "InProgress") return "0.600rem 0.900rem"; 
    if (todo == "InReview") return "0.600rem 1.300rem"; 
  }};
  background-color: ${(props) => {
    const todo = props.children;
    if (todo == "To Do") return "#ff7676";
    if (todo == "InProgress") return "#89beff"; 
    if (todo == "InReview") return "#ffbb62"; 
    if (todo == "Done") return "#00b300"; 
  }};
  text-transform: capitalize;
`;

const Discription = styled.span`
  color: black;
  overflow: hidden;
  text-overflow: ellipsis;
`;


const StyledEditIcon = styled(EditIcon)`
  cursor: pointer;
  color: blue;
  font-size: 35px;
  margin-left: 15px;
`;
const StyledDeleteIcon = styled(DeleteIcon)`
  cursor: pointer;
  color: red;
  font-size: 35px;
  margin-left: 15px;
`;

// ========= form Edit data=============
const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
`;
const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormButtonsWrapper = styled.div`
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
`;

//==========Date and status========
const DateStatus = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;
const SelectStaus = styled.div`
  padding: 1rem;
`;
const InputDate = styled.div`
  padding: 0rem;
`;

const Select = styled.select`
  margin-left: 30px;
  padding: 0.5rem;
`;
const form = styled.form`
  background-color:orange;
`;

// =========Function Todo============
const todo = ({
  todo,
  isEditting,
  editTodoID,
  handleEditTitleChange,
  editTitle,
  handleEditDescChange,
  editDescription,
  handleEditStatusChange,
  editStatus,
  handleEditDateChange,
  editDate,
  editTodo,
  deleteTodo,
  putTodo,
  setEdit,
  
}) => (
  <Wrapper>
    <Table>
      <TableBody>
        <tr>
          <StyledTd1>
            <TransactionName>
              <PaymentButton>          
                <Title>{todo.title}</Title>
              </PaymentButton>
            </TransactionName>
          </StyledTd1>
          <StyledTd2>
            <TransactionName>
              <PaymentButton>         
                <Discription><div>{todo.description}</div></Discription>
              </PaymentButton>
            </TransactionName>
          </StyledTd2>
          <StyledTd3>
            <Status>{todo.status}</Status>
          </StyledTd3>
          <StyledTd4>
            <Date dateString= {todo.date}/>
          </StyledTd4>
          <StyledTd5>
              <StyledEditIcon
                onClick={() => editTodo(todo)}
                backgroundColor={colors.indigo600}
               />
              <StyledDeleteIcon 
                onClick={() => deleteTodo(todo)}
              />
          </StyledTd5>
        </tr>
      </TableBody>
    </Table>
    {isEditting && todo.id === editTodoID && (
          <form onSubmit={(event) => putTodo(event, todo)}>
            <Card>
              <Text>Edit task</Text>
              <TitleWrapper>
                <FieldLabel>
                  Title of task :
                  <TextInput onChange={handleEditTitleChange} value={editTitle} name="title" />
                </FieldLabel>
              </TitleWrapper>           
              <DateStatus>           
                <InputDate>
                  <FieldLabel htmlFor="date">
                    Date of task:
                    <TextInput type="date" onChange={ handleEditDateChange } name="date" value={editDate} />
                  </FieldLabel>
                </InputDate>
                <SelectStaus>
                  <FieldLabel htmlFor="status">
                    Status:
                    <Select name="status" value={editStatus} onChange={handleEditStatusChange} >
                      <option value="To Do">To Do</option>
                      <option value="InProgress">In Progress</option>
                      <option value="InReview">In Review</option>
                      <option value="Done">Done</option>
                    </Select>
                  </FieldLabel>
                </SelectStaus>
              </DateStatus>   
              <DescriptionWrapper>
                <FieldLabel>
                  Description:
                  <TextArea
                    onChange={handleEditDescChange}
                    value={editDescription}
                    name="description"
                  />
                </FieldLabel>
              </DescriptionWrapper>
              
              <FormButtonsWrapper>
                <CancelButton
                  onClick={() => setEdit(false)}        
                >
                  Cancel
                </CancelButton>
                <Button
                  type="submit"
                  backgroundColor={colors.indigo600}
                  textColor={colors.white}
                  hoverBackgroundColor={colors.indigo500}
                  activeBackgroundColor={colors.indigo600}
                >
                  Update task
                </Button>
              </FormButtonsWrapper>
            </Card>
          </form>
        )}
  </Wrapper>
);

export default todo;
