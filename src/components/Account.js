'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jwtDecode from 'jwt-decode';

const Account = () => 
{
    const router = useRouter();

    const [FirstName, setFirstName] = useState(null);
    const [LastName, setLastName] = useState(null);
    const [Email, setEmail] = useState(null);

    const [isModalOpen, setModalOpen] = useState(false);
    const [visitedCountries, setVisitedCountries] = useState([]);
    const [newCountry, setNewCountry] = useState('');

    const apiUrl = process.env.API_URL;

    useEffect(() => 
    {
        const GetUserInfo = () => 
        {
            const token = localStorage.getItem('personalToken');
            if (token) 
            {
                try 
                {
                    const decodedToken = jwtDecode(token);
                    setFirstName(decodedToken.first);
                    setLastName(decodedToken.last);
                    setEmail(decodedToken.email);
                }  
                catch (error)  
                {
                    console.error('Error while decoding JWT:', error);
                }
            }
        };
        GetUserInfo();
    }, []);
    
    const MyPosts = () =>
    {
        router.push('/my-posts');
    }

    const openModal = () => 
    {
        setModalOpen(true);
    };

    const fetchVisitedCountries = async () => 
    {
        const token = localStorage.getItem('personalToken');
        if (!token) 
        {
            return;
        }
        try 
        {
            const response = await fetch(apiUrl + '/add-country', 
            {
                method: 'POST',
                headers: 
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                    token: token,
                }),
            });
            if (response.ok) 
            {
                const data = await response.json();
                setVisitedCountries(data.countries);
            } 
            else if (response.status === 404) 
            {
               
            }
        } 
        catch (error) 
        {
            console.error(error);
        }
    };

    const MyAdventureBook = () =>
    {
        openModal();
        fetchVisitedCountries();
    }
    
    const closeModal = () => 
    {
        setModalOpen(false);
    };
    
    const handleCountryChange = (e) => 
    {
        setNewCountry(e.target.value);
    };
    
    const addCountry = async () => 
    {
        const token = localStorage.getItem('personalToken');
        if (!token) 
        {
            return;
        }
        try 
        {
            const response = await fetch(apiUrl + '/add-country', 
            {
                method: 'POST',
                headers: 
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                    token: token,
                    country: newCountry,
                }),
            });
            if (response.ok) 
            {
                const data = await response.json();
                setVisitedCountries(data.countries);
                setNewCountry('');
            } 
            else if (response.status === 404) 
            {

            }
        } catch (error) 
        {
            console.error(error);
        }
    };

    return (
        <div>
            <nav style={{ background: 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)' }} 
            className="border-4 border-fourth py-10 px-4 space-y-4 rounded-3xl">            
            {FirstName && LastName && (
                <div className="text-center text-fourth text-5xl">
                    {`Hello, my name is ${FirstName} ${LastName}.`}
                </div>
            )}
            {Email && (
                <div style={{ marginTop: '50px' }} className="text-center text-fourth text-xl">
                    {`${Email}`}
                </div>
            )}
            <div style={{ marginTop: '50px' }} className="flex justify-center">
                <button className = "px-4 py-2 bg-fourth text-primary text-xl rounded-full" onClick = {MyPosts}>
                    My Posts
                </button>
            </div>
            <div style={{ marginTop: '25px' }} className="flex justify-center">
                <button className = "px-4 py-2 bg-fourth text-primary text-xl rounded-full" onClick = {MyAdventureBook}>
                    My Adventure Book
                </button>
            </div>
            </nav>

        {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={closeModal}>
                <div style={{ background: 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)',}}
                    className="border-4 border-fourth py-10 px-4 space-y-4 rounded-3xl"
                        onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-2xl text-fourth font-bold mb-4">My Adventure Book</h2>
                    <ul>
                        {visitedCountries.map((country, index) => (<li key={index}>{country}</li>))}
                    </ul>
            <div className="flex items-center">
                <input
                    type="text"
                    className="px-2 py-1 rounded"
                    placeholder="Enter a new country"
                    value={newCountry}
                    onChange={handleCountryChange}/>
                <button className="ml-2 px-4 py-2 bg-fourth text-primary text-xl rounded-full" onClick={addCountry} >
                    Add Country
                </button>
            </div>
            </div>
            </div>
        )}
        </div>
    )
}
export default Account;