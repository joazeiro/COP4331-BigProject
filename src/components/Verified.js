'use client'
import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

const Verified = () => 
{
  const apiUrl = process.env.API_URL;
  const router = useRouter()
  const UrlParams = useSearchParams();
  const token = UrlParams.get('token');

  const handleVerify = async () => 
  {
    // Makes a stall before it transfer you to the next page ('/login')
    await new Promise((resolve) => setTimeout(resolve, 5000)); 
      const response = await fetch(apiUrl + '/verify/' + token,
      {
          method: 'GET',
          headers: 
          {
              'Content-Type': 'application/json'
          },
      });

      if (response.ok)
      {
        router.push('/login')
      }
  }

  useEffect(() =>
  {
    if (token)
    {
      handleVerify();
    }

  }, [router, token, apiUrl]);
  

  return (
    <div>
        <form style={{ background: 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)' }} className="border-4 border-fourth py-10 px-4 space-y-4 rounded-3xl" onClick={handleVerify}>
            <div className = "text-center text-fourth text-5xl">You Have Been Verified!
                <div className = "text-center flex text-fourth text-3xl mt-8">
                    You have been verified! Have fun with your future adventures! Thank you!
                </div>
            </div>
        </form>
    </div>
  )  
}

export default Verified