const express = require('express')
let books = require('./booksdb.js')
let isValid = require('./auth_users.js').isValid
let users = require('./auth_users.js').users
const public_users = express.Router()

public_users.post('/register', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' })
  }
  if (!isValid(username)) {
    users.push({ username: username, password: password })
    console.log(users)
    return res.status(200).json({ message: 'User registered successfully' })
  } else {
    return res.status(409).json({ message: 'Username already exists' })
  }
})

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(300).json(JSON.stringify(books))
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn

  if (books[isbn]) {
    res.send(books[isbn])
  } else {
    res.status(404).send('Book not found')
  }
})

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author
  const result = []

  for (const isbn in books) {
    if (books[isbn].author === author) {
      result.push(books[isbn])
    }
  }

  res.send(result)
})

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title
  const result = []

  for (const isbn in books) {
    if (books[isbn].title === title) {
      result.push(books[isbn])
    }
  }

  res.send(result)
})

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn

  if (books[isbn]) {
    res.send(books[isbn].reviews)
  } else {
    res.status(404).send('Book not found')
  }
})

module.exports.general = public_users
