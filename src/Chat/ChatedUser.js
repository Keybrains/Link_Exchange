import React, { useEffect, useState, useRef } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTypography,
  MDBInputGroup,
} from 'mdb-react-ui-kit';
import { Grid, TextField, Button, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import CircularProgress from '@mui/material/CircularProgress';
import Page from '../admin/components/Page';
import axiosInstance from '../config/AxiosInstance';

export default function App() {
  const [chatedUsers, setChatedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [loggedInUsername, setLoggedInUsername] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const loggedInUserId = JSON.parse(localStorage.getItem('decodedToken'))?.userId?.user_id;
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const fetchChatedUsers = async () => {
      try {
        const response = await axiosInstance.get(`/signup/signup/users/${loggedInUserId}/chatedusers`);
        const userDetails = await Promise.all(
          response.data.chatedUsers.map((userId) => axiosInstance.get(`/signup/users/${userId}`))
        );

        setChatedUsers(userDetails.map((user) => user.data));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chated users:', error);
        setLoading(false);
      }
    };

    const fetchLoggedInUser = async () => {
      try {
        const response = await axiosInstance.get(`/signup/users/${loggedInUserId}`);
        setLoggedInUsername(`${response.data.data.firstname} ${response.data.data.lastname}`);
      } catch (error) {
        console.error('Error fetching logged-in user:', error);
      }
    };

    fetchChatedUsers();
    fetchLoggedInUser();
  }, [loggedInUserId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser) {
        try {
          const response = await axiosInstance.get(
            `/chatuser/chatuser/chat-messages/${loggedInUserId}/${selectedUser}`
          );
          setMessages(response.data.data);
          fetchUsers(response.data.data);
          setLoading(false);
          scrollToBottom(); // Scroll to the bottom after updating messages
        } catch (error) {
          console.error('Error fetching messages:', error);
          setLoading(false);
        }
      }
    };

    fetchMessages();
  }, [selectedUser, loggedInUserId]);

  const handleUserClick = async (userId) => {
    setSelectedUser(userId);

    try {
      const response = await axiosInstance.get(`/chatuser/chatuser/chat-messages/${loggedInUserId}/${userId}`);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendButtonClick = async () => {
    try {
      const lastReceivedMessage = messages[messages.length - 1];

      if (lastReceivedMessage) {
        const payload = {
          receiver_id: selectedUser,
          sender_id: loggedInUserId,
          message,
        };

        const response = await axiosInstance.post('/chatuser/chat-messages', payload);

        setMessages([...messages, response.data.data]);
        setMessage('');
        // scrollToBottom(); // Scroll to the bottom after sending a message
      } else {
        console.error('No messages available to reply to.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUsers = async (messages) => {
    const userIds = messages.map((message) => message.sender_id);
    try {
      const response = await axiosInstance.get('/signup/users', { params: { userIds } });

      const usersData = {};

      response.data.data.forEach((user) => {
        usersData[user.user_id] = user;
      });

      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const getSenderFullName = (senderId) => {
    const user = users[senderId];
    return user ? `${user.firstname} ${user.lastname}` : '';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
    return formattedTime;
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = chatedUsers.filter((userData) => {
    const userDetail = userData.data;
    const fullName = `${userDetail.firstname} ${userDetail.lastname}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <Page title="Chated User">
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          <Typography variant="h4" gutterBottom style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
            Chated User
          </Typography>
          <MDBContainer fluid className="py-2">
            <MDBRow>
              <MDBCol md="11">
                <MDBCard id="chat3" style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <MDBCardBody>
                    <MDBRow>
                      <MDBCol md="6" lg="5" xl="3" className="mb-4 mb-md-0" style={{ borderRight: '1px solid #ddd' }}>
                        <div className="p-3">
                          <MDBInputGroup className="rounded mb-3">
                            <input
                              className="form-control rounded mb-3"
                              placeholder="Search Users"
                              type="search"
                              value={searchQuery}
                              onChange={handleSearchInputChange}
                            />
                            {/* <span className="input-group-text border-0" id="search-addon">
                        <MDBIcon fas icon="search" />
                      </span> */}
                          </MDBInputGroup>
                          <div className="w-100">
                            <MDBTypography listUnStyled className="mb-0 w-100">
                              <div className="w-100" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                                <MDBTypography listUnStyled className="mb-0 w-100">
                                  {loading ? (
                                    <div
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '80vh',
                                      }}
                                    >
                                      <CircularProgress color="primary" />
                                    </div>
                                  ) : (
                                    <>
                                      {filteredUsers.map((userData, index) => {
                                        const userDetail = userData.data;
                                        return (
                                          <div
                                            key={index}
                                            onClick={() => handleUserClick(userDetail.user_id)}
                                            onKeyPress={(e) => {
                                              if (e.key === 'Enter') handleUserClick(userDetail.user_id);
                                            }}
                                            role="button"
                                            tabIndex={0}
                                            className="d-flex align-items-center mb-3 user-list"
                                            style={{ cursor: 'pointer' }}
                                          >
                                            <div className="d-flex flex-row">
                                              <div>
                                                <FontAwesomeIcon
                                                  icon={faUser}
                                                  className="me-2"
                                                  style={{ fontSize: '2.5em', color: '#B1D4E0' }}
                                                />
                                              </div>
                                              <div className="pt-1 text-uppercase font-weight-bold">
                                                {`${userDetail.firstname} ${userDetail.lastname}` || 'Unknown User'}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </>
                                  )}
                                </MDBTypography>
                              </div>
                            </MDBTypography>
                          </div>
                        </div>
                      </MDBCol>
                      <hr className="d-md-none" style={{ width: '100%', border: '1px solid #ddd' }} />

                      <MDBCol
                        md="6"
                        lg="7"
                        xl="9"
                        className="overflow-auto"
                        style={{ maxHeight: '450px' }}
                        ref={chatContainerRef}
                      >
                        {loading ? (
                          <div
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}
                          >
                            <CircularProgress color="primary" />
                          </div>
                        ) : (
                          <>
                            {selectedUser ? (
                              <>
                                <div
                                  className="mb-3 sticky-top"
                                  style={{
                                    backdropFilter: 'blur(10px)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    padding: '10px',
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    className="text-uppercase font-weight-bold"
                                    style={{ textTransform: 'capitalize', borderBottom: '1px solid #ddd' }}
                                  >
                                    {`${users[selectedUser]?.firstname} ${users[selectedUser]?.lastname}` ||
                                      'Unknown User'}
                                  </Typography>
                                </div>
                                <hr className="d-md-none" style={{ width: '100%', border: '1px solid #ddd' }} />
                                {messages.length === 0 ? (
                                  <div>
                                    <Typography variant="h6" color="textSecondary">
                                      No messages to display.
                                    </Typography>
                                  </div>
                                ) : (
                                  <>
                                    {messages.map((message, index) => (
                                      <div
                                        key={message._id}
                                        className={`d-flex justify-content-${
                                          message.sender_id === loggedInUserId ? 'flex-end' : 'flex-start'
                                        } mb-3`}
                                      >
                                        <div
                                          style={{
                                            maxWidth: '70%',
                                            borderRadius: '10px',
                                            backgroundColor:
                                              message.sender_id === loggedInUserId ? '#DCF8C6' : 'lightgray ',
                                            padding: '10px',
                                            marginLeft: message.sender_id === loggedInUserId ? 'auto' : '0',
                                          }}
                                        >
                                          <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <p className="mb-0">{message.message}</p>
                                            <p
                                              style={{
                                                fontSize: '0.8rem',
                                                color: '#777',
                                                marginLeft: '10px',
                                                marginTop: '5px',
                                              }}
                                            >
                                              {formatTime(message.createAt)}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    <div
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderTop: '1px solid #ddd',
                                        padding: '10px',
                                        backdropFilter: 'blur(10px)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                      }}
                                      className="sticky-bottom"
                                    >
                                      <TextField
                                        label="Your Message"
                                        variant="outlined"
                                        fullWidth
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendButtonClick();
                                          }
                                        }}
                                        style={{ marginRight: '10px' }}
                                      />

                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSendButtonClick}
                                        style={{ backgroundColor: '#128C7E', color: '#FFF' }}
                                      >
                                        Send
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </>
                            ) : (
                              <div className="text-center justify-content-center mt-5">
                                <FontAwesomeIcon icon={faUser} style={{ fontSize: '3em', color: 'black' }} />
                                <Typography variant="h6" className="mt-3">
                                  Welcome, {loggedInUsername || 'Unknown User'}
                                </Typography>
                              </div>
                            )}
                          </>
                        )}
                      </MDBCol>
                    </MDBRow>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </>
      )}
    </Page>
  );
}
