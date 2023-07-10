'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation'

const ForgotPassword = () => {
    const [token, setToken] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')

    const handleEmail = async (e) => {
            e.preventDefault()

            if (newPassword !== confirmNewPassword)
            {
                console.log("Passwords Must Match");
            }

            try
            {
                const response = await fetch('/temp',
                {
                    method: 'POST',
                    headers:
                    {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({token, newPassword})
                });

                if (response.ok)
                {
                    console.log('Password Updated Successfully')
                }

                else if (response.status === 400)
                {
                    console.log('Token and New Password are Required.');
                }

                else if (response.status === 404)
                {
                    console.log('Invalid Token')
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
        <form style={{ background: 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)' }} className="border-4 border-fourth py-10 px-4 space-y-4 rounded-3xl" onSubmit={handleEmail}>            
            <div className = "text-center text-fourth text-5xl ">Forgot Password</div>
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor="token" className="text-fourth mt-6 block text-xl">Token</label>
                        <input 
                            id="token" 
                            name="token" 
                            type="text" 
                            required
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            value={token}
                            onChange={e => setToken(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="text-fourth mt-6 block text-xl">New Password</label>
                        <input 
                            id="newPassword" 
                            name="newPassword" 
                            type="password" 
                            required
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmNewPassword" className="text-fourth mt-6 block text-xl">Confirm New Password</label>
                        <input 
                            id="confirmNewPassword" 
                            name="confirmNewPassword" 
                            type="password" 
                            required
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            value={confirmNewPassword}
                            onChange={e => setConfirmNewPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <button type="submit"
                            className="group relative w-full flex justify-center mt-8 py-2 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-fourth hover:bg-third focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Make New Password
                    </button>
                </div>
        </form>
    </div>
  )
}

export default ForgotPassword