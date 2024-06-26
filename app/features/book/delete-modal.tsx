import {
  Badge,
  Box,
  Button,
  FormLabel,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import {
  useActionData,
  useFetcher,
  useNavigate,
  useNavigation,
} from '@remix-run/react'
import { Trash } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { Buch } from '~/lib/validators/book'
import { action } from '~/routes/delete-book.$id'

export const DeleteModal = ({ buch }: Readonly<{ buch: Buch }>) => {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const navigate = useNavigate()
  const fetcher = useFetcher()

  const [error, setError] = useState('')
  const [titleInput, setTitleInput] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (titleInput !== buch.titel.titel) {
      return setError('Input does not match the book title.')
    }
    setError('')

    fetcher.submit(buch.id, {
      action: `/delete-book/${buch.id}`,
      method: 'DELETE',
    })
  }

  useEffect(() => {
    if (actionData) {
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  return (
    <>
      <IconButton colorScheme="red" onClick={onOpen} aria-label="Delete Book">
        <Icon as={Trash} />
      </IconButton>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Book Entry</ModalHeader>
          <Badge alignSelf="center" colorScheme="red">
            {actionData?.error}
          </Badge>
          <ModalCloseButton />
          <ModalBody>
            <fetcher.Form action={`/delete-book/${buch.id}`} method="DELETE">
              <Box>
                <FormLabel>Title</FormLabel>
                <Input
                  name="titel"
                  placeholder="Enter the book title to confirm"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  disabled={navigation.state === 'submitting'}
                />
                {error ? (
                  <Text fontSize="sm" color="red.500">
                    {error}
                  </Text>
                ) : undefined}
              </Box>
              <Text color="gray.400" fontSize="small">
                {`Please enter the book title '${buch.titel.titel}' to confirm?`}
              </Text>

              <ModalFooter px={0}>
                <Button colorScheme="gray" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button
                  colorScheme="red"
                  isLoading={navigation.state === 'submitting'}
                  onClick={onSubmit}
                >
                  Delete
                </Button>
              </ModalFooter>
            </fetcher.Form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
