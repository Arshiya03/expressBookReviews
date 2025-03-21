const Axios = require("axios")
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;
  if(username&&password){
      const present = users.filter((user)=> user.username === username)
      if(present.length===0){
          users.push({"username":req.body.username,"password":req.body.password});
          return res.status(201).json({message:"USer Created successfully"})
      }
      else{
        return res.status(400).json({message:"Already exists"})
      }
  }
  else if(!username && !password){
    return res.status(400).json({message:"Bad request"})
  }
  else if(!username || !password){
    return res.status(400).json({message:"Check username and password"})
  }  

 
});

// // Get the book list available in the shop
// public_users.get('/',async (req, res) => {
//     await res.send(JSON.stringify(books,null,4));
   
//  });


// Get the book list available in the shop using async await
public_users.get('/', (req, res) => {
    const getBooks = () => {
        return new Promise((resolve,reject) => {
          setTimeout(() => {
            resolve(books);
            }, 1000);
        });
    };
    
    getBooks().then((books) => {
        res.json(books);
    }).catch((err) =>{
      res.status(500).json({error: "An error occured"});
    });
      
    //await res.send(JSON.stringify(books,null,4));
  
});


// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',async (req, res)=>{
  
//   const ISBN = req.params.isbn;
//   await res.send(books[ISBN]);    
 
//  });
  
// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', (req, res) =>{
    
    const ISBN = req.params.isbn;
    const booksArray = Object.values(books);

    const booksBasedOnIsbn = (ISBN) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const book = booksArray.find((b) => {
                    let bookIsbn = Object.keys(books).find(key => books[key] === b);
                    return bookIsbn === ISBN;
                });
                if (book) {
                    resolve(book);
                } else {
                    reject({ message: "Book not found" });
                }
            }, 1000);
        });
    };

    booksBasedOnIsbn(ISBN)
        .then((book) => {
            res.json(book);
        })
        .catch((error) => {
            res.status(404).json(error); // 404 for "Not Found"
        });
   });
    
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {

  //using promises
  const author = req.params.author.toLowerCase().trim();
    const booksArray = Object.values(books);

    const booksBasedOnAuthor = (auth) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const filteredBooks = booksArray.filter((book) => book.author.toLowerCase().trim() === auth);
                if (filteredBooks.length > 0) { // Corrected condition
                    resolve(filteredBooks);
                } else {
                    reject({ message: "No books found for this author" });
                }
            }, 1000);
        });
    };

    booksBasedOnAuthor(author)
        .then((foundBooks) => {
            res.json(foundBooks);
        })
        .catch((error) => {
            res.status(404).json(error); // 404 for "Not Found"
        });
});

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
  
  //let new_books = {}
  //const re_title = req.params.title;
  //let i = 1;
  //for(bookid in books){
    //  if(books[bookid].title === re_title ){
      //  new_books[i++] = books[bookid]
      //}
  //}
  //await res.send(JSON.stringify(new_books))

  const title = req.params.title.toLowerCase().trim();
    const booksArray = Object.values(books);

    const booksBasedOnTitle = (bookTitle) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const filteredBooks = booksArray.filter((book) => book.title.toLowerCase().trim() === bookTitle);
                if (filteredBooks.length > 0) { // Corrected condition
                    resolve(filteredBooks);
                } else {
                    reject({ message: "No books found with this title" });
                }
            }, 1000);
        });
    };

    booksBasedOnTitle(title)
        .then((foundBooks) => { //Use foundBooks
            res.json(foundBooks);
        })
        .catch((error) => {
            res.status(404).json(error); // 404 for "Not Found"
        });
  
});

//  Get book review
public_users.get('/review/:isbn',async (req, res) => {
  
  const isbn = req.params.isbn;
    await res.send(JSON.stringify(books[isbn].review),null,4);
  
});

module.exports.general = public_users;