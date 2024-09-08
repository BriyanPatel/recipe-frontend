"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";
import RecipeCard from "../recipecard/page";
import { Loader } from "lucide-react";

/**
 * Page component that renders a navbar with links to search, favorites, login, and register,
 * depending on whether the user is logged in or not.
 *
 * @returns {JSX.Element} The page component.
 */
const Page = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);

  useCallback(() => {
    const fetchRandom = async () => {
      try {
        const data = await api.get("/recipes/randomRecipe");
        setRecipes(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRandom();
  }, recipes);

  /**
   * Logs the user out by removing the token from local storage and redirecting
   * them to the homepage.
   */
  const logout = async () => {
    await api.post(`/users/logout`);
    localStorage.clear();
    router.push("/");
  };

  return (
    <>
      <nav className="bg-gray-100 dark:bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            Recipe Finder
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/search"
              className="text-gray-700 dark:text-gray-200 hover:underline"
            >
              Search
            </Link>

            <Link
              href="/favorites"
              className="text-gray-700 dark:text-gray-200 hover:underline"
            >
              Favorites
            </Link>
            <button
              className="text-gray-700 dark:text-gray-200 hover:underline"
              onClick={() => logout()}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-3">
            <RecipeCard
              key={recipe.id}
              recipe={{
                title: recipe.title,
                summary: recipe.summary || "No description available.",
                ingredients: recipe.ingredients || [],
                image: recipe.image || "/placeholder.png",
                sourceUrl: recipe.sourceUrl || "#",
              }}
              from="search"
            />
          </div>
        ))
      ) : (
        <p className="flex justify-center items-center m-3 text-center text-lg text-gray-500 dark:text-gray-400">
          <Loader className="animate-spin h-5 w-5" />
        </p>
      )}
    </>
  );
};

export default Page;
