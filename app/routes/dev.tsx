import { Container, Heading, Text, Box } from '@chakra-ui/react'

export default function DevPage() {
  const boxStyles = {
    P: '10px',
    bg: 'purple',
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    border: '1px solid black',
    borderRadius: '10px',
    m: '10px',
    textalign: 'center',
    filter: 'blur(2px)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      filter: 'blur(0px)',
    },
  }

  return (
    <Container as="section" maxW="1920px" py="200px">
      <Heading my="30px" p="10px">
        Development🍆
      </Heading>
      <Text ml="30px">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis,
        excepturi.
      </Text>
      <Text mr="30px" color="blue.900" fontWeight="bold">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis,
        excepturi.
      </Text>

      <Box my="30px" p="20px" bg="green.200">
        <Text ml="30px" color="red">
          Lorem, ipsum dolor.
        </Text>
      </Box>

      <Box sx={boxStyles}>Lorem ipsum dolor sit amet.</Box>
    </Container>
  )
}
