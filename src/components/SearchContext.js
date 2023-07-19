'use client'

import React, { createContext, useState } from 'react'

const SearchContext = createContext();

const SearchHandler = ({ children }) => 
{
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <SearchContext.Provider value = {{ searchQuery, setSearchQuery }}>
            {children}
        </SearchContext.Provider>
    )
}

export { SearchContext, SearchHandler };