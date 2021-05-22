import React, { useState, useEffect } from 'react'
import { BookDescription } from './BookDescription';
import BookSearchItem from './BookSearchItem';

function buildSealchUrl(title: string, author: string, maxResults: number): string {
  let url = "https://www.googleapis.com/books/v1/volumes?q=";
  const conditions: string[] = []
  if (title) {
    conditions.push(`intitle:${title}`)
  }
  if (author) {
    conditions.push(`intitle:${author}`)
  }
  return url + conditions.join('+') + `&maxRsults=${maxResults}`
}

function extractBooks(json: any): BookDescription[] {
  const items: any[] = json.items;
  return items.map((item: any) => {
    const volumeInfo: any = item.volumeInfo
    return {
      title: volumeInfo.title,
      authors: volumeInfo.authors ? volumeInfo.authors.join(', ') : "",
      thumbnail: volumeInfo.imageLinks ? volumeInfo.imageLinks.smallThumbnail : "",
    }
  })
}

type BookSearchDialogProps = {
  maxResult: number
  onBookAdd: (book: BookDescription) => void
}

const BookSearchDialog = (props: BookSearchDialogProps) => {
  const [books, setBooks] = useState([] as BookDescription[])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (isSearching) {
      const url = buildSealchUrl(title, author, props.maxResult)
      fetch(url)
        .then((res) => {
          return res.json()
        })
        .then((json) => {
          return extractBooks(json)
        })
        .then((books) => {
          setBooks(books)
        })
        .catch((err) => {
          console.error(err)
        })
    }
    setIsSearching(false)
  }, [isSearching])

  const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleAuthorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleSearchClick = () => {
    if (!title && !author) {
      alert("条件を入力して下さい")
      return;
    }
    // 検索実行
    setIsSearching(true)
  }

  const handleBookAdd = (book: BookDescription) => {
    props.onBookAdd(book)
  }

  const bookItems = books.map((b, idx) => {
    return (
      <BookSearchItem
        description={b}
        onBookAdd={(b) => handleBookAdd(b)}
        key={idx}
      />
    )
  })

  return (
    <div className="dialog">
      <div className="operation">
        <div className="condition">
          <input
            type="text"
            onChange={handleTitleInputChange}
            placeholder="タイトルで検索"
          />
          <input
            type="text"
            onChange={handleAuthorInputChange}
            placeholder="著者で検索"
          />
        </div>
        <button className="button-like" onClick={handleSearchClick}>
          検索
        </button>
      </div>
      <div className="search-result">{bookItems}</div>
    </div>
  )
}

export default BookSearchDialog
