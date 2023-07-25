import Navbar from '@/components/Navbar'
import { PostList } from '@/components/PostList'
import { SearchHandler } from '@/components/SearchContext'
import PostListContainer from '@/components/PostListContainer'

export default function Home() {
  return (
    <SearchHandler>
      <Navbar/>
      <PostListContainer>
        <PostList/>
      </PostListContainer>
    </SearchHandler>
  )
}
