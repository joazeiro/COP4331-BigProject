'use client'

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';

const PostPage = () => 
{
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [commentPopup, setCommentPopup] = useState(false);
    const [invalidToken, setInvalidToken] = useState(false);
    const [comment, setComment] = useState('');
    const apiUrl = process.env.API_URL;
    const [postID, setPostID] = useState('');

    useEffect(() => 
    {
        // It will retrieve the postID and token once the page has been loaded
        if (typeof window !== 'undefined') 
        {
            setPostID(localStorage.getItem('postID'));
            setToken(localStorage.getItem('personalToken'));
        }
    }, []);

    useEffect(() =>
    {
        // For the pop up when you have an invalid token for being inactive for too long
        let timer
        if (invalidToken)
        {
            timer = setTimeout(() => 
            {
                setInvalidToken(false);
                router.push('/login');
            }, 3000)
        }

        return () => clearTimeout(timer);
    }, [invalidToken])

    const openCommentPopup = () =>
    {
        setCommentPopup(true);
    }

    const closeCommentPopup = () =>
    {
        setCommentPopup(false);
    }

    const submitComment = async (e) =>
    {
        e.preventDefault();
        const retrievedPostID = localStorage.getItem('postID');
        const personalToken = localStorage.getItem('personalToken');
        try
        {
            const response = await fetch(apiUrl + '/new-comment',
            {
                method: 'POST',
                headers:
                {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(
                {
                    id: retrievedPostID,
                    token: personalToken,
                    body: comment
                }),
            
            });

            if (response.ok)
            {
                const data = await response.json();
                localStorage.setItem('personalToken', data.token);
                closeCommentPopup();

                // Clears the comment field
                setComment('');
                fetchDetails();
            }

            if (response.status == 404)
            {
                setInvalidToken(true);
            }
        }
        catch (error)
        {
            console.log(data.Error);
        }
    }

    const fetchDetails = async () => 
    {
        try 
        {
            const response = await fetch(apiUrl + '/find-post', 
            {
                method: 'POST',
                headers: 
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                    id: postID,
                    token: token,
                }),
            });

            if (response.ok) 
            {
                const postData = await response.json();
                const token = postData.token;
                localStorage.setItem('personalToken', token);
                setToken(token);
                setPost(postData.post); // Access the 'post' property
                setLoading(false);
            }

            if (response.status == 404)
            {
                setLoading(false);
                setInvalidToken(true);
            }
        } 
        catch (error) 
        {
            console.log(error);
        }
    };

    useEffect(() => 
    {
        // If all these are true, it will load.
        // With this, it prevent a triple flash effect that occurs when
        // Any one of the variables in the use effect change
        if (postID && token && loading)
        {
            fetchDetails();
        }
        
    }, [apiUrl, token, postID, loading]);

    if (loading) 
    {
        return (
            <div className = "flex items-center justify-center">
                <div className = "text-black text-center text-5xl inline-block rounded-full px-8 py-4 bg-primary">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div>
            {post ? (
                <div key = {post._id} className = "mb-8 text-fourth">
                    <form style = {{ background: 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)', }}
                    className = "border-4 border-fourth py-10 px-4 space-y-4 rounded-3xl">
                        { /* The Post Field */ }
                        <div className = "flex justify-between">
                            Created By {post.author} <span className = "ml-20">Posted On: {post.posted}</span>
                        </div>
                        <div className = "text-4xl">
                            {post.title}
                            <span className = "ml-10 text-3xl text-fourth inline-block bg-primary px-3 py-2 rounded-full">{post.tag}</span>
                        </div>
                        <div className = "text-lg">{post.content}</div>
                        <div className = "flex justify-end">
                            <button
                                type = "button"
                                className = "px-4 py-2 ml-4 bg-fourth text-primary text-xl rounded-full"
                                onClick = {openCommentPopup}>
                                Add Comment
                            </button>
                        </div>
                    </form>

                    { /* Modal Field for adding comments */ }
                    <Modal
                        isOpen = {commentPopup}
                        onRequestClose = {closeCommentPopup}
                        className = "text-fourth flex justify-center max-w-7xl w-full"
                        overlayClassName = "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                    >
                        <div style = {{ background: 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)', }}
                        className="border-4 border-fourth py-10 px-2 space-y-4 rounded-3xl w-3/4">
                            <div className = "text-2xl font-bold mb-4 text-center justify-center">Add a Comment</div>
                            <div className = "text-xl my-2 text-center justify-center">Comment on your shared experiences, ask questions, or simply say how cool their story was!</div>
                            <form>
                            <div className = "mt-4">
                                <textarea
                                id = "comment"
                                name = "comment"
                                required
                                className = "appearance-none rounded relative block h-64 w-full text-lg px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value = {comment}
                                onChange = {(e) => setComment(e.target.value)}
                                />
                            </div>
                            <div className = "flex justify-center mt-6">
                                <button
                                type = "submit"
                                className = "px-4 py-2 bg-fourth text-primary text-xl rounded-full"
                                onClick = {submitComment}
                                >
                                Submit
                                </button>
                            </div>
                            </form>
                        </div>
                        </Modal>

                    { /* Modal for invalid token */ }
                    <Modal
                        isOpen = {invalidToken}
                        onRequestClose = {() => setInvalidToken(false)}
                        className = "text-fourth flex justify-center max-w-3xl w-full"
                        overlayClassName = "fixed inset-0 bg-black bg-opacity-50 flex justify-center"
                    >
                        <div style = {{ background: 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)', }}
                        className="border-4 border-fourth py-10 px-2 h-64 space-y-4 rounded-3xl w-3/4 flex justify-center items-center">
                            <div className = "text-3xl mx-3">Your login has expired, please login again!</div>
                     </div>
                    </Modal>

                    <div className = "flex items-center justify-center">
                        <div className = "text-3xl inline-block bg-fourth text-primary rounded-full px-20 py-2 mt-8 text-center">Comments</div>
                    </div>
                        {post.comments && post.comments.length > 0 ? (
                            <div>
                                { /* Comments Field and it's display */ }
                                {post.comments.map((comment, index) => (
                                    <form key = {index} style = {{ background: 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)', }}
                                    className="border-4 border-fourth py-10 px-4 space-y-4 rounded-3xl mt-8">
                                        <div>
                                            <div className = "flex justify-between">
                                                <div>
                                                    Comment By: {comment.author}
                                                </div>
                                                <div>
                                                    Posted On: {comment.posted}
                                                </div>
                                            </div>
                                            <div className = "mt-10">
                                                {comment.content}
                                            </div>
                                        </div>
                                    </form>
                                ))}
                            </div>
                        ) : (
                            <div className = "flex items-center justify-center mt-10">
                                <div className = "inline-block bg-fourth text-primary rounded-full px-4 py-2 text-3xl">Be The First to Comment!</div>
                            </div>
                        )}
                </div>
            ) : (
                <p>Post not found.</p>
            )}
        </div>
    );
};

export default PostPage;
