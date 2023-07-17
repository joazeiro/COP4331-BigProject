import Navbar from '@/components/Navbar'
import { SearchHandler } from '@/components/SearchContext'

export default function Home() {
  return (
    <SearchHandler>
      <Navbar/>
    </SearchHandler>
  )
}
