import React, { useState } from "react";
import "./App.css";
import { BookToRead } from "./BookToRead";
import BookRow from './BookRow'
import Modal from 'react-modal'
import BookSearchDialog from './BookSearchDialog'
import { BookDescription } from './BookDescription'

Modal.setAppElement('#root')

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.8)"
  },
  constent: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: 0,
    transform: "translagte(-50%,-50%)"
  }
}

// const dummyBooks: BookToRead[] = [
//   {
//     id: 1,
//     title: "はじめてのReact",
//     authors: "ダミー",
//     memo: ""
//   },
//   {
//     id: 2,
//     title: "React Hooks入門",
//     authors: "ダミー",
//     memo: ""
//   },
//   {
//     id: 3,
//     title: "実践Reactアプリケーション開発",
//     authors: "ダミー",
//     memo: ""
//   }
// ];

const App = () => {
  const [books, setBooks] = useState([] as BookToRead[])
  const [modaliOpen, setModaliOpen] = useState(false)

  const handleAddClick = () => {
    setModaliOpen(true)
  }
  const handleModalClose = () => {
    setModaliOpen(false)
  }

  const handleBookMemoChange = (id: number, newMemo: string) => {
    const newBooks = books.map((b) => {
      return b.id === id
        ? { ...b, memo: newMemo }
        : b
    })
    setBooks(newBooks)
  }
  const handleBookDelete = (id: number) => {
    const newBooks = books.filter((b) => b.id !== id)
    setBooks(newBooks)
  }
  const bookRows = books.map((b) => {
    return (
      <BookRow
        book={b}
        key={b.id}
        onMemoChange={(id, memo) => handleBookMemoChange(id, memo)}
        onDelete={(id) => handleBookDelete(id)}
      />
    )
  })

  const handleBookAdd = (book: BookDescription) => {
    const newBook: BookToRead = { ...book, id: Date.now(), memo: "" }
    const newBooks = [...books, newBook]
    setBooks(newBooks)
    setModaliOpen(false)
  }
  return (
    <div className="App">
      <section className="nav">
        <h1>読みたい本リスト</h1>
        <div className="button-like" onClick={handleAddClick}>本を追加</div>
      </section>
      <section className="main">
        {bookRows}
      </section>
      <Modal
        isOpen={modaliOpen}
        onRequestClose={handleModalClose}
        style={customStyles}
      >
        <BookSearchDialog
          maxResult={20}
          onBookAdd={(b) => handleBookAdd(b)}
        />
      </Modal>
    </div>
  );
};

export default App;
