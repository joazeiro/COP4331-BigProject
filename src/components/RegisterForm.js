import { useState } from 'react'
import { useRouter } from 'next/navigation'

const RegisterForm = () => {
    const router = useRouter();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleRegister = async (e) => {
        e.preventDefault()

        if (confirmPassword !== password)
        {
            console.log("Passwords Do Not Match")
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
                body: JSON.stringify({ username, password, firstName, lastName, email })
            });
      
            if (response.ok) 
            {
                router.push(`/register/verification`);
            } 

            else if (response.status === 401) 
            {
                // Unauthorized: Invalid credentials
                console.log('Invalid credentials');
                // Display an error message to the user
            } 
            
            else
            {
                // Other error occurred
                console.log('An error occurred');
                // Display a generic error message to the user
            }
          } 
          catch (error) 
          {
                console.log('An error occurred', error);
                // Handle other errors that may occur during the fetch request
          }
    }
  return (
    <div>
        <form style={{ background: 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)' }} className="border-4 border-fourth py-10 px-4 space-y-4 rounded-3xl" onSubmit={handleRegister}>
            <div className = "text-center text-fourth text-5xl ">Sign Up</div>
            <div className="rounded-md shadow-sm -space-y-px text-fourth text-xl">
                <div>
                    <label htmlFor="first-name">First Name</label>
                    <input 
                        id="first_name" 
                        name="first_name" 
                        type="text" 
                        required 
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
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
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
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
                        value={email}
                        onChange={e => setEmail(e.target.value)}
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
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>
            </div>
            <div>
                <button type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-fourth hover:bg-third focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Register
                </button>
            </div>
            <div className = "flex items-center justify-center">
                <div className = "text-md text-center text-black">Already have an account?</div>
            </div>
            <div className = "flex items-center justify-center">
                    <a href="/login" className="font-medium text-fourth hover:text-black">
                        Login Here!
                    </a>
            </div>
        </form>
    </div>
  )
}

export default RegisterForm