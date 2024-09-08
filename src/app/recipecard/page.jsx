// components/RecipeCard.js
import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import api from "../../utils/api";
import { Loader } from "lucide-react";

/**
 * @param {{ title: string, summary: string, image: string }} recipe
 * @param {function({ title: string, summary: string, image: string })} onFavorite
 * @param {boolean} isFavorite
 */
/**
 * A component that displays a recipe card with a favorite button.
 * If the recipe is already favorited, the button is replaced with a message.
 * The component also displays the title, summary, and image of the recipe.
 * @example
 * <RecipeCard
 *   recipe={{ title: "My Recipe", summary: "This is a recipe", image: "https://example.com/image.jpg" }}
 *   onFavorite={(recipe) => console.log(recipe)}
 *   isFavorite={false}
 * />
 */

const RecipeCard = ({ recipe, onFavorite, isFavorite, from }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const MAX_TITLE_LENGTH = 10; // Maximum length of visible title
  const showMoreTitle = recipe.title.length > MAX_TITLE_LENGTH;

  /**
   * Handles the change of the rating select element.
   * Sets the rating state to the value of the select element.
   * @param {Event} event - The event that triggered this function
   */
  const handleRatingChange = (event) => {
    setRating(Number(event.target.value));
  };

  /**
   * Handles the submission of a rating for a recipe.
   * If the rating is valid (between 1 and 5), it calls the parent component's onRate function
   * to handle the rating submission. If the submission is successful, it sets isRatingSubmitted
   * to true and reloads the page. If the submission fails or the rating is invalid, it sets
   * setLoading to false.
   */
  const handleRatingSubmit = async () => {
    setLoading(true);
    if (rating > 0 && rating <= 5) {
      await handleRate(rating); // Call the parent component's onRate function to handle rating submission
      setIsRatingSubmitted(true);
      setLoading(false);
      window.location.reload();
    }
    setLoading(false);
  };

  /**
   * Submits a rating for the recipe to the API.
   * @param {number} rating The rating to submit, must be between 1 and 5
   * @returns {Promise<void>}
   */
  const handleRate = async (rating) => {
    try {
      await api.post(`/recipes/${recipe.id}/rate`, {
        rating: rating,
      });
      // Update UI or state if necessary
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  /**
   * Handles the review form submission.
   *
   * Prevents the default form submission, sets loading to true, and clears any error.
   * Makes a POST request to the review endpoint with the review text.
   * If the response is successful, sets the submitted state to true and reloads the page.
   * If an error occurs, logs the error to the console.
   * @returns {Promise<void>}
   */
  const handleReviewSubmit = async () => {
    try {
      setLoading(true);
      // Simulate API call for submitting review
      const data = await api.post(`/recipes/${recipe.id}/review`, {
        review: review,
      });
      setIsReviewSubmitted(true);
      setReview("");
      setLoading(false);
    } catch (error) {
      setError("Error submitting review please try again");
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-sm p-6 bg-gray-300 shadow-lg rounded-lg flex flex-col">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative w-20 h-20">
            <img
              className="w-full h-full object-cover rounded-full border-2 border-gray-200"
              src={recipe.image}
              alt={recipe.title}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {/* If title is too long, truncate and add "Show More" */}
              {isExpanded
                ? recipe.title
                : `${recipe.title.substring(0, MAX_TITLE_LENGTH)}${
                    showMoreTitle ? "..." : ""
                  }`}
              {/* Show More/Show Less toggle */}
              {showMoreTitle && (
                <button
                  className="ml-2 text-sm text-blue-500 underline"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "Show Less" : "Show More"}
                </button>
              )}
            </h2>
            <p className="text-sm text-gray-700 mt-1">{recipe.summary}</p>
          </div>
        </div>

        <div className="flex flex-col flex-grow">
          {from !== "search" && (
            <>
              <div className="mb-4">
                <p className="text-md font-semibold text-gray-900">
                  Average Rating: {recipe?.averageRating?.toFixed(1)} / 5
                </p>
              </div>

              {!isRatingSubmitted && (
                <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
                  <label className="block text-gray-800 text-lg font-semibold mb-2">
                    Rate this recipe:
                  </label>
                  <div className="flex gap-x-4 items-center">
                    <select
                      value={rating}
                      onChange={handleRatingChange}
                      className="p-2 rounded-lg bg-gray-200 text-gray-800 border border-gray-300 focus:outline-none"
                    >
                      <option value="0">Select a rating</option>
                      {[1, 2, 3, 4, 5].map((rate) => (
                        <option key={rate} value={rate}>
                          {rate}
                        </option>
                      ))}
                    </select>
                    <Button
                      onClick={handleRatingSubmit}
                      className="py-2 px-4 rounded-lg bg-blue-500 text-white shadow-md"
                    >
                      {loading ? (
                        <Loader className="animate-spin" />
                      ) : (
                        "Submit Rating"
                      )}
                    </Button>
                  </div>
                  {isRatingSubmitted && (
                    <p className="mt-2 text-green-500 text-sm">
                      Rating submitted!
                    </p>
                  )}
                </div>
              )}

              <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <label className="block text-gray-800 text-lg font-semibold mb-2">
                  Leave a review:
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows="3"
                  placeholder="Write your review here..."
                  className="w-full p-3 rounded-lg bg-gray-200 text-gray-800 border border-gray-300 focus:outline-none"
                ></textarea>
                <Button
                  onClick={handleReviewSubmit}
                  className="mt-2 py-2 px-4 rounded-lg bg-green-500 text-white shadow-md"
                >
                  {loading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Submit Review"
                  )}
                </Button>
                {isReviewSubmitted && (
                  <p className="mt-2 text-green-500 text-sm">
                    Review submitted!
                  </p>
                )}
                {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
              </div>
            </>
          )}
        </div>

        {from === "search" && (
          <div className="mt-4">
            {!isFavorite ? (
              onFavorite && (
                <Button
                  onClick={() => onFavorite(recipe)}
                  className="py-2 px-4 w-full rounded-full bg-green-500 text-white shadow-md"
                >
                  Add to Favorite
                </Button>
              )
            ) : (
              <p className="text-md text-gray-600">Already added to favorite</p>
            )}
          </div>
        )}
      </Card>
    </>
  );
};

export default RecipeCard;
