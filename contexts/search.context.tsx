import React, {createContext, useState, useContext, useEffect} from 'react';

export interface SearchType {
  city?: string;
  district?: string;
}

interface SearchContextType {
  search: SearchType;
  updateSearch: (search: SearchType) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [search, setSearch] = useState<SearchType>({});

  useEffect(() => {}, [search]);

  const updateSearch = (search: SearchType) => {
    setSearch(search);
  };
  const clearSearch = () => {
    setSearch({});
  };

  return (
    <SearchContext.Provider value={{search, updateSearch, clearSearch}}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within an SearchProvider');
  }
  return context;
};
