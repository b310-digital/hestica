import { create, StateCreator } from "zustand";

interface RecipeSlice {
  recipes: any[];
  ingredients: any[];
  addRecipe: (recipe: any) => void;
}

const createRecipeSlice: StateCreator<RecipeSlice> = (set) => ({
  recipes: [],
  ingredients: [],
  addRecipe: (recipe) =>
    set((state) => ({ recipes: [...state.recipes, recipe] })),
});

export const useBoundStore = create<RecipeSlice>()((...a) => ({
  ...createRecipeSlice(...a),
}));
