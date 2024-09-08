"use client";
import { useCallback, useEffect, useState } from "react";
import api from "../../utils/api";
import RecipeCard from "../recipecard/page";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

/**
 * Favorites component
 *
 * Shows the user's favorite recipes in a grid.
 * If the user has no favorite recipes, it shows a message.
 *
 * @returns {JSX.Element}
 */
const Favorites = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1); // Pagination state
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // To check if there are more recipes to load


  useEffect(() => {
  /**
   * Fetches the user's favorite recipes from the API.
   *
   * If the user is not logged in, it redirects them to the login page.
   * If there is an error, it logs the error to the console.
   * If successful, it updates the `favorites` state with the new favorite recipes.
   * If there are no more recipes to load, it sets `hasMore` to false.
   */
    const fetchFavorites = async () => {
      if (loading) return;
      setLoading(true);

      try {
        const res = await api.get(`/recipes/favorites`, {
          params: { page, limit: 5 },
        });
        const newFavorites = res.data.data;
        setFavorites((prevFavorites) => [...prevFavorites, ...newFavorites]);
        setError("");
        setHasMore(newFavorites.length > 0); // Check if more recipes are available
      } catch (err) {
        setError("Error fetching favorite recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [page]);

  // to track for users scrolling
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop ==
      document.documentElement.offsetHeight
    )
      return;
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  /**
   * Removes a recipe from the user's favorites.
   *
   * Note: This functionality is not implemented yet.
   * @param {object} recipe - The recipe to unfavorite
   * @returns {Promise<void>}
   */
  const handleUnfavorite = async (recipe) => {
    // Implement unfavorite functionality if backend supports it
    alert("Unfavorite functionality is not implemented yet.");
  };
  return (
    <div className="flex items-center justify-center flex-col">
      <h2 className="text-2xl font-bold mb-6 m-4">Your Favorite Recipes</h2>
      {error && <p className="text-red-500">{error}</p>}
      {favorites.length === 0 ? (
        <p className="text-md text-muted-foreground">
          You have no favorite recipes yet please add some go to{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => router.push("/search")}
          >
            Search
          </span>
          .
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={{
                title: recipe.title,
                summary: recipe.summary || "No description available.",
                ingredients: recipe.ingredients || [],
                image: recipe.image || "/placeholder.png",
                sourceUrl: recipe.sourceUrl || "#",
                id: recipe._id,
                averageRating: recipe.averageRating || 0,
              }}
              onFavorite={handleUnfavorite}
              isFavorite={true}
            />
          ))}
        </div>
      )}
      {loading && <Loader className="animate-spin h-5 w-5" />}
    </div>
  );
};

export default Favorites;
