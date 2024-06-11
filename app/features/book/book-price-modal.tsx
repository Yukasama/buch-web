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
import { useState } from 'react'
import { Buch } from '~/lib/validators/book'

export const BookPriceModal = ({ buch }: Readonly<{ buch: Buch }>) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [onSale, setOnSale] = useState(buch.rabatt !== 0)

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
              <Flex gap={3}>
                <Box>
                  <FormLabel>Price in €</FormLabel>
                  <Input name="preis" type="number" defaultValue={buch.preis} />
                </Box>
                <Box>
                  <Flex>
                    <FormLabel>On Sale</FormLabel>
                    <Checkbox
                      mb={2}
                      onChange={() => setOnSale(!onSale)}
                      defaultChecked={onSale}
                    />
                  </Flex>
                  <Input
                    name="rabatt"
                    disabled={!onSale}
                    type="number"
                    value={onSale ? buch.rabatt : 0}
                    defaultValue={buch.rabatt}
                  />
                </Box>
              </Flex>
              <Flex alignItems="center">
                <FormLabel>In Stock</FormLabel>
                <Checkbox
                  mb={2}
                  name="lieferbar"
                  defaultChecked={!!buch.lieferbar}
                />
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
