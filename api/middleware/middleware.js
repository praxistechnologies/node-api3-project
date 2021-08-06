const Users = require('../users/users-model');

function logger(req, res, next) {
  // DO YOUR MAGIC
  const date = new Date();
  console.log(`
  METHOD: ${req.method}, 
  URL: ${req.baseUrl}, 
  TIMESTAMP: ${date.toLocaleString()}`)
  next()
}

// ${new Date(Date.now())}

function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  const { id } = req.params;
  Users.getById(id)
  .then(user => {
    if(user) {
      req.user = user
      next()
    } else {
      next({
        status: 404,
        message: "user not found"
      })
    }
  })
  .catch(next)
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const { name } = req.body;
  if (!name) {
    res.status(400).json({
      message: "missing required name field"
    })
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const { text } = req.body
  if (!text) {
    res.status(400).json({
      message: "missing required text field"
    })
  } else {
    next()
  }
}

function notFound(req, res, next) {
  res.status(404).json({
    message: 'not found, sorry!'
  })
}

function errorHandling(err, req, res, next) {
  const status = err.status || 500
  res.status(status).json({
    message: err.message
  })
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
  notFound,
  errorHandling
}