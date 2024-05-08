import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [
    { title: 'Buch Web' },
    { name: 'description', content: 'Welcome to Buch Web!' },
  ]
}

export default function Index() {
  return <div></div>
}
