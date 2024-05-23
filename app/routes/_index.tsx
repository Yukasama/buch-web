import { Link } from '@remix-run/react'

export default function Index() {
  return (
    <main id="content">
      <h1>Homepage</h1>
      <p>Das ist ein Test</p>
      <p id="cta">
        <Link to="/dev">Lets Dev</Link>
      </p>
      <p id="ctb">
        <Link to="/search">Lets Search</Link>
      </p>
    </main>
  )
}
