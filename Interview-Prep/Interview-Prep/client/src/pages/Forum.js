import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Input,
  Textarea,
  useToast,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FaHeart, FaComment, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Forum = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newComment, setNewComment] = useState('');
  const [activePost, setActivePost] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      setError('Failed to fetch posts. Please try again later.');
      toast({
        title: 'Error',
        description: 'Failed to fetch posts',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please login to create a post',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (!newPost.title || !newPost.content) {
      toast({
        title: 'Error',
        description: 'Please fill in both title and content',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      const response = await axios.post('/api/posts', {
        ...newPost,
        author: user.name || 'Anonymous'
      });
      setPosts([response.data, ...posts]);
      setNewPost({ title: '', content: '' });
      toast({
        title: 'Success',
        description: 'Post created successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleAddComment = async (postId) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please login to add a comment',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (!newComment) {
      toast({
        title: 'Error',
        description: 'Please enter a comment',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      const response = await axios.post(`/api/posts/${postId}/comments`, {
        content: newComment,
        author: user.name || 'Anonymous'
      });
      
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, comments: [...post.comments, response.data] } : post
      ));
      
      setNewComment('');
      setActivePost(null);
      toast({
        title: 'Success',
        description: 'Comment added successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please login to like posts',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      await axios.post(`/api/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
      ));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to like post',
        status: 'error',
        duration: 3000,
      });
    }
  };

  if (loading) {
    return (
      <Container maxW="container.lg" py={8} centerContent>
        <Spinner size="xl" />
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* Create Post Section */}
      <Card mb={8} boxShadow="lg">
        <CardHeader>
          <Heading size="md">Create a New Post</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4}>
            <Input
              placeholder="Post Title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              size="lg"
              bg="white"
              color="black"
              _placeholder={{ color: 'gray.500' }}
            />
            <Textarea
              placeholder="Share your interview experience or ask for career advice..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              rows={4}
              size="lg"
              bg="white"
              color="black"
              _placeholder={{ color: 'gray.500' }}
            />
            <Button
              leftIcon={<FaPlus />}
              colorScheme="blue"
              onClick={handleCreatePost}
              alignSelf="flex-end"
              size="lg"
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              Create Post
            </Button>
          </VStack>
        </CardBody>
      </Card>

      {/* Posts List */}
      <VStack spacing={6} align="stretch">
        {posts.map(post => (
          <Card key={post._id} boxShadow="md" _hover={{ boxShadow: 'lg' }} transition="all 0.2s">
            <CardBody>
              <Heading size="md" mb={2}>{post.title}</Heading>
              <Text color="gray.500" fontSize="sm" mb={4}>
                Posted by {post.author} on {new Date(post.createdAt).toLocaleDateString()}
              </Text>
              <Text mb={4}>{post.content}</Text>
              
              <Divider my={4} />
              
              <HStack spacing={4} mb={4}>
                <Button
                  size="sm"
                  leftIcon={<FaHeart />}
                  onClick={() => handleLike(post._id)}
                  variant="ghost"
                  _hover={{ color: 'red.500' }}
                >
                  {post.likes || 0} Likes
                </Button>
                <Button
                  size="sm"
                  leftIcon={<FaComment />}
                  onClick={() => setActivePost(activePost === post._id ? null : post._id)}
                  variant="ghost"
                  _hover={{ color: 'blue.500' }}
                >
                  {post.comments?.length || 0} Comments
                </Button>
              </HStack>

              {/* Comments Section */}
              {activePost === post._id && (
                <VStack spacing={4} align="stretch" mt={4}>
                  {post.comments?.map(comment => (
                    <Box key={comment._id} p={4} bg="gray.50" borderRadius="md">
                      <Flex mb={2}>
                        <Avatar size="sm" name={comment.author} mr={2} />
                        <Box>
                          <Text fontWeight="bold">{comment.author}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </Text>
                        </Box>
                      </Flex>
                      <Text>{comment.content}</Text>
                    </Box>
                  ))}

                  {/* Add Comment */}
                  <Box mt={4}>
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      size="sm"
                      mb={2}
                      bg="white"
                    />
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleAddComment(post._id)}
                      _hover={{ transform: 'translateY(-1px)' }}
                      transition="all 0.2s"
                    >
                      Add Comment
                    </Button>
                  </Box>
                </VStack>
              )}
            </CardBody>
          </Card>
        ))}
      </VStack>
    </Container>
  );
};

export default Forum;
