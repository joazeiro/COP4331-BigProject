'use client'

import { useEffect, useState } from 'react';

const page = () => 
{
    const [postID, setPostID] = useState('');
    useEffect(() => 
    {
        const storedID = localStorage.getItem('postID');
        setPostID(storedID);

    })
    return (
        <div className = "text-5xl text-center">{postID}</div>
    )
}

export default page