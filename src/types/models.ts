/** 与 Swift `AmountType` 对齐：1 支出，2 收入 */
export type BillAmountKind = 1 | 2;

export interface Bill {
  id: number;
  type: BillAmountKind;
  categoryId: number;
  icon: string | null;
  name: string | null;
  remark: string | null;
  amount: string | null;
  createTime: number | null;
  updateTime: number | null;
  billTime: number | null;
}

/** SQLite 行（expo-sqlite getAllSync 映射） */
export interface BillRow {
  id: number;
  type: number;
  categoryId: number;
  icon: string | null;
  name: string | null;
  remark: string | null;
  amount: string | null;
  createTime: number | null;
  updateTime: number | null;
  billTime: number | null;
}

export interface CategoryJsonRow {
  icon_n: string;
  icon_l: string;
  icon_s: string;
  id: number;
  is_system: number;
  is_income: number;
  name: string;
}

export interface CategoriesJsonRoot {
  expenses: CategoryJsonRow[];
  income: CategoryJsonRow[];
}

export interface CategoryItem {
  categoryId: number;
  name: string;
  iconAssetKey: string;
  isIncome: boolean;
}

export interface DayBillGroup {
  dateKey: string;
  bills: Bill[];
}

export type ChartGranularity = "week" | "month" | "year";

export interface ChartPeriod {
  key: string;
  label: string;
  startMs: number;
  endMsExclusive: number;
  granularity: ChartGranularity;
}

export interface CategorySpend {
  categoryId: number;
  name: string;
  icon: string | null;
  amount: number;
  ratio: number;
}

export interface ChartPoint {
  label: string;
  amount: number;
  hasData: boolean;
}
