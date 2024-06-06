import { EditIcon } from '@chakra-ui/icons'
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
  Checkbox,
  Flex,
} from '@chakra-ui/react'
import { Buch } from '~/lib/validators/book'

export default function UpdateInfo({ book }: Readonly<{ book: Buch }>) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>
        <EditIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modify Purchase Options</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" gap={4}>
            <Box>
              <FormLabel>Price</FormLabel>
              <Input defaultValue={book.preis} />
            </Box>
            <Box>
              <FormLabel>On Sale</FormLabel>
              <Input defaultValue={book.rabatt} />
            </Box>
            <Flex gap={2}>
              <FormLabel>In Stock</FormLabel>
              <Checkbox checked={!!book.lieferbar} />
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue">Update</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
