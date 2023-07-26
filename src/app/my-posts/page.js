import Navbar from '@/components/Navbar'
import { MyPostList } from '@/components/MyPostList'
import { SearchHandler } from '@/components/SearchContext'
import PostListContainer from '@/components/PostListContainer'

export default function UserPostsPage() {
  return (
    <SearchHandler>
      <Navbar/>
      <PostListContainer>
        <MyPostList/>
      </PostListContainer>
    </SearchHandler>
  )
}