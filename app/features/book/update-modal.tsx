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
  Checkbox,
  Stack,
  VisuallyHiddenInput,
} from '@chakra-ui/react'
import { Star } from 'lucide-react'
import { useState } from 'react'
import { Buch } from '~/lib/validators/book'
import { Form, useActionData } from '@remix-run/react'
import { action } from '~/routes/book.$id'
import { FormMessage } from './form-message'

export const UpdateModal = ({ buch }: Readonly<{ buch: Buch }>) => {
  const actionData = useActionData<typeof action>()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [rating, setRating] = useState(buch.rating)
  const [onSale, setOnSale] = useState(buch.rabatt !== 0)

  const KINDS = ['KINDLE', 'DRUCKAUSGABE']

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
            <Form method="put">
              <Stack gap={3}>
                <Flex gap={3}>
                  <Box>
                    <FormLabel>Title</FormLabel>
                    <Input
                      name="titelwrapper"
                      defaultValue={buch.titel.titel}
                    />
                    <FormMessage actionData={actionData} field="titelwrapper" />
                  </Box>
                  <Box>
                    <FormLabel>Untertitel</FormLabel>
                    <Input
                      name="untertitelwrapper"
                      defaultValue={buch.titel.untertitel}
                    />
                    <FormMessage
                      actionData={actionData}
                      field="untertitelwrapper"
                    />
                  </Box>
                </Flex>
                <Flex gap={3}>
                  <Box>
                    <FormLabel>ISBN</FormLabel>
                    <Input name="isbn" defaultValue={buch.isbn} />
                    <FormMessage actionData={actionData} field="isbn" />
                  </Box>
                  <Box>
                    <FormLabel>Homepage</FormLabel>
                    <Input name="homepage" defaultValue={buch.homepage} />
                    <FormMessage actionData={actionData} field="homepage" />
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
                    {Array.from({ length: 5 }, (_, i) => (
                      <>
                        {i < rating ? (
                          <StarIcon
                            key={i + 'b'}
                            onClick={() => setRating(i + 1)}
                            cursor="pointer"
                          />
                        ) : (
                          <Icon
                            key={i + 'a'}
                            boxSize={18}
                            as={Star}
                            onClick={() => setRating(i + 1)}
                            borderRadius="lg"
                            _hover={{ cursor: 'pointer', background: 'gray' }}
                          />
                        )}
                      </>
                    ))}
                    <VisuallyHiddenInput
                      name="rating"
                      value={rating}
                      defaultValue={buch.rating}
                    />
                  </Flex>
                </Box>
                <Flex gap={3}>
                  <Box>
                    <FormLabel>Price in €</FormLabel>
                    <Input name="preis" defaultValue={buch.preis} />
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
              </Stack>

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
