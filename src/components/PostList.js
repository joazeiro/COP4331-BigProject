'use client'

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { SearchContext } from './SearchContext';

export const PostList = () => {
    const router = useRouter();
    const { searchQuery } = useContext(SearchContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = process.env.API_URL;
    let token = null;
  
    if (typeof window !== 'undefined') 
    {
        // Check if running on the client-side
        token = localStorage.getItem('personalToken');
    }

    const fetchPosts = async () => 
    {
        console.log(searchQuery);
        try 
        {
            const response = await fetch(apiUrl + '/search', 
            {
                method: 'POST',
                headers: 
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                    token: token,
                    tag: searchQuery,
                }),
        });

        if (response.ok) 
        {
            const data = await response.json();
            setLoading(false);
            setPosts(data.results);
        } 
        else if (response.status === 404) 
        {
            const data = await response.json();
            console.log(data.Error);
        }
        } 
        catch (error) 
        {
            console.error(error);
        } 
    };

    const pushToPostPage = async () =>
    {
        try
        {
            if (!token)
            {
                router.push('/login');
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
                router.push('/')
            }
            else 
            {
                router.push('/login')
            }
        }
        catch (error)
        {
            console.log("error");
        }
    }

    useEffect(() => 
    {
        setPosts([]);
        setLoading(true);
        fetchPosts();
    }, [searchQuery]);

    if (loading) 
    {
        return(
            <div className = "flex items-center justify-center">
                <div className = "text-black text-center text-5xl inline-block rounded-full px-8 py-4 bg-primary">Loading...</div>
            </div>
        )
    }

  return (
    <div>
      {posts.map((post) => (
        <div key={post._id} className = "mb-8 text-fourth">
            <form style={{ background: 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)' }} className="border-4 border-fourth py-10 px-4 space-y-4 rounded-3xl">
            <div>Created By {post.author} <span className= "ml-20">Posted On: {post.posted} </span></div>
            <div className = "text-4xl">{post.title}<span className = "ml-10 text-3xl text-fourth inline-block bg-primary px-2 rounded-full">{post.tag}</span></div>
            <div className = "text-lg">{post.content}</div>
            <div className = "flex justify-center">
                <button type = "button"className = "px-4 py-2 ml-4 bg-fourth text-primary text-xl rounded-full" onClick = {pushToPostPage}>Read More</button>
            </div>
            </form>
        </div>
      ))}
    </div>
  );
};
