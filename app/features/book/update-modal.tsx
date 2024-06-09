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
import { Buch } from '~/lib/validators/book'

export default function UpdateModal({ buch }: Readonly<{ buch: Buch }>) {
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
                <Input name="preis" defaultValue={buch.preis} />
              </Box>
              <Box>
                <FormLabel>On Sale</FormLabel>
                <Input name="rabatt" defaultValue={buch.rabatt} />
              </Box>
              <Flex gap={2}>
                <FormLabel>In Stock</FormLabel>
                <Checkbox name="lieferbar" defaultChecked={!!buch.lieferbar} />
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
