'use client'
import React from 'react'

const EmailVerify = () => {

  return (
    <div>
        <form style={{ background: 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)' }} className="border-4 border-fourth py-10 px-4 space-y-4 rounded-3xl">
            <div className = "text-center text-fourth text-5xl ">Verify Your Email</div>
            <div className = "text-center flex text-fourth">
                We want to make sure you have the best experience when utilizing our social media! 
                We have sent you an authentication link to the email you have provided, 
                all you need to do is to click that link and you can start your adventure
            </div>
        </form>
    </div>
  )  
}

export default EmailVerify