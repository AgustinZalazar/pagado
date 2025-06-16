export interface CountryCurrency {
    country: string
    currency: string
    code: string
    phoneCode: string
    iso: string
}


type CurrencyTotals = {
    income: number;
    expenses: number;
};

export type OtherCurrencies = {
    current: Record<string, CurrencyTotals>;
    previous: Record<string, CurrencyTotals>;
};