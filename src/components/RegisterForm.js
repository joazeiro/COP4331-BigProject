import React from 'react'

import { useState } from 'react'

const RegisterForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission here
}
  return (
    <div>
        <form style={{ background: 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)' }} className="py-10 px-4 space-y-4 rounded-xl" onSubmit={handleSubmit}>
            <div className = "text-center text-fourth text-3xl ">Sign Up</div>
            <div className="rounded-md shadow-sm -space-y-px text-fourth text-xl">
                <div>
                    <label htmlFor="first-name">First Name</label>
                    <input 
                        id="first_name" 
                        name="first_name" 
                        type="text" 
                        required 
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="last-name" className="mt-2 block">Last Name</label>
                    <input 
                        id="last_name" 
                        name="last_name" 
                        type="text" 
                        required                            
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="user-name" className="mt-2 block">User Name</label>
                    <input 
                        id="username" 
                        name="username" 
                        type="text" 
                        required
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>                   
                <div>
                    <label htmlFor="email-address" className="mt-2 block">Email address</label>
                    <input 
                        id="email-address" 
                        name="email" 
                        type="email" 
                        required
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>   
                <div>
                    <label htmlFor="password" className="mt-2 block">Password</label>
                    <input 
                        id="password" 
                        name="password" 
                        type="password" 
                        required
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="mt-2 block">Confirm Password</label>
                    <input 
                        id="confirmPassword" 
                        name="password" 
                        type="password" 
                        required
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
            </div>
            <div>
                <button type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-fourth hover:bg-third focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Register
                </button>
            </div>
            <div className = "flex items-center justify-center">
                <div className = "text-md text-center text-black">Already have an account?</div>
            </div>
            <div className = "flex items-center justify-center">
            <a href="#" className="font-medium text-fourth hover:text-black">
                        Login Here!
                    </a>
            </div>
        </form>
    </div>
  )
}

export default RegisterForm