import { Box, Flex, Icon, Button, Input } from '@chakra-ui/react'
import { useFetcher } from '@remix-run/react'
import { Check, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Buch } from '~/lib/validators/book'
import { User } from '~/utils/rest/login'

interface Props {
  buch: Pick<Buch, 'id' | 'art' | 'schlagwoerter'>
  user: User | null
}

export const BuchTags = ({ buch, user }: Props) => {
  const fetcher = useFetcher()

  const [schlagwoerter, setSchlagwoerter] = useState(buch.schlagwoerter)
  const [active, setActive] = useState(false)
  const [input, setInput] = useState('')

  const isAdmin = !!user

  const onSubmit = () => {
    if (input) {
      setSchlagwoerter([...schlagwoerter, input.toUpperCase()])
      fetcher.submit(
        { schlagwoerter },
        {
          action: `/update-schlagwoerter/${buch.id}`,
          method: 'PUT',
        },
      )
    }
    setActive(false)
  }

  const onDeleteSubmit = (tag?: string) => {
    setSchlagwoerter(schlagwoerter.filter((word) => word !== tag))

    fetcher.submit(
      { schlagwoerter },
      {
        action: `/update-schlagwoerter/${buch.id}`,
        method: 'PUT',
      },
    )
  }

  return (
    <Box>
      <Flex gap={2}>
        <Button h={5} disabled rounded="sm" size="sm" fontSize="xs">
          {buch.art}
        </Button>
        {buch.schlagwoerter?.map((word) => (
          <Button
            h={5}
            size="sm"
            rounded="sm"
            fontSize="xs"
            key={word + 'schlagwort'}
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
                onClick={() => setActive(true)}
              >
                <Icon as={Plus} />
              </Button>
            ) : (
              <fetcher.Form
                action={`/update-schlagwoerter/${buch.id}`}
                method="PUT"
              >
                <Flex gap={1}>
                  <Input
                    h={5}
                    w={24}
                    px={0.5}
                    rounded="sm"
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <Button
                    colorScheme="green"
                    h={5}
                    size="sm"
                    rounded="sm"
                    fontSize="sm"
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
