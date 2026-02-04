const express = require('express')
const jwt = require('jsonwebtoken')
let books = require('./booksdb.js')
const regd_users = express.Router()

let users = []

const isValid = (username) => {
  if (users.some((user) => user.username === username)) {
    return true
  } else {
    return false
  }
}

const authenticatedUser = (username, password) => {
  if (
    users.some(
      (user) => user.username === username && user.password === password,
    )
  ) {
    return true
  } else {
    return false
  }
}

//only registered users can login
regd_users.post('/login', (req, res) => {
  let { username, password } = req.body

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Error logging in: Username or Password missing' })
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: username,
      },
      'fingerprint_customer',
      { expiresIn: 60 * 60 },
    )
    req.session.authorization = { accessToken }
    return res.status(200).json({ message: 'User successfully logged in' })
  } else {
    return res.status(401).json({ message: 'Invalid username or password' })
  }
})

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn
  const review = req.query.review
  const username = req.user.data
  if (books[isbn]) {
    books[isbn].reviews[username] = review
    res.send(
      'review was added successfully' + JSON.stringify(books[isbn].reviews),
    )
  } else {
    res.status(404).send('Book not found')
  }
})

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn
  const username = req.user.data
  if (books[isbn]) {
    delete books[isbn].reviews[username]
    res.send({ message: 'Review deleted successfully' })
  } else {
    res.status(404).send('Book not found')
  }
})

module.exports.authenticated = regd_users
module.exports.isValid = isValid
module.exports.users = users
