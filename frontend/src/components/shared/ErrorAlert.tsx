import { Alert, AlertIcon, AlertDescription } from '@chakra-ui/react'

interface ErrorAlertProps {
  message: string
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <Alert status="error" borderRadius="md">
      <AlertIcon />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
