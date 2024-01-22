import React, { useEffect, useState, useRef } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBTypography, MDBInputGroup } from 'mdb-react-ui-kit';
import './Chats.css';
import { useLocation } from 'react-router-dom';
import { TextField, Button, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import CircularProgress from '@mui/material/CircularProgress';
import Page from '../admin/components/Page';
import axiosInstance from '../config/AxiosInstance';

export default function App() {
  const { state } = useLocation();
  console.log('state', state);
  const [chatedUsers, setChatedUsers] = useState([]);
  console.log('chatedUsers', chatedUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [loggedInUsername, setLoggedInUsername] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const loggedInUserId = JSON.parse(localStorage.getItem('decodedToken'))?.userId?.user_id;
  const chatContainerRef = useRef(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    const fetchChatedUsers = async () => {
      try {
        const response = await axiosInstance.get(`/signup/signup/users/${loggedInUserId}/chatedallusers`);
        const userDetails = await Promise.all(
          response.data.chatedUsers.map(async (userId) => {
            const userResponse = await axiosInstance.get(`/signup/allusers/${userId}`);

            const unreadMessagesResponse = await axiosInstance.get(
              `/chatuser/chatuser/unread-messages/${loggedInUserId}/${userId}`
            );

            const unreadMessagesCount = unreadMessagesResponse.data.unreadMessagesCount || 0;

            setUnreadMessagesCount((prevCounts) => ({
              ...prevCounts,
              [userId]: unreadMessagesCount,
            }));

            return {
              ...userResponse.data,
              unreadMessagesCount,
            };
          })
        );

        setChatedUsers(userDetails);
        setLoading(false);

        // Check if state.user_id exists and set the selectedUser
        if (state && state.user_id) {
          const selectedUser = state.user_id;
          setSelectedUser(selectedUser);
        }
      } catch (error) {
        console.error('Error fetching chated users:', error);
        setLoading(false);
      }
    };

    const fetchLoggedInUser = async () => {
      try {
        const response = await axiosInstance.get(`/signup/allusers/${loggedInUserId}`);
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
          // Fetch messages
          const response = await axiosInstance.get(
            `/chatuser/chatuser/chat-messages/${loggedInUserId}/${selectedUser}`
          );
          setMessages(response.data.data);
          fetchUsers(response.data.data);
          setLoading(false);
          scrollToBottom(); // Scroll to the bottom after updating messages

          // Mark messages as read when the chat opens
          await axiosInstance.put(`/chatuser/chatuser/mark-messages-as-read/${loggedInUserId}/${selectedUser}`);

          // Update unread messages count
          setUnreadMessagesCount((prevCounts) => ({
            ...prevCounts,
            [selectedUser]: 0,
          }));
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

        const notificationPayload = {
          receiver_id: selectedUser,
          sender_id: loggedInUserId,
        };

         const responce = await axiosInstance.post('/notification/notifications', notificationPayload);
        console.log('responce', responce)
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
      const response = await axiosInstance.get('/signup/allusers', { params: { userIds } });

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

  // const getSenderFullName = (senderId) => {
  //   const user = users[senderId];
  //   return user ? `${user.firstname} ${user.lastname}` : '';
  // };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const currentDate = new Date();
    const isSameDay = date.toDateString() === currentDate.toDateString();

    // Calculate if the message was sent within the last 24 hours
    const isYesterday = Math.abs(currentDate - date) < 86400000; // 86400000 milliseconds in a day

    if (isSameDay) {
      // Display time only for messages sent today
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      return `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
    }

    if (isYesterday) {
      // Display 'Yesterday' for messages sent within the last 24 hours
      return 'Yesterday';
    }

    // Display date and time for messages sent on previous days
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
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
    const username = userDetail.username.toLowerCase();

    return fullName.includes(searchQuery.toLowerCase()) || username.includes(searchQuery.toLowerCase());
  });

  const [userAvatarColors, setUserAvatarColors] = useState(() => {
    // Try to retrieve colors from localStorage
    const storedColors = localStorage.getItem('userAvatarColors');
    return storedColors ? JSON.parse(storedColors) : {};
  });

  const getRandomColor = (userId) => {
    // If color for user already generated, return it
    if (userAvatarColors[userId]) {
      return userAvatarColors[userId];
    }

    const getLightColor = () => {
      const letters = 'ABCDEF';
      let lightColor = '#';
      for (let i = 0; i < 3; i += 1) {
        lightColor += letters[Math.floor(Math.random() * 6)]; // Use only lighter colors (A to F)
      }
      return lightColor;
    };

    const getBrightColor = () => {
      const letters = '123456';
      let brightColor = '#';
      for (let i = 0; i < 3; i += 1) {
        brightColor += letters[Math.floor(Math.random() * 6)]; // Use only bright colors (1 to 6)
      }
      return brightColor;
    };

    const colors = {
      background: getLightColor(),
      text: getBrightColor(),
    };

    const updatedColors = {
      ...userAvatarColors,
      [userId]: colors,
    };
    setUserAvatarColors(updatedColors);

    // Save colors to localStorage
    localStorage.setItem('userAvatarColors', JSON.stringify(updatedColors));
    return colors;
  };

  return (
    <Page title="Chated User" style={{ overflowY: 'hidden', overflowX: 'hidden' }}>
      <div className="body-hidden-overflow">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress color="primary" />
          </div>
        ) : (
          <>
            <MDBContainer fluid className="py-2">
              <MDBRow>
                <MDBCol md="12">
                  <MDBCard id="chat3" style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <MDBCardBody>
                      <MDBRow>
                        <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0" style={{ borderRight: '1px solid #ddd' }}>
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
                                          const userId = userData.data.user_id;

                                          const isSelected = userId === selectedUser;
                                          const colors = getRandomColor(userId);

                                          return (
                                            <div
                                              key={index}
                                              onClick={() => handleUserClick(userDetail.user_id)}
                                              onKeyPress={(e) => {
                                                if (e.key === 'Enter') handleUserClick(userDetail.user_id);
                                              }}
                                              role="button"
                                              tabIndex={0}
                                              className="d-flex align-items-center mb-1 user-list"
                                              style={{
                                                cursor: 'pointer',
                                                borderBottom: '1px solid #ddd',
                                                paddingTop: '10px',
                                                paddingBottom: '10px',
                                                transition: 'background-color 0.3s',
                                                backgroundColor: isSelected ? '#e0f7fa' : '#fff',
                                                borderRadius: '8px', // Add border-radius for a rounded look
                                              }}
                                            >
                                              <div className="d-flex flex-row align-items-center">
                                                <div
                                                  className="circle-avatar me-2"
                                                  style={{
                                                    fontSize: '1.2em',
                                                    color: isSelected ? 'brown' : colors.text,
                                                    textTransform: 'uppercase',
                                                    borderRadius: '50%',
                                                    width: '50px',
                                                    height: '50px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: colors.background,
                                                  }}
                                                >
                                                  {`${userDetail.firstname ? userDetail.firstname.charAt(0) : 'U'}${
                                                    userDetail.lastname ? userDetail.lastname.charAt(0) : 'U'
                                                  }`}
                                                </div>

                                                <div className="d-flex flex-column ms-2">
                                                  <div className="font-weight-bold">
                                                    {`${userDetail.firstname
                                                      .charAt(0)
                                                      .toUpperCase()}${userDetail.firstname.slice(
                                                      1
                                                    )} ${userDetail.lastname
                                                      .charAt(0)
                                                      .toUpperCase()}${userDetail.lastname.slice(1)}` || 'Unknown User'}
                                                  </div>

                                                  <div className="text-muted">
                                                    {`${userDetail.username}` || 'Unknown User'}
                                                  </div>
                                                </div>
                                              </div>
                                              <div
                                                style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}
                                              >
                                                {unreadMessagesCount[userId] > 0 && (
                                                  <div
                                                    style={{
                                                      backgroundColor: 'gray',
                                                      color: 'white',
                                                      padding: '2px 12px', // Adjust padding for better appearance
                                                      borderRadius: '10px', // Add border-radius for rounded corners
                                                      fontWeight: 'bold', // Make text bold
                                                    }}
                                                  >
                                                    {unreadMessagesCount[userId]}
                                                  </div>
                                                )}
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
                          xl="8"
                          className="overflow-auto"
                          style={{ maxHeight: '550px' }}
                          ref={chatContainerRef}
                        >
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
                                      className="font-weight-bold"
                                      style={{ borderBottom: '1px solid #ddd' }}
                                    >
                                      {`${users[selectedUser]?.firstname?.charAt(0).toUpperCase()}${users[
                                        selectedUser
                                      ]?.firstname?.slice(1)} ${users[selectedUser]?.lastname
                                        ?.charAt(0)
                                        .toUpperCase()}${users[selectedUser]?.lastname?.slice(1)}` || 'Unknown User'}
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
                                      {messages.map((message) => (
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
                                              padding: '8px',
                                              marginLeft: message.sender_id === loggedInUserId ? 'auto' : '0',
                                            }}
                                          >
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                              <p className="mb-0">{message.message}</p>
                                              <p
                                                style={{
                                                  fontSize: '0.8rem',
                                                  color: '#7777',
                                                  marginLeft: '15px',
                                                  marginTop: '10px',
                                                }}
                                              >
                                                {formatTime(message.createAt)}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                      <div
                                        className="sticky-bottom"
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          borderTop: '1px solid #ddd',
                                          padding: '10px',
                                          backdropFilter: 'blur(10px)',
                                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        }}
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
      </div>
    </Page>
  );
}