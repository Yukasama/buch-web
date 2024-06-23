import React, { useState, useEffect } from 'react'
import { Box, IconButton } from '@chakra-ui/react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  maxStars?: number
  rating: number
  setRating: (rating: number) => void
}

export const StarRating: React.FC<StarRatingProps> = ({
  maxStars = 5,
  rating,
  setRating,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const handleClick = (index: number) => {
    setRating(index + 1)
  }

  const handleMouseEnter = (index: number) => {
    setHoverIndex(index)
  }

  const handleMouseLeave = () => {
    setHoverIndex(null)
  }

  useEffect(() => {
    setHoverIndex(null)
  }, [rating])

  return (
    <Box display="flex" alignItems="center">
      {Array.from({ length: maxStars }, (_, i) => {
        const isCorrectIndex =
          i < (hoverIndex !== null ? hoverIndex + 1 : rating)

        return (
          <IconButton
            key={i}
            icon={<Star fill={isCorrectIndex ? 'yellow' : 'none'} />}
            onClick={() => handleClick(i)}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
            aria-label={`Rate ${i + 1} stars`}
            variant="unstyled"
            color={isCorrectIndex ? 'yellow.400' : 'gray.300'}
            size="sm"
            p={0}
            m={0}
            _hover={{ backgroundColor: 'transparent' }}
            _focus={{ boxShadow: 'none' }}
          />
        )
      })}
    </Box>
  )
}
