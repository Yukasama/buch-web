import { useState, useEffect } from 'react'
import { Image, Flex } from '@chakra-ui/react'

const ImageCarousel = () => {
  const totalImages = 5
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Flex
      justify="center"
      align="center"
      position="relative"
      width="100%"
      height="300px"
      overflow="hidden"
      mt="10"
      mb="10"
    >
      {Array.from({ length: totalImages }).map((_, i) => {
        const position = (i - currentIndex + totalImages) % totalImages
        const isCentered = position === 1
        return (
          <Image
            key={i + '1'}
            src={`/buch${i}.jpeg`}
            position="absolute"
            left={`${position * 33.33}%`}
            width="33.33%"
            height="100%"
            objectFit="cover"
            opacity={isCentered ? 1 : 0.5}
            transition="all 0.9s ease-in-out"
            alt="Buch-Carousel"
          />
        )
      })}
    </Flex>
  )
}

export default ImageCarousel
