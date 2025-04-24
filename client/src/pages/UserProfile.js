import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Button,
  Divider,
  TextField,
  CircularProgress,
  Avatar,
  Tabs,
  Tab,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { fetchUserReviews } from '../redux/slices/reviewSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userReviews: reviews, loading } = useSelector((state) => state.reviews);
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    profilePicture: user?.profilePicture || '',
  });

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserReviews({ userId: user._id }));
    }
  }, [dispatch, user?._id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    // TODO: Implement profile update
    setEditMode(false);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        {/* Profile Header */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  src={user?.profilePicture}
                  alt={user?.username}
                  sx={{
                    width: 120,
                    height: 120,
                    margin: '0 auto 16px',
                  }}
                />
                {editMode ? (
                  <form onSubmit={handleProfileUpdate}>
                    <TextField
                      fullWidth
                      label="Username"
                      value={profileData.username}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          username: e.target.value,
                        })
                      }
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Profile Picture URL"
                      value={profileData.profilePicture}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          profilePicture: e.target.value,
                        })
                      }
                      margin="normal"
                    />
                    <Box sx={{ mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mr: 1 }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </form>
                ) : (
                  <>
                    <Typography variant="h5" gutterBottom>
                      {user?.username}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      {user?.email}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => setEditMode(true)}
                      sx={{ mt: 2 }}
                    >
                      Edit Profile
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{ mb: 2 }}
                >
                  <Tab label="My Reviews" />
                  <Tab label="Favorites" />
                </Tabs>

                {activeTab === 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      My Reviews ({reviews.length})
                    </Typography>
                    {reviews.map((review) => (
                      <Card key={review._id} sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            <Link
                              component={RouterLink}
                              to={`/books/${review.bookId._id}`}
                              color="inherit"
                              underline="hover"
                            >
                              {review.bookId.title}
                            </Link>
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={review.rating} readOnly size="small" />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ ml: 1 }}
                            >
                              {new Date(review.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {review.review}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Favorite Books
                    </Typography>
                    <Grid container spacing={2}>
                      {user?.favorites?.map((book) => (
                        <Grid item xs={12} sm={6} md={4} key={book._id}>
                          <Card
                            component={RouterLink}
                            to={`/books/${book._id}`}
                            sx={{
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              textDecoration: 'none',
                            }}
                          >
                            <CardMedia
                              component="img"
                              height="200"
                              image={book.coverImage || '/default-book-cover.jpg'}
                              alt={book.title}
                            />
                            <CardContent>
                              <Typography gutterBottom variant="h6">
                                {book.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                by {book.author}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default UserProfile; 