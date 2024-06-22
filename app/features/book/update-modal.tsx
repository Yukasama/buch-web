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
  Text,
  Icon,
  Flex,
  Select,
  Checkbox,
  Stack,
  VisuallyHiddenInput,
  Badge,
} from '@chakra-ui/react'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Buch } from '~/lib/validators/book'
import { Form, useActionData } from '@remix-run/react'
import { action } from '~/routes/book.$id'
import { FormMessage } from './form-message'

export const UpdateModal = ({ buch }: Readonly<{ buch: Buch }>) => {
  const actionData = useActionData<typeof action>()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [rating, setRating] = useState(buch.rating)
  const [version, setVersion] = useState(buch.version)

  const KINDS = ['KINDLE', 'DRUCKAUSGABE']

  useEffect(() => {
    if (actionData?.version) {
      setVersion(actionData.version)
    }
  }, [actionData])

  return (
    <>
      <Button onClick={onOpen}>
        <EditIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modify Book Information</ModalHeader>
          <Badge alignSelf="center" colorScheme="red">
            {actionData?.error}
          </Badge>
          <ModalCloseButton />
          <ModalBody>
            <Form method="put">
              <VisuallyHiddenInput name="version" value={version} />
              <Stack gap={3}>
                <Flex gap={3}>
                  <Box>
                    <FormLabel>Title</FormLabel>
                    <Input
                      name="titelwrapper"
                      defaultValue={buch.titel.titel}
                    />
                    <FormMessage
                      // @ts-expect-error ts-remix-type-issue
                      errors={actionData?.errors}
                      field="titelwrapper"
                    />
                  </Box>
                  <Box>
                    <FormLabel>Untertitel</FormLabel>
                    <Input
                      name="untertitelwrapper"
                      defaultValue={buch.titel.untertitel}
                    />
                    <FormMessage
                      // @ts-expect-error ts-remix-type-issue
                      errors={actionData?.errors}
                      field="untertitelwrapper"
                    />
                  </Box>
                </Flex>
                <Flex gap={3}>
                  <Box>
                    <FormLabel>ISBN</FormLabel>
                    <Input name="isbn" defaultValue={buch.isbn} />
                    {/* @ts-expect-error ts-remix-type-issue */}
                    <FormMessage errors={actionData?.errors} field="isbn" />
                  </Box>
                  <Box>
                    <FormLabel>Homepage</FormLabel>
                    <Input name="homepage" defaultValue={buch.homepage} />
                    {/* @ts-expect-error ts-remix-type-issue */}
                    <FormMessage errors={actionData?.errors} field="homepage" />
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
                    <Text fontSize="md" w={6}>
                      {rating}.0
                    </Text>
                    {Array.from({ length: 5 }, (_, i) => (
                      <>
                        {i < rating ? (
                          <Icon
                            key={i + 'b'}
                            boxSize={18}
                            as={Star}
                            onClick={() => setRating(i + 1)}
                            cursor="pointer"
                            fill="white"
                          />
                        ) : (
                          <Icon
                            key={i + 'a'}
                            boxSize={18}
                            as={Star}
                            onClick={() => setRating(i + 1)}
                            _hover={{
                              cursor: 'pointer',
                              fill: 'white',
                            }}
                          />
                        )}
                      </>
                    ))}
                    <VisuallyHiddenInput
                      name="rating"
                      type="number"
                      value={rating}
                      defaultValue={buch.rating}
                    />
                  </Flex>
                </Box>
                <Flex gap={3}>
                  <Box>
                    <FormLabel>Price in €</FormLabel>
                    <Input
                      type="number"
                      name="preis"
                      step="any"
                      defaultValue={buch.preis}
                    />
                    {/* @ts-expect-error ts-remix-type-issue */}
                    <FormMessage errors={actionData?.errors} field="preis" />
                  </Box>
                  <Box>
                    <FormLabel>Discount in %</FormLabel>
                    <Input
                      name="rabatt"
                      type="number"
                      step="any"
                      defaultValue={buch.rabatt * 100}
                    />
                    {/* @ts-expect-error ts-remix-type-issue */}
                    <FormMessage errors={actionData?.errors} field="rabatt" />
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
