import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CreatePost = () => {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [tag, setTag] = useState('');
    const [content, setContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    const apiUrl = process.env.API_URL;

    const handleCreatePost = async (e) =>
    {
        e.preventDefault();
        const token = localStorage.getItem('personalToken');

        try
        {
            const response = await fetch(apiUrl + '/new-post',
            {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        token: token,
                        title: title,
                        tag: tag,
                        body: content
                    }
                )
            });

            if (response.ok)
            {
                const data = await response.json();
                const authToken = data.token;
                localStorage.setItem('personalToken', authToken)
                router.push('/')
            }

            if (response.status === 404)
            {
                setErrorMessage(data.Error);
            }
        }

        catch(error)
        {
            console.log('An Error Occurred', error);
        }
    }

    return (
        <div>
            <form style={{ background: 'linear-gradient(125deg, rgba(236,229,199,1) 0%, rgba(205,194,174,1) 50%, rgba(168,157,135,1) 100%)' }} className="border-4 border-fourth py-10 px-4 space-y-4 rounded-3xl" onSubmit={handleCreatePost}>            
                <div className = "text-center text-fourth text-5xl">Create Post
                    <div className = "text-center flex-center text-fourth text-xl py-2">Here, you can do whatever your heart desires! You can ask
                    questions, discuss your favorite memories, or recommend to other people the cool things you have seen in your trip!</div>
                </div>
                <div className = "px-10">
                    <label className="text-fourth text-xl">Title</label>
                        <input 
                            id="title" 
                            name="title" 
                            type="text" 
                            required
                            className="appearance-none rounded relative block w-full px-5 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                </div>
                <div className = "px-10">
                    <label className = "text-fourth text-xl flex">Tag</label>
                    <div className = "text-fourth mt-2 flex">This is where you would put your country of topic</div>
                    <input
                        id="tag"
                        name="tag"
                        type="text"
                        required
                        className="appearance-none rounded flex relative w-full px-5 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={tag}
                        onChange={e => setTag(e.target.value)}
                    />
                </div>
                <div className = "px-10">
                    <label className = "text-fourth text-xl">Content</label>
                    <textarea
                        id="content"
                        name="content"
                        required
                        className="appearance-none rounded relative block h-60 w-full px-5 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={content}
                        onChange = {e => setContent(e.target.value)}
                    />
                </div>
                <div className = "px-40">
                    <button type="Submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-fourth hover:bg-third focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Create Post
                    </button>
                </div>
                <div className = "flex items-center justify-center">
                    <div className = "text-lg text-center text-black">{errorMessage}</div>
                </div>
            </form>
        </div>
    )
}

export default CreatePost