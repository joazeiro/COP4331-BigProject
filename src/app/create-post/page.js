'use client'

import CreatePost from "@/components/CreatePost"
import FormTitle from "@/components/FormTitle"
import PostCreationContainer from "@/components/PostCreationContainer"

export default function CreatePostPage() {
    return (
      <PostCreationContainer>
            <FormTitle/>
            <CreatePost/>  
      </PostCreationContainer>
      )
  }