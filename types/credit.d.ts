export interface TCredit {
    credit_id?: string;
    credit_attendant: number | string;
    credit_agency: number;
    credit_request_type: string;
    credit_client_type: string;
    credit_invoiced_value: number;
    credit_card_value: number;
    credit_contract: number;
    credit_contract_type: string;
    credit_contract_date: string;
    credit_description: string;
    latest_credit_status: {
        credit_status_id: string;
        credit_status_name: string;
        credit_status_type: string;
        credit_status_color: string;
        credit_status_status: boolean;
        created_at: string;
        updated_at: string;
        description: string;
    };
}
