import React, { useState, useEffect } from 'react'
import { Box, IconButton } from '@chakra-ui/react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  maxStars?: number
  rating: number // Add rating prop
  setRating: (rating: number) => void // Add setRating prop
}

const StarRating: React.FC<StarRatingProps> = ({
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

  // Reset hoverIndex when rating prop changes
  useEffect(() => {
    setHoverIndex(null)
  }, [rating])

  return (
    <Box display="flex" alignItems="center">
      {Array.from({ length: maxStars }, (_, index) => (
        <IconButton
          key={index}
          icon={
            <Star
              fill={
                index < (hoverIndex !== null ? hoverIndex + 1 : rating)
                  ? 'yellow'
                  : 'none'
              }
            />
          }
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          aria-label={`Rate ${index + 1} stars`}
          variant="unstyled"
          color={
            index < (hoverIndex !== null ? hoverIndex + 1 : rating)
              ? 'yellow.400'
              : 'gray.300'
          }
          size="sm"
          p={0} // Remove padding
          m={0} // Remove margin
          _hover={{ backgroundColor: 'transparent' }} // Remove background color on hover
          _focus={{ boxShadow: 'none' }} // Remove focus ring
        />
      ))}
    </Box>
  )
}

export default StarRating
