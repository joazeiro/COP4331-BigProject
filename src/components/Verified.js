'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

const Verified = () => {

  const apiUrl = process.env.API_URL;
  const router = useRouter()
  const UrlParams = useSearchParams();
  const token = UrlParams.get('token');

  const handleVerify = async (e) => 
  {
    e.preventDefault();
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

  return (
    <div>
        <form style={{ background: 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)' }} className="border-4 border-fourth py-10 px-4 space-y-4 rounded-3xl" onClick={handleVerify}>
            <div className = "text-center text-fourth text-5xl">You Have Been Verified!
                <div className = "text-center flex text-fourth text-3xl mt-8">
                    You have been verified! Have fun with your future adventures! Thank you!
                </div>
            </div>
            <div className = "mx-16">
              <button type="button"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-fourth hover:bg-third focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Go to Login
              </button>
            </div>
        </form>
    </div>
  )  
}

export default Verified