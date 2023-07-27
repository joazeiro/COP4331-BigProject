'use client'

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation'
import { SearchContext } from './SearchContext';
import Modal from 'react-modal';

export const MyPostList = () => {
    const router = useRouter();
    const { searchQuery } = useContext(SearchContext);
    const [posts, setPosts] = useState([]);
    const [invalidToken, setInvalidToken] = useState(false);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const apiUrl = process.env.API_URL;
    
    useEffect(() =>
    {
        if (typeof window !== 'undefined') 
        {
            // Check if running on the client-side
            setToken(localStorage.getItem('personalToken'));
        }
    }, []);

    useEffect(() =>
    {
        let timer
        if (invalidToken)
        {
            timer = setTimeout(() => 
            {
                setInvalidToken(false);
                router.push('/login');
            }, 4000)
        }

        return () => clearTimeout(timer);
    }, [invalidToken])

    const fetchPosts = async () => 
    {
        let token = localStorage.getItem('personalToken');
        try 
        {
            const response = await fetch(apiUrl + '/search-user-posts', 
            {
                method: 'POST',
                headers: 
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                    tag: searchQuery,
                    token: token
                }),
            });

            if (response.ok) 
            {
                const data = await response.json();
                setLoading(false);
                console.log(data.results);
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

    const pushToPostPage = async (post) =>
    {
        const personalToken = localStorage.getItem('personalToken');
        console.log(personalToken);

        if (personalToken === '' || personalToken === 'null' || !personalToken || personalToken === null)
        {
            setInvalidToken(true);
            return;
        }

        try
        {
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
                })
            });

            if (response.ok)
            {
                localStorage.setItem('postID', post._id);
                router.push(`/post/${post._id}`);
            }
            else if (response.status == 404)
            {
                setInvalidToken(true);
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

        // Delaying api calls till user finishes in order to prevent
        // weird behavior

        let delayTimer; 

        const delayedFetch = () => 
        {
            clearTimeout(delayTimer);
            delayTimer = setTimeout(() => 
            {
                fetchPosts();
            }, 500); // Delay of 5 milliseconds, it seemed good enough without breaking the calls and being too slow
        }

        delayedFetch();

        return () => 
        {
            clearTimeout(delayTimer);
        }

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
        <div key = {post._id} className = "mb-8 text-fourth">
            <form style = {{ background: 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)' }}
            className="border-4 border-fourth py-10 px-4 space-y-4 rounded-3xl">
            <div className = "flex justify-between">
                Created By {post.author} 
                <div>
                    Posted On: {post.posted}
                </div>
            </div>
            <div className = "text-4xl">
                {post.title}
                <span className = "ml-10 text-3xl text-fourth inline-block bg-primary px-3 py-2 rounded-full">
                    {post.tag}
                </span>
            </div>
            <div className = "text-lg">
                {post.content}
            </div>
            <div className = "flex justify-center">
                <button type = "button"className = "px-4 py-2 ml-4 bg-fourth text-primary text-xl rounded-full" onClick = {() => pushToPostPage(post)}>Read More</button>
            </div>
            </form>
        </div>
      ))}

        <Modal
            isOpen = {invalidToken}
            onRequestClose = {() => setInvalidToken(false)}
            className = "text-fourth flex justify-center max-w-3xl w-full"
            overlayClassName = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <div style = {{ background: 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)', }}
            className="border-4 border-fourth py-10 px-2 h-64 space-y-4 rounded-3xl w-3/4 flex justify-center items-center">
                <div className = "text-3xl mx-3">You must first login before you are able to enter the posts!</div>
            </div>
        </Modal>
    </div>
  );
};
export default MyPostList;