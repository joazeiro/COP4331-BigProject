// The solution I found in order to shares variables across components.
// Any Children of this component will have access to the 
// Search Context and the variables searchQuery and setSearchQuery

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