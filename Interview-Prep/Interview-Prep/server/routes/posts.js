const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
  likePost
} = require('../controllers/forumController');

// Get all posts
router.get('/', getPosts);

// Get single post
router.get('/:id', getPost);

// Create post
router.post('/', createPost);

// Update post
router.patch('/:id', updatePost);

// Delete post
router.delete('/:id', deletePost);

// Add comment to post
router.post('/:id/comments', addComment);

// Like a post
router.post('/:id/like', likePost);

module.exports = router; 