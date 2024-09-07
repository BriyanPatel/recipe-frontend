"use client";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import RecipeCard from "../recipecard/page";
import { useRouter } from 'next/navigation'

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

  useEffect(() => {
    /**
     * Fetches the user's favorite recipes from the API and sets the state accordingly.
     *
     * If the API call fails, it sets an error message in the state.
     */
    const fetchFavorites = async () => {
      try {
        const res = await api.get(`/recipes/favorites`);
        setFavorites(res.data.data);
        setError("");
      } catch (err) {
        setError("Error fetching favorite recipes");
      }
    };
    fetchFavorites();
  }, []);

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
  console.log(favorites, "asdad");
  return (
    <div className="flex items-center justify-center flex-col">
      <h2 className="text-2xl font-bold mb-6 m-4">Your Favorite Recipes</h2>
      {error && <p className="text-red-500">{error}</p>}
      {favorites.length === 0 ? (
        <p className="text-md text-muted-foreground">
          You have no favorite recipes yet please add some go to{" "}
          <span className="text-sky-700 hover:underline cursor-pointer" onClick={() => router.push("/search")}>Search</span>.
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
              }}
              onFavorite={handleUnfavorite}
              isFavorite={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
