"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'

/**
 * Page component that renders a navbar with links to search, favorites, login, and register,
 * depending on whether the user is logged in or not.
 *
 * @returns {JSX.Element} The page component.
 */
const Page = () => {
  const router = useRouter();
  const [user, setUser] = useState(false)
  useEffect(() => {
    localStorage.getItem('token') ? setUser(true) : setUser(false)
  }, [])

  /**
   * Logs the user out by removing the token from local storage and redirecting
   * them to the homepage.
   */
  const logout = () => {
    localStorage.removeItem('token')
    router.push("/")
  }
  return (
    <nav className="bg-gray-100 dark:bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className='text-xl font-bold text-gray-900 dark:text-white'>
          Recipe Finder
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/search" className='text-gray-700 dark:text-gray-200 hover:underline'>
            Search
          </Link>
          {user ? (
            <>
              <Link href="/favorites" className='text-gray-700 dark:text-gray-200 hover:underline'>
                Favorites
              </Link>
              <button
                className="text-gray-700 dark:text-gray-200 hover:underline"
                onClick={() => logout()}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className='text-gray-700 dark:text-gray-200 hover:underline'>
                Login
              </Link>
              <Link href="/register" className="text-gray-700 dark:text-gray-200 hover:underline">
               Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Page;
