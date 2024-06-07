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
} from '@chakra-ui/react'
import { Buch } from '~/lib/validators/book'

export const UpdateInfo = ({ buch }: Readonly<{ buch: Buch }>) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

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
          <ModalBody display="flex" flexDir="column" gap={4}>
            <Box>
              <FormLabel>Title</FormLabel>
              <Input defaultValue={buch.titel.titel} />
            </Box>
            <Box>
              <FormLabel>Untertitel</FormLabel>
              <Input defaultValue={buch.titel.untertitel} />
            </Box>
            <Box>
              <FormLabel>Rating</FormLabel>
              <Input defaultValue={buch.titel.untertitel} />
            </Box>
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
