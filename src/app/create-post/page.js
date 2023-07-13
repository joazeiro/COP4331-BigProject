'use client'

import CreatePost from "@/components/CreatePost"
import PostCreationContainer from "@/components/PostCreationContainer"

export default function CreatePostPage() {
    return (
      <PostCreationContainer>
          <CreatePost/>  
      </PostCreationContainer>
      )
  }