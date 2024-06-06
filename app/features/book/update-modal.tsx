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
import { Form } from '@remix-run/react'
import { Buch } from '~/graphql/__generated__/graphql'

export default function UpdateModal({ book }: Readonly<{ book: Buch }>) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>
        <EditIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modify Purchase Options</ModalHeader>
          <ModalCloseButton />
          <Form method="post">
            <ModalBody display="flex" flexDir="column" gap={4}>
              <Box>
                <FormLabel>Price</FormLabel>
                <Input name="preis" defaultValue={book.preis} />
              </Box>
              <Box>
                <FormLabel>On Sale</FormLabel>
                <Input name="rabatt" defaultValue={book.rabatt} />
              </Box>
              <Flex gap={2}>
                <FormLabel>In Stock</FormLabel>
                <Checkbox name="lieferbar" defaultChecked={!!book.lieferbar} />
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button colorScheme="blue" type="submit">
                Update
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    </>
  )
}
