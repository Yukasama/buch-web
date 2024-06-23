import { Box, Flex, Icon, Button, Input, useToast } from '@chakra-ui/react'
import { useActionData, useFetcher } from '@remix-run/react'
import { Check, Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Buch } from '~/lib/validators/book'
import { action } from '~/routes/update-schlagwoerter.$id'
import { User } from '~/utils/rest/login'

interface Props {
  buch: Pick<Buch, 'id' | 'version' | 'art' | 'schlagwoerter'>
  user: User | null
}

export const BuchTags = ({ buch, user }: Props) => {
  const fetcher = useFetcher<typeof action>()
  const actionData = useActionData<typeof action>()

  const [schlagwoerter, setSchlagwoerter] = useState(buch.schlagwoerter)
  const [active, setActive] = useState(false)
  const [input, setInput] = useState('')

  const toast = useToast()
  const isAdmin = user?.username === 'admin'

  const onSubmit = () => {
    if (input) {
      const updatedSchlagwoerter = [input.toUpperCase(), ...schlagwoerter]
      setSchlagwoerter(updatedSchlagwoerter)
      setInput('')
      submit(updatedSchlagwoerter)
    }
    setActive(false)
  }

  const onDeleteSubmit = (tag?: string) => {
    const updatedSchlagwoerter = schlagwoerter.filter((word) => word !== tag)
    setSchlagwoerter(updatedSchlagwoerter)
    submit(updatedSchlagwoerter)
  }

  const submit = (schlagwoerter: string[]) => {
    fetcher.submit(
      {
        schlagwoerter,
        version: buch.version ?? '0',
      },
      {
        action: `/update-schlagwoerter/${buch.id}`,
        method: 'PUT',
      },
    )
  }

  useEffect(() => {
    if (actionData?.error) {
      toast({
        title: 'Failed to update Book.',
        description: actionData?.error,
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  return (
    <Box>
      <Flex gap={2}>
        <Button h={5} disabled rounded="sm" size="sm" fontSize="xs">
          {buch.art}
        </Button>
        {buch.schlagwoerter?.map((word, i) => (
          <Button
            h={5}
            size="sm"
            rounded="sm"
            fontSize="xs"
            key={word + i + 'schlagwort'}
            _hover={isAdmin ? { bg: 'red.500', opacity: 10 } : {}}
            onClick={isAdmin ? () => onDeleteSubmit(word) : undefined}
          >
            {word}
          </Button>
        ))}
        {isAdmin && (
          <>
            {!active ? (
              <Button
                h={5}
                w={4}
                colorScheme="blue"
                rounded="sm"
                px={2}
                display="flex"
                aria-label="Add Tag"
                onClick={() => setActive(true)}
              >
                <Icon as={Plus} />
              </Button>
            ) : (
              <fetcher.Form
                action={`/update-schlagwoerter/${buch.id}`}
                method="put"
              >
                <Flex gap={1}>
                  <Input
                    h={5}
                    w={24}
                    px={0.5}
                    rounded="sm"
                    aria-label="Tag Input"
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <Button
                    colorScheme="green"
                    h={5}
                    size="sm"
                    rounded="sm"
                    fontSize="sm"
                    aria-label="Confirm Tag"
                    type="submit"
                    onClick={onSubmit}
                  >
                    <Icon as={Check} />
                  </Button>
                  <Button
                    colorScheme="red"
                    h={5}
                    size="sm"
                    rounded="sm"
                    aria-label="Discard Tag"
                    fontSize="sm"
                    onClick={() => setActive(false)}
                  >
                    <Icon as={X} />
                  </Button>
                </Flex>
              </fetcher.Form>
            )}
          </>
        )}
      </Flex>
    </Box>
  )
}
