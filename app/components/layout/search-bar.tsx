import React, { useState } from 'react'
import { Input } from '@chakra-ui/react'
import { useNavigate } from '@remix-run/react'

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim() !== '') {
      navigate(`/search?q=${searchQuery}`)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <form onSubmit={handleSearch}>
      <Input
        placeholder="Bücher suchen"
        variant="filled"
        bg="blackAlpha.900"
        value={searchQuery}
        onChange={handleChange}
      />
    </form>
  )
}

export default SearchBar
