import type { MetaFunction } from '@remix-run/node'
import { ThemeToggle } from '~/components/theme-toggle'

export const meta: MetaFunction = () => {
  return [
    { title: 'Buch Web' },
    { name: 'description', content: 'Welcome to Buch Web!' },
  ]
}

export default function Index() {
  return (
    <div>
      <ThemeToggle />
    </div>
  )
}
