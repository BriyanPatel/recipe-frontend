// components/RecipeCard.js
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


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
const RecipeCard = ({ recipe, onFavorite, isFavorite }) => {
  return (
    <>
      <Card className="w-full h-full p-8">
        <CardHeader className="px-0 pt-0">
          <CardTitle>{recipe.title}</CardTitle>
          <CardDescription>{recipe.summary}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-0 pb-0">
          <img
            className="w-full h-48 object-cover"
            src={recipe.image}
            alt={recipe.title}
          />
          {!isFavorite ? (
            onFavorite && (
              <Button
                onClick={() => onFavorite(recipe)}
                className="py-2 px-4 rounded bg-green-500 hover:bg-green-700 text-white"
              >
                Favorite
              </Button>
            )
          ) : (
            <p className="text-md text-muted-foreground">
              Already added to favorite
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default RecipeCard;
