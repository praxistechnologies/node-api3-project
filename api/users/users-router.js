const express = require('express');
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

const Users = require('./users-model');
const Posts = require('../posts/posts-model');

const { validateUserId, validateUser, validatePost } = require('../middleware/middleware');

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
  .then(users => {
    res.status(200).json(users);
  })
  .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  const { name } = req.body
  Users.insert({name})
  .then(newUser => {
    res.status(201).json(newUser)
  })
  .catch(next)
});

router.put('/:id', validateUserId, validateUser, async (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const { id } = req.params
    const { name } = req.body
    const updatedUser = await Users.update(id, { name })
    res.status(200).json(updatedUser)
  } catch (err) {
    next(err)
  }
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try{
    const { id } = req.params
    const count = await Users.remove(id)
    if (count === 1) {
      res.json(req.user)
    } else {
      next({
        status: 500,
        message: "unable to delete user"
      })
    }
  } catch (err) {
    next(err)
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try {
    const { id } = req.params
    const posts = await Users.getUserPosts(id)
    res.json(posts)
  } catch (err) {
    next(err)
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const user_id = req.params.id
    const { text } = req.body
    console.log(req.params)
    const newPost = await Posts.insert({ text, user_id })
    res.json(newPost)
  } catch (err) {
    next(err)
  }
});

// do not forget to export the router
module.exports = router;