// HighlightContext.js
import React, { createContext, useState } from 'react';

export const HighlightContext = createContext();

export const HighlightProvider = ({ children }) => {
    const [highlightedAddress, setHighlightedAddress] = useState(null);

    return (
        <HighlightContext.Provider value={{ highlightedAddress, setHighlightedAddress }}>
            {children}
        </HighlightContext.Provider>
    );
};
