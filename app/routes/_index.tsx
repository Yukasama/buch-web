import { Link } from '@remix-run/react'
import ImageCarousel from '../components/layout/image-carousel'

export default function Index() {
  return (
    <main id="content">
      <ImageCarousel />
      <p id="ctb">
        <Link to="/search">Lets Search</Link>
      </p>
    </main>
  )
}
