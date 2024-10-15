'use client';
import { Posteo } from '@/interfaces/types';
import { usePostStore } from '@/store/post-store';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { LinearProgress } from '@mui/material';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const WAIT_BETWEEN_CHANGE = 300;
const BASE_URL = 'https://ucse-iw-2024.onrender.com/comunicaciones/search/?q=';

export default function Search({ placeholder }: { placeholder: string }) {
  const [searchResults, setSearchResults] = useState<Posteo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setPosteo } = usePostStore();

  const handleSearch = useDebouncedCallback(async (term) => {
    if (term) {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}${encodeURIComponent(term)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error(error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  }, WAIT_BETWEEN_CHANGE);

  const handleSelectPost = (post: Posteo) => {
    setPosteo(post);
    setSearchResults([]);
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        // defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      {isLoading && <LinearProgress />}
      {searchResults.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border border-black rounded-md mt-1">
          {searchResults.map((result, index) => (
            <li key={index} className="p-2 hover:bg-gray-100" onClick={() => handleSelectPost(result)}>
              {/* Renderiza aquí los detalles del resultado */}
              {JSON.stringify(result.titulo)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
