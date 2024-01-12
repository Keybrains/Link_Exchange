import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Card,
  Button,
  TextField,
  DialogContent,
  DialogTitle,
  Dialog,
} from '@mui/material';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn,
  MDBTypography,
  MDBCardHeader,
} from 'mdb-react-ui-kit';
import axiosInstance from '../config/AxiosInstance';

export default function Discussions() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState({});
  const decodedToken = localStorage.getItem('decodedToken');
  const parsedToken = JSON.parse(decodedToken);
  const currentUserId = parsedToken.userId?.user_id;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get('/chatuser/chat-messages');
        setMessages(response.data.data);
        fetchUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const fetchUsers = async (messages) => {
    const userIds = messages.map((message) => message.sender_id);
    try {
      const response = await axiosInstance.get('/signup/users', { userIds });
      const usersData = {};

      response.data.data.forEach((user) => {
        usersData[user.user_id] = user;
      });

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const getSenderFullName = (senderId) => {
    const user = users[senderId];
    return user && user.user_id === senderId ? `${user.firstname} ${user.lastname}` : '';
  };

  const handleSendButtonClick = async () => {
    const decodedToken = localStorage.getItem('decodedToken');
    const parsedToken = JSON.parse(decodedToken);
    const userId = parsedToken.userId?.user_id;

    try {
      const lastReceivedMessage = messages[messages.length - 1];

      if (lastReceivedMessage) {
        const payload = {
          receiver_id: lastReceivedMessage.sender_id,
          sender_id: userId,
          message,
        };

        const response = await axiosInstance.post('/chatuser/chat-messages', payload);

        console.log('Message sent successfully:', response.data);

        setMessages([...messages, response.data.data]);
        fetchUsers([...messages, response.data.data]);
      } else {
        console.error('No messages available to reply to.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <MDBContainer fluid className="py-5">
      <MDBRow>
        <MDBCol md="6" lg="7" xl="8">
          <MDBTypography listUnStyled>
            {messages.map((message) => (
              <li
                key={message._id}
                className={`d-flex justify-content-${message.sender_id === currentUserId ? 'end' : 'start'} mb-4`}
              >
                <MDBCard className={`${message.sender_id === currentUserId ? 'text-end' : 'text-start'} w-75`}>
                  <MDBCardHeader className="d-flex justify-content-between p-3">
                    <p className="fw-bold mb-0">{getSenderFullName(message.sender_id)}</p>
                    <p className="text-muted small mb-0">
                      <MDBIcon far icon="clock" /> 10 mins ago
                    </p>
                  </MDBCardHeader>
                  <MDBCardBody>
                    <p className="mb-0">{message.message}</p>
                  </MDBCardBody>
                </MDBCard>
              </li>
            ))}
            <TextField
              label="Your Message"
              variant="outlined"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSendButtonClick} style={{ marginTop: '10px' }}>
              Send
            </Button>
          </MDBTypography>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
