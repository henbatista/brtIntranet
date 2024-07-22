import type { Company } from "./frontend";

export interface TFinance {
    finance_flight_company_id: number;
    finance_flight_cia_name?: string;
    finance_description?: string;
    finance_type?: string;
    finance_status: Boolean;
    finance_id?: string;
    created_at?: string;
    updated_at?: string;

    company?: Company;
}
