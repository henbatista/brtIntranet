import type { TSistem } from "./sistem";

export interface TCreditCardSystem {
    _id: number;
    cardId: number;
    acceptedSystems: number[];
    installments: {
        id: number;
        installment_number: number;
        installment_coefficient: string;
        installment_code: number;
        installment_fee: number;
    }[];

    systems?: TSistem[];
    credit_card_name?: string;
    credit_card_abreviation?: string;
    credit_card_status?: boolean;
    credit_card_id?: string;
}
