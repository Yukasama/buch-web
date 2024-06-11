import { EditIcon, StarIcon } from '@chakra-ui/icons'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  FormLabel,
  Box,
  Text,
  Icon,
  Flex,
  Select,
  FormControl,
} from '@chakra-ui/react'
import { Star } from 'lucide-react'
import { useState } from 'react'
import { Buch } from '~/lib/validators/book'
import { Form, useActionData } from '@remix-run/react'

export const BookInfoModal = ({ buch }: Readonly<{ buch: Buch }>) => {
  const actionData = useActionData()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [rating, setRating] = useState(buch.rating)

  const KINDS = ['KINDLE', 'DRUCK']

  return (
    <>
      <Button onClick={onOpen}>
        <EditIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modify Book Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form method="post">
              <FormControl display="flex" flexDir="column" gap={4}>
                <Flex gap={3}>
                  <Box>
                    <FormLabel>Title</FormLabel>
                    <Input name="titel" defaultValue={buch.titel.titel} />
                    {actionData?.issues ? (
                      <p style={{ color: 'red' }}>{actionData?.error?.titel}</p>
                    ) : null}
                  </Box>
                  <Box>
                    <FormLabel>Untertitel</FormLabel>
                    <Input
                      name="untertitel"
                      defaultValue={buch.titel.untertitel}
                    />
                  </Box>
                </Flex>
                <Flex gap={3}>
                  <Box>
                    <FormLabel>ISBN</FormLabel>
                    <Input name="isbn" defaultValue={buch.isbn} />
                  </Box>
                  <Box>
                    <FormLabel>Homepage</FormLabel>
                    <Input name="homepage" defaultValue={buch.homepage} />
                  </Box>
                </Flex>
                <Box>
                  <FormLabel>Type</FormLabel>
                  <Select name="art" defaultValue={buch.art}>
                    <option value={buch.art}>{buch.art}</option>
                    {KINDS.filter((map) => map !== buch.art).map((kind) => (
                      <option key={kind} value={kind}>
                        {kind}
                      </option>
                    ))}
                  </Select>
                </Box>
                <Box>
                  <FormLabel>Rating</FormLabel>
                  <Flex
                    alignItems="center"
                    gap={2}
                    my={2}
                    border="1px"
                    borderColor="gray.600"
                    borderRadius="lg"
                    p={2}
                    px={4}
                  >
                    <Text fontSize="md">{rating}.0</Text>
                    {Array.from({ length: rating }, (_, i) => (
                      <StarIcon
                        key={i}
                        fill="transparent"
                        onClick={() => {
                          setRating(i + 1)
                        }}
                      />
                    ))}
                    <Box display="flex" gap={2} mt={0.4}>
                      {Array.from({ length: 5 - (rating ?? 0) }, (_, i) => (
                        <Icon
                          as={Star}
                          boxSize={18}
                          key={i + '1'}
                          onClick={() => {
                            setRating(rating + i + 1)
                          }}
                          borderRadius="lg"
                          _hover={{ cursor: 'pointer', background: 'gray' }}
                        />
                      ))}
                    </Box>
                  </Flex>
                </Box>
              </FormControl>

              <ModalFooter px={0}>
                <Button colorScheme="gray" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button colorScheme="blue" type="submit">
                  Update
                </Button>
              </ModalFooter>
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
