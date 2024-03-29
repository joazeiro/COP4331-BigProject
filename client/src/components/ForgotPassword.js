'use client'

import { useState } from 'react';
import Link from 'next/link'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const apiUrl = process.env.API_URL;

    const handleEmail = async (e) => {
            e.preventDefault()

            try
            {
                const response = await fetch(apiUrl + '/forgot-password',
                {
                    method: 'POST',
                    headers:
                    {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(   
                        {
                            email: email
                        }
                    )
                });

                const data = await response.json();

                if (response.ok)
                {
                    setErrorMessage(data.message);
                }

                else if (response.status === 401)
                {
                    // An error has occured
                    setErrorMessage(data.error);
                }

                else 
                {
                    console.log('An Error Occurred');
                }
            }
            catch (error)
            {
                console.log('An Error Occurred', error);
            }
    }
  return (
    <div>
        <form style = {{ background: 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)' }} className="border-4 border-fourth py-10 px-4 space-y-4 rounded-3xl" onSubmit={handleEmail}>            
            <div className = "text-center text-fourth text-5xl ">Forgot Password</div>
                <div className = "rounded-md shadow-sm -space-y-px">
                    { /* Email Field */ }
                    <div>
                        <label className = "text-fourth mt-6 block text-xl">Your Email</label>
                        <input 
                            id = "email" 
                            name = "email" 
                            type = "email" 
                            required
                            className = "appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            value = {email}
                            onChange = {e => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                { /* Submit Button */}
                <div>
                    <button type = "submit"
                            className = "relative w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-fourth hover:bg-third focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Send Email
                    </button>
                </div>
                { /* Return Login Link */ }
                <div className = "flex items-center justify-center">
                    <Link href = "/login" className="font-medium text-fourth hover:text-black">
                        Go Back to Login
                    </Link>
                </div>
                { /* Error Message */ }
                <div className = "flex items-center justify-center">
                    <div className = "text-md text-center text-black">{errorMessage}</div>
                </div>
        </form>
    </div>
  )
}

export default ForgotPassword