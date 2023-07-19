'use client'

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation'
import { SearchContext } from './SearchContext';

const Navbar = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { searchQuery, setSearchQuery } = useContext(SearchContext);
    const apiUrl = process.env.API_URL;

    useEffect(() => 
    {
        const checkLoginStatus = async () => 
        {
            let token = null;

            if (typeof window !== 'undefined')
            {
                token = localStorage.getItem('personalToken');
            }

            try
            {
                if (!token)
                {
                    setIsLoggedIn(false);
                    return;
                }

                const response = await fetch(apiUrl + '/',
                {
                    method: 'POST',
                    headers:
                    {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            token: token
                        }
                    )
                });

                if (response.ok)
                {
                    setIsLoggedIn(true);
                }
                else 
                {
                    setIsLoggedIn(false);
                }
            }
            
            catch
            {
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();

    }, []);

    const handleSearch = (e) =>
    {
        setSearchQuery(e.target.value);
    }

    const pushToLogin = () =>
    {
        router.push('/login');
    }

    const pushToRegister = () =>
    {
        router.push('/register');
    }

    const pushToCreatePost = () =>
    {
        router.push('/create-post');
    }

    const pushToMyAccount = () =>
    {
        router.push('/my-account');
    }

    const pushToLogOut = () =>
    {
        localStorage.setItem('personalToken', null);
        router.push('/login');
    }

    return (
        <nav className="flex justify-between w-full py-3 px-4" style = {{ background: 'linear-gradient(180deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)' }}>
            <div className = "text-4xl text-fourth">GeoBook</div>
                <ul className = "flex justify-between">
                    <li>
                        <input
                            type = "text"
                            placeholder = "Search"
                            className = "px-4 py-2 border text-black border-gray-400 rounded-full w-96"
                            value = {searchQuery}
                            onChange = {handleSearch}
                        />
                    </li>
                </ul>
                <ul className = "flex justify-between">
                    {!isLoggedIn ? (
                        <>
                            <li>
                                <button className = "px-4 py-2 ml-4 bg-fourth text-third text-xl rounded-full" onClick = {pushToLogin}>Login</button>
                            </li>
                            <li>
                                <button className = "px-4 py-2 ml-4 bg-fourth text-third text-xl rounded-full" onClick = {pushToRegister}>Sign Up</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <button className = "px-4 py-2 ml-4 bg-fourth text-third text-xl rounded-full" onClick = {pushToCreatePost}>Create Post</button>
                            </li>
                            <li>
                                <button className = "px-4 py-2 ml-4 bg-fourth text-third text-xl rounded-full" onClick = {pushToMyAccount}>My Account</button>
                            </li>
                            <li>
                                <button className = "px-4 py-2 ml-4 bg-fourth text-third text-xl rounded-full" onClick = {pushToLogOut}>Sign Out</button>
                            </li>
                        </>
                    )}  
                </ul>
        </nav>
    );
};

export default Navbar;
