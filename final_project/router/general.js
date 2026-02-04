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

public_users.get('/', (req, res) => {
  new Promise((resolve) => {
    resolve(books)
  })
    .then((data) => {
      res.status(200).json(data)
    })
    .catch(() => {
      res.status(500).json({ message: 'Error fetching books' })
    })
})

// Get book details based on ISBN (async/await)
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn
    const book = await Promise.resolve(books[isbn])

    if (book) return res.status(200).json(book)
    return res.status(404).send('Book not found')
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching book by ISBN' })
  }
})

// Get book details based on author (async/await)
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author

    const result = await Promise.resolve(
      Object.keys(books)
        .filter((isbn) => books[isbn].author === author)
        .map((isbn) => books[isbn]),
    )

    return res.status(200).json(result)
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching books by author' })
  }
})

// Get all books based on title (async/await)
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title

    const result = await Promise.resolve(
      Object.keys(books)
        .filter((isbn) => books[isbn].title === title)
        .map((isbn) => books[isbn]),
    )

    return res.status(200).json(result)
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching books by title' })
  }
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
