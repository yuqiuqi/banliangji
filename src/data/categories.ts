import type { CategoriesJsonRoot, CategoryItem } from "../types/models";
import raw from "../../assets/categories.json";

const data = raw as CategoriesJsonRoot;

export function getCategoriesRoot(): CategoriesJsonRoot {
  return data;
}

export function flattenCategories(): {
  expenses: CategoryItem[];
  income: CategoryItem[];
} {
  const expenses: CategoryItem[] = data.expenses.map((row) => ({
    categoryId: row.id,
    name: row.name,
    iconAssetKey: row.icon_l,
    isIncome: false,
  }));
  const income: CategoryItem[] = data.income.map((row) => ({
    categoryId: row.id,
    name: row.name,
    iconAssetKey: row.icon_l,
    isIncome: true,
  }));
  return { expenses, income };
}
