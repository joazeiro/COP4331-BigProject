'use client'

import { useState } from 'react'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
  }

  return (
    <div>
        <form className = "bg-secondary py-10 px-4 space-y-4 rounded-xl" onSubmit={handleSubmit}>
            <div className = "text-center text-fourth text-3xl ">Login</div>
            <div className="rounded-md shadow-sm -space-y-px">
                <div>
                    <label htmlFor="email-address" className="text-fourth text-xl">User Name</label>
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
                    <label htmlFor="password" className="text-fourth mt-2 block text-xl">Password</label>
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
            </div>

            <div className="flex items-center justify-between">
                <div className="text-md">
                    <a href="#" className="font-xl text-fourth hover:text-black">
                        Forgot your password?
                    </a>
                </div>
            </div>

            <div>
                <button type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-fourth hover:bg-third focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Sign in
                </button>
            </div>
            <div className = "flex items-center justify-center">
                <div className = "text-lg text-center text-fourth">Don't have an account yet?</div>
            </div>
            <div className = "flex items-center justify-center">
                <a href="#" className="font-medium text-fourth hover:text-black">
                    Sign Up Here!
                </a>
            </div>
        </form>
    </div>
  )
}

export default LoginForm