'use client'

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation'
import { SearchContext } from './SearchContext';

const AccountNavbar = () => 
{
    const router = useRouter();
    const { searchQuery, setSearchQuery } = useContext(SearchContext);

    const handleSearch = (e) =>
    {
        setSearchQuery(e.target.value);
    }

    const pushToCreatePost = () =>
    {
        router.push('/create-post');
    }

    const pushToChangePassword = () =>
    {
        router.push('/reset-password');
    }

    const pushToSignOut = () =>
    {
        localStorage.setItem('personalToken', null);
        router.push('/login');
    }

    const pushToHomePage = () => 
    {
        router.push('/');
    };

    return (
        <nav className="flex justify-between w-full py-3 px-4" style={{ background: 'linear-gradient(180deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)' }}>
            <button className="text-4xl text-fourth" onClick={pushToHomePage}>GeoBook</button>
                <ul className = "flex justify-between">
                    {
                        <>
                            <li>
                                <button className = "px-4 py-2 ml-4 bg-fourth text-primary text-xl rounded-full" onClick = {pushToCreatePost}>Create Post</button>
                            </li>
                            <li>
                                <button className = "px-4 py-2 ml-4 bg-primary text-fourth text-xl rounded-full" onClick = {pushToChangePassword}>Reset Password</button>
                            </li>
                            <li>
                                <button className = "px-4 py-2 ml-4 bg-fourth text-primary text-xl rounded-full" onClick = {pushToSignOut}>Sign Out</button>
                            </li>
                        </>
                    }  
                </ul>
        </nav>
    );
};
export default AccountNavbar;