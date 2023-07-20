import { SearchHandler } from '@/components/SearchContext'
import PostListContainer from '@/components/PostListContainer'
import PostPage from '@/components/PostPage'
import FormTitle from '@/components/FormTitle'

export default function Home() {
  return (
      <PostListContainer>
        <FormTitle/>
        <PostPage/>
      </PostListContainer>
  )
}