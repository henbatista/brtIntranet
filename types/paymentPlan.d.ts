import type { TCreditCardSystem } from "./card";

export interface TPaymentPlan {
    payment_config_id?: string;
    created_at?: string;
    updated_at?: string;
    payment_config_company_id: string;
    payment_config_description: string;
    payment_config_expiration: string;
    payment_config_offline: string;
    payment_config_code_share: string;
    payment_config_code_share_comments: string;
    payment_config_tariff_breaks: string;
    payment_config_tariff_breaks_comments: string;
    payment_config_minimum_installment: string;
    payment_config_installment_allows_multiple_payments: boolean;
    payments_info: Array<{
        credit_cards: Array<{
            credit_card_id: string;
            credit_card_efacil_id: number;
            credit_card_name: string;
            credit_card_abreviation: string;
            credit_card_logo: string;
            credit_card_status: boolean;
            created_at: string;
            updated_at: string;
            acceptedSystems: Array<{
                system_id: string;
                system_efacil_id: number;
                system_efacil_system_id: number;
                system_name: string;
                system_logo: string;
                system_type: string;
                system_status: boolean;
                created_at: string;
                updated_at: string;
            }>;
        }>;
        installments: Array<{
            payment_config_id: number;
            installment_number: number;
            installment_coefficient: string;
            installment_code: number;
            installment_fee: number;
        }>;
    }>;
}
