import { Box, Text } from '@chakra-ui/react'
import type { ZodIssue } from 'zod'

interface Props {
  errors?: ZodIssue[]
  field: string
}

export const FormMessage = ({ errors, field }: Props) => {
  return (
    <Box m={1}>
      {errors?.find((error) => error.path.includes(field)) && (
        <Text fontSize="sm" color="red.500">
          {errors.find((error) => error.path.includes(field))?.message}
        </Text>
      )}
    </Box>
  )
}
