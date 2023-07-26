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
    const [countries, setCountries] = useState([]);
    const [errorCountry, setErrorCountry] = useState('');
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
        fetchVisitedCountries();

        // This is used for the tag to make sure the country that is inputted is a valid country
        // So the user can put random stuff in the tag field
        fetch('https://restcountries.com/v3.1/all').then(response => response.json())
            .then(data => 
            {
                const countryNames = data.map(country => country.name.common);
                setCountries(countryNames);
            })
            .catch(error => 
            {
                console.log('An error occurred while fetching country data:', error);
            });

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
               console.log('error');
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
    }

    function validateCountry(country)
    {
        return countries.includes(country);
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
        if (validateCountry(newCountry))
        {
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
        }
        else
        {
            setErrorCountry('Please Input a Valid Country');
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
                <button className = "px-4 py-2 bg-fourth text-primary text-xl rounded-full" onClick = {openModal}>
                    My Adventure Book
                </button>
            </div>
            <div className = "flex flex-wrap justify-start">
                {visitedCountries.map((country, index) => (
                    <div key = {index} className = "mb-8 inline-block bg-primary text-fourth rounded-full mx-5 py-4 px-5 text-3xl">{country}</div>
                ))}
            </div>
            </nav>

        {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={closeModal}>
                <div style={{ background: 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)',}}
                    className="border-4 border-fourth py-10 px-4 space-y-4 rounded-3xl"
                        onClick={(e) => e.stopPropagation()}>
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
            <div className = "flex items-center justify-center">
                    <div className = "text-lg text-center text-black">{errorCountry}</div>
            </div>
            </div>
            </div>
        )}
        </div>
    )
}
export default Account;