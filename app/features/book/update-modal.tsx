import {
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  FormLabel,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  VisuallyHiddenInput,
  useDisclosure,
} from '@chakra-ui/react'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BOOK_KINDS } from '~/config/book'
import { Buch } from '~/lib/validators/book'
import { action } from '~/routes/book.$id'
import { FormMessage } from './form-message'

export const UpdateModal = ({ buch }: Readonly<{ buch: Buch }>) => {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [rating, setRating] = useState(buch.rating)
  const [version, setVersion] = useState(buch.version)

  useEffect(() => {
    if (actionData?.version) {
      setVersion(actionData.version)
      onClose()
    }
  }, [actionData, onClose])

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Edit Book
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
                      disabled={navigation.state === 'submitting'}
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
                      disabled={navigation.state === 'submitting'}
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
                    <Input
                      name="isbn"
                      disabled={navigation.state === 'submitting'}
                      defaultValue={buch.isbn}
                    />
                    {/* @ts-expect-error ts-remix-type-issue */}
                    <FormMessage errors={actionData?.errors} field="isbn" />
                  </Box>
                  <Box>
                    <FormLabel>Homepage</FormLabel>
                    <Input
                      name="homepage"
                      disabled={navigation.state === 'submitting'}
                      defaultValue={buch.homepage}
                    />
                    {/* @ts-expect-error ts-remix-type-issue */}
                    <FormMessage errors={actionData?.errors} field="homepage" />
                  </Box>
                </Flex>
                <Box>
                  <FormLabel>Type</FormLabel>
                  <Select
                    name="art"
                    disabled={navigation.state === 'submitting'}
                    defaultValue={buch.art}
                  >
                    <option value={buch.art}>{buch.art}</option>
                    {BOOK_KINDS.filter((map) => map !== buch.art).map(
                      (kind) => (
                        <option key={kind + '1'} value={kind}>
                          {kind}
                        </option>
                      ),
                    )}
                  </Select>
                </Box>
                <Box>
                  <FormLabel>Rating</FormLabel>
                  <Flex
                    alignItems="center"
                    gap={2}
                    my={2}
                    border="1px"
                    borderColor={'gray.600'}
                    opacity={navigation.state === 'submitting' ? 0.5 : 1}
                    borderRadius="lg"
                    p={2}
                    px={4}
                  >
                    <Text fontSize="md" w={6}>
                      {rating}.0
                    </Text>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Icon
                        key={i}
                        boxSize={18}
                        as={Star}
                        onClick={() => setRating(i + 1)}
                        cursor="pointer"
                        opacity={navigation.state === 'submitting' ? 0.5 : 1}
                        fill={i < rating ? 'white' : 'none'}
                      />
                    ))}
                    <VisuallyHiddenInput
                      name="rating"
                      type="number"
                      value={rating}
                    />
                  </Flex>
                </Box>
                <Flex gap={3}>
                  <Box>
                    <FormLabel>Price in €</FormLabel>
                    <Input
                      type="number"
                      name="preis"
                      disabled={navigation.state === 'submitting'}
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
                      disabled={navigation.state === 'submitting'}
                      step="any"
                      defaultValue={(buch.rabatt * 100).toFixed(2)}
                    />
                    {/* @ts-expect-error ts-remix-type-issue */}
                    <FormMessage errors={actionData?.errors} field="rabatt" />
                  </Box>
                </Flex>
                <Flex alignItems="center">
                  <FormLabel>In Stock</FormLabel>
                  <Checkbox
                    mb={2}
                    disabled={navigation.state === 'submitting'}
                    name="lieferbar"
                    defaultChecked={!!buch.lieferbar}
                  />
                </Flex>
              </Stack>

              <ModalFooter px={0}>
                <Button colorScheme="gray" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button
                  colorScheme="blue"
                  isLoading={navigation.state === 'submitting'}
                  type="submit"
                >
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
