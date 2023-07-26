"use client"

import FormTitle from '@/components/FormTitle'
import FormContainer from '@/components/FormContainer'
import EmailVerify from '@/components/EmailVerify'

export default function verificationPage() {
  return (
    <FormContainer>
        <FormTitle/>
        <EmailVerify/>  
    </FormContainer>
    )
}