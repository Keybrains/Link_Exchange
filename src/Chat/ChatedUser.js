import React, { useEffect, useState } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTypography,
  MDBInputGroup,
  MDBCardHeader,
} from 'mdb-react-ui-kit';
import { TextField, Button, List } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../config/AxiosInstance';

export default function ChatInterface() {
  const [chatedUsers, setChatedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const decodedToken = localStorage.getItem('decodedToken');
  const parsedToken = JSON.parse(decodedToken);
  const loggedInUserId = parsedToken.userId?.user_id;

  useEffect(() => {
    const fetchChatedUsers = async () => {
      try {
        const response = await axiosInstance.get(`/signup/signup/users/${loggedInUserId}/chatedusers`);
        const chatedUserIds = response.data.chatedUsers;
        const userDetailsPromises = chatedUserIds.map(async (userId) => {
          const userResponse = await axiosInstance.get(`/signup/users/${userId}`);
          return userResponse.data;
        });

        const userDetails = await Promise.all(userDetailsPromises);

        setChatedUsers(userDetails);
      } catch (error) {
        console.error('Error fetching chated users:', error);
      }
    };

    fetchChatedUsers();
  }, [loggedInUserId]);

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const response = await axiosInstance.get(`/chatuser/chat-messages/${selectedUser.user_id}`);
          setMessages(response.data.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }
  }, [selectedUser, loggedInUserId]);

  const handleUserClick = async (user) => {
    setSelectedUser(user);

    try {
      const response = await axiosInstance.get(`/chatuser/chat-messages/${user.user_id}`);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const [users, setUsers] = useState({});

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

        // Clear the input box after sending the message
        setMessage('');
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
        <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
          <ul className="list-unstyled">
            {chatedUsers.map((userData, index) => (
              <List
                key={index}
                onClick={() => handleUserClick(userData.data)}
                className="d-flex align-items-center mb-3 user-list"
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="me-2"
                  style={{
                    fontSize: '1.3em',
                    color: '#B1D4E0',
                  }}
                />
                <MDBTypography
                  tag="span"
                  className="text-uppercase font-weight-bold"
                  style={{
                    marginLeft: '10px',
                    fontSize: '1.2em',
                    color: '#333',
                  }}
                >
                  {userData.data.firstname && userData.data.lastname
                    ? `${userData.data.firstname} ${userData.data.lastname}`
                    : 'Unknown User'}
                </MDBTypography>
              </List>
            ))}
          </ul>
        </MDBCol>

        <MDBCol md="6" lg="7" xl="8">
          <MDBCard id="chat3" style={{ borderRadius: '15px', height: '100%' }}>
            <MDBCardBody className="d-flex flex-column">
              {/* <MDBTypography tag="h4" className="mb-3">
                {selectedUser ? `${selectedUser.firstname} ${selectedUser.lastname}` : 'Select a User'}
              </MDBTypography> */}

              <div
                className="list-unstyled chat-list flex-grow-1 overflow-auto"
                style={{ maxHeight: '400px', overflowY: 'auto' }}
              >
                {messages.map((message) => (
                  <li
                    key={message._id}
                    className={`d-flex justify-content-${message.sender_id === currentUserId ? 'end' : 'start'} mb-4`}
                  >
                    <MDBCard className={`${message.sender_id === currentUserId ? 'text-end' : 'text-start'} w-75`}>
                      <MDBCardHeader className="d-flex justify-content-between p-3">
                        <p className="fw-bold mb-0">{getSenderFullName(message.sender_id)}</p>
                        <p className="text-muted small mb-0">{/* <MDBIcon far icon="clock" /> 10 mins ago */}</p>
                      </MDBCardHeader>
                      <MDBCardBody>
                        <p className="mb-0">{message.message}</p>
                      </MDBCardBody>
                    </MDBCard>
                  </li>
                ))}
              </div>

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
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
