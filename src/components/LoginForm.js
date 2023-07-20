'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LoginForm = () => {
    const router = useRouter();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const apiUrl = process.env.API_URL;

    const handleSubmit = async (e) => {
            e.preventDefault()
            // console.log('API_URL:', process.env.API_URL);
            // const loginUrl = process.env.API_URL + '/login';
            // console.log('Login URL:', loginUrl);
            try
            {
                const response = await fetch(apiUrl + '/login',
                {
                    method: 'POST',
                    headers:
                    {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            username: username, 
                            password: password
                        }
                    )
                });

                if (response.ok)
                {
                    const data = await response.json();
                    const authToken = data.token;
                    console.log(authToken);

                    localStorage.setItem('personalToken', authToken);
                    router.push('/');
                }
                else if (response.status === 401)
                {
                    // An error has occured
                    const data = await response.json();
                    setErrorMessage(data.message)
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
        <form style = {{ background: 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)' }} className="border-4 border-fourth py-10 px-4 space-y-4 rounded-3xl" onSubmit={handleSubmit}>            
            <div className = "text-center text-fourth text-5xl">Login</div>
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label className="text-fourth text-xl">User Name</label>
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
                        <label className="text-fourth mt-2 block text-xl">Password</label>
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
                        <Link href="/login/forgot-password" className="font-xl text-fourth hover:text-black">
                            Forgot your password?
                        </Link>
                    </div>
                </div>

                <div>
                    <button type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-fourth hover:bg-third focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Sign in
                    </button>
                </div>
                <div className = "flex items-center justify-center">
                    <div className = "text-lg text-center text-fourth">Don't have an account yet?</div>
                </div>
                <div className = "flex items-center justify-center">
                    <Link href="/register" className="font-medium text-fourth hover:text-black">
                        Sign Up Here!
                    </Link>
                </div>
                <div className = "flex items-center justify-center">
                    <div className = "text-lg text-center text-black">{errorMessage}</div>
                </div>
        </form>
    </div>
  )
}

export default LoginForm