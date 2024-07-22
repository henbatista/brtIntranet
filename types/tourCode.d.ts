// types.ts
export interface TourCode {
    efacil_tourcode_id: string;
    efacil_company_iata: string;
    efacil_tourcode_backoffice: string;
    efacil_tourcode_description: string;
    efacil_tourcode_status: string;
    efacil_comission_received: number;
    efacil_comission_repassed: number;
    efacil_incentive_received: number;
    efacil_incentive_repassed: number;
    max_repasse_value: number;
    max_repasse_exception_value: number;
    hash: string;
    rebate_repasse_preset: number;
}
