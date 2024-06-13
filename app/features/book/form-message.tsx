import { Text } from '@chakra-ui/react'

interface Props {
  actionData: unknown
  field: string
}
export const FormMessage = ({ actionData, field }: Props) => {
  return (
    <>
      {actionData?.errors.find((error) => error.path.includes(field)) && (
        <Text fontSize="sm" color="red.500">
          {
            actionData.errors.find((error) => error.path.includes(field))
              ?.message
          }
        </Text>
      )}
    </>
  )
}
