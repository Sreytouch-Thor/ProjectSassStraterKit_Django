import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { Spin, message } from 'antd';

import AuthContext from '../../../utils/authContext';
import getOrgId from '../../../utils/orgId';
import ApiContext from '../../../utils/apiContext';
import { colors } from '../../../styles/theme';
import axios from '../../../services/axios';
import { sendEventToAnalytics } from '../../../services/analytics';

import Button from '../../../components/Common/buttons/SecondaryButton';
import Card from '../../../components/Common/Card';
import FieldLabel from '../../../components/Common/forms/FieldLabel';
import TextArea from '../../../components/Common/forms/TextArea';
import TextInput from '../../../components/Common/forms/TextInput';
import Select from '../../../components/Common/forms/SelectStatus';
const Title = styled.h1`
  font-size: 1.5rem;
`;

const InputWrapper = styled.div`
  padding: 1rem;
`;
const SelectStatus = styled.div`
  padding: 0 1rem;
`;
const InputDate = styled.div`
  padding: 0 1rem;
`;

const TextAreaWrapper = styled.div`
  padding: 1rem;
`;

const ButtonWrapper = styled.div`
  padding:  1rem;
  background-color: ${colors.white};
  text-align: left;
`;

const CreateTask = () => {
  const org_id = getOrgId();

  const [formTitle, setTitle] = useState('');
  const [formDescription, setDescription] = useState('');
  const [formStatus, setStatus] = useState('');
  const [formDate, setDate] = useState('');
  const { fetchFailure, fetchInit, fetchSuccess, apiState } = useContext(ApiContext);
  const { isLoading } = apiState;
  const { authState } = useContext(AuthContext);
  let token = authState?.user.jwt_token;
  const headers = { Authorization: `Bearer ${token}` };
  const postTodo = async (event) => {
    event.preventDefault();
    fetchInit();
  
    let author = authState?.user.username;
    let title = event.target.title.value;
    let description = event.target.description.value;
    let status = event.target.status.value;
    let date = event.target.date.value; 
    let data = { title, description, author, org_id, status, date };
  
    try {
      await axios.post(`/api/post/todo`, data, { headers });
      sendEventToAnalytics('create_todo', { description: 'user created todo' });
      setTitle('');
      setDescription('');
      setStatus('');
      setDate('');
      message.success('Todo Created');
      fetchSuccess();
    } catch (error) {
      fetchFailure(error);
      message.error('Failed to create todo');
    }
  };
   const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescChange = (event) => {
    setDescription(event.target.value);
  };

  return (
    <div>
      <Title>Create Todo List</Title>
      <form onSubmit={postTodo}>
        <Card>
          <Spin tip="Loading..." spinning={isLoading}>
            <InputWrapper>
              <FieldLabel htmlFor="title">
                Title of task :
                <TextInput onChange={handleTitleChange} value={formTitle} name="title" />
              </FieldLabel>
            </InputWrapper>
            <InputDate>
              <FieldLabel htmlFor="date">
                Date of task:
              <TextInput type="date" name="date" value={formDate} onChange={handleDateChange} />   
              </FieldLabel>
            </InputDate>
            <TextAreaWrapper>
              <FieldLabel htmlFor="description">
                Description
                <TextArea onChange={handleDescChange} value={formDescription} name="description" />
              </FieldLabel>
            </TextAreaWrapper>
            <SelectStatus>
              <FieldLabel htmlFor="status">
              Status:
              <Select  name="status" value={formStatus} onChange={handleStatusChange}>
                <option value="">Select Status</option>
                <option value="To Do">To Do</option>
                <option value="InProgress">In Progress</option>
                <option value="InReview">In Review</option>
                <option value="Done">Done</option>
              </Select>
              </FieldLabel>
            </SelectStatus>

            <ButtonWrapper>
              <Button
                textColor={colors.white}
                backgroundColor={colors.indigo600}
                hoverBackgroundColor={colors.indigo500}
                activeBackgroundColor={colors.indigo600}
              >
                Save
              </Button>
            </ButtonWrapper>
          </Spin>
        </Card>
      </form>
    </div>
  );
};

export default CreateTask;