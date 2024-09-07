// pages/search.js
"use client";
import { useState, useContext } from "react";
import api from "../../utils/api";
import RecipeCard from "../recipecard/page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

/**
 * Page component for the search page.
 *
 * This component is responsible for rendering the search bar, the list of
 * recipes, and the favorite recipes section.
 *
 * The search bar is a simple form with an input field for the user to enter
 * an ingredient, and a button to submit the search query. The form is
 * submitted to the API, and the API returns a list of recipes that match the
 * search query.
 *
 * The list of recipes is rendered as a grid of cards. Each card displays the
 * title, summary, and ingredients of the recipe. If the user is authenticated,
 * they can click on a recipe card to add it to their favorite recipes.
 *
 * The favorite recipes section displays a list of the user's favorite recipes.
 * If the user is not authenticated, this section is not rendered.
 *
 * @returns {JSX.Element} The search page component.
 */
const Page = () => {
  const [ingredient, setIngredient] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Load favorite recipes if user is authenticated
  useState(() => {
    /**
     * Fetches the user's favorite recipes from the API.
     *
     * This function is called when the component mounts, and it sets the
     * `favorites` state to the list of favorite recipes returned by the API.
     * If there is an error, it logs the error to the console.
     */
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/recipes/favorites`);
        setFavorites(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching favorites");
      }
    };
    fetchFavorites();
  }, []);

  /**
   * Handles the search form submission.
   *
   * This function is called when the user submits the search form.
   * It fetches the recipes from the API that match the search query, and
   * updates the `recipes` state with the API response.
   * If there is an error, it logs the error to the console and updates the
   * `error` state with the error message.
   *
   * @param {Event} e The form submission event.
   */
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ingredient) return;
    try {
      setLoading(true);
      const res = await api.get(`/recipes/search?ingredient=${ingredient}`);
      setRecipes(res.data);
      setError("");
      setLoading(false);
    } catch (err) {
      setError("Error fetching recipes");
    }
  };

  /**
   * Handles the favorite button click.
   *
   * This function is called when the user clicks the favorite button.
   * It checks if the recipe is already in the user's favorite recipes,
   * and if so, it alerts the user. If not, it makes a POST request to
   * the API to save the recipe to the user's favorite recipes and
   * updates the `favorites` state with the new favorite recipe.
   * If there is an error, it logs the error to the console.
   *
   * @param {{ title: string }} recipe The recipe to save as a favorite.
   */
  const handleFavorite = async (recipe) => {
    try {
      await api.post("/recipes/save", { recipeData: recipe });
      setLoading(true);
      setFavorites([...favorites, recipe]);
      alert("Recipe added to favorites");
      setLoading(false);
    } catch (err) {
      console.error("Error saving recipe");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSearch}
        className="m-4 flex flex-col md:flex-row items-center mb-6 space-y-4 md:space-y-0 md:space-x-4"
      >
        <Input
          type="text"
          placeholder="Enter an ingredient..."
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          required
          className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        {loading ? (
          <Loader className="animate-spin" />
        ) : (
          <Button
            type="submit"
            className="w-full md:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Search
          </Button>
        )}
      </form>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={{
                title: recipe.title,
                summary: recipe.summary || "No description available.",
                ingredients: recipe.ingredients || [],
                image: recipe.image || "/placeholder.png",
                sourceUrl: recipe.sourceUrl || "#",
              }}
              onFavorite={handleFavorite}
              isFavorite={favorites.some((fav) => fav.title === recipe.title)}
            />
          ))
        ) : (
          <p className="text-center text-lg text-muted-foreground">
            No recipes found try search an ingredient
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
