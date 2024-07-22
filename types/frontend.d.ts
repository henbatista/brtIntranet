import { TBranch } from "./branch";
import { TDepartament } from "./departament";
import { TPosition } from "./position";

export interface User {
    id: any;
    user_id: string;
    user_branch_id: number;
    user_department_id: number;
    user_position_id: number;
    user_name: string;
    email: string;
    user_email: string;
    password: string;
    confirm_password: string;
    user_status: bollean;
    user_username?: string;
    user_google?: string;
    user_birth_date?: Date;
    user_cpf: string;
    user_branch_name?: string;
    user_permissions: string[];
    user_position_name?: string;
    user_text_area?: string;
    department?: TDepartament;
    user_department?: TDepartament;
    branch?: TBranch;
    position?: TPosition;
    roles?: Role[];
    user_roles?: string[];
    created_at?: string;
}

export interface Permission {
    id?: string;
    name: string;
    description: string;
    guard_name: string;
    pivot: {
        role_id: number;
        permission_id: number;
    };
}

export interface Role {
    name: string;
    id: string;
    description: string;
    permissions: Permission[];
    guard_name: string;
}

export interface Profile {
    profile_id: string | number;
    profile_name: string;
    permissions: Permission[];
    profile_description: string;
}

export interface AutoCompleteReturn {
    id: number;
    value: string;
}

export interface FormLogin {
    user_email: string;
    user_password: string;
}

export type ObjectUser = {
    [key: string]: string | number | Date | boolean | undefined;
};

export type ObjectResponse = {
    [key: string]: string | number | Date | boolean | undefined;
};

type ObjectAgency = {
    [key: string]: string | number;
};

export interface Agency {
    agency_name?: string;
    agency_main_name?: string;
    agency_branch?: string;
    agency_id?: string;
    agency_branch_id?: string;
    agency_address?: string;
    agency_city?: string;
    agency_city_id?: number;
    agency_country?: string;
    agency_country_id?: number;
    agency_branch_code?: string;
    agency_phone?: string;
    agency_cnpj?: string;
    agency_status?: boolean;
    agency_car?: string;
    agency_special_billing?: string;
    agency_total_local_billing?: number;
    branch: {
        branch_id: number;
        branch_city: string;
        branch_name: string;
        branch_region_id: number;
        branch_phone: string;
        branch_alias: string;
        branch_status: boolean;
        created_at: date;
        updated_at: date;
    };
}

type ObjectRegion = {
    [key: string]: string | boolean;
};

export interface Region {
    region_name: string;
    region_status: boolean;
}

type ObjectFaq = {
    [key: string]: string | number | boolean;
};
export interface Faq {
    faq_department_id: number;
    faq_question: string;
    faq_answer: string;
    faq_status: boolean;
    faq_id: string;
}

type ObjectCompany = {
    [key: string]: string | number | boolean;
};
export interface Company {
    company_address: string;
    company_comments: string;
    company_company_type: number;
    company_efacil_id: number;
    company_email: string;
    company_flight_type: number;
    company_iata_code: string;
    company_iata_number: number;
    company_icon: string;
    company_id: number;
    company_logo: string;
    company_name: string;
    company_phones: string;
    company_postal_code: string;
    company_website: string;
    company_status: boolean;
}
type ObjectBranch = {
    [key: string]: string | number | boolean | undefined;
};

type ObjectContactType = {
    [key: string]: string | number | boolean;
};
export interface ContactType {
    contact_type_id: number;
    contact_type_name: string;
    contact_type_status: boolean;
}

type ObjectCard = {
    [key: string]: string | number | boolean;
};
export interface Company {
    credit_card_id: Number;
    credit_card_efacil_id: Number;
    credit_card_name: String;
    credit_card_abreviation: Number;
    credit_card_logo: String;
    credit_card_status: Boolean;
}
export interface Command {
    command_id: number;
    command_description: string;
    command_system_type: string;
    command_airline: string;
    command_validity: string;
    command_name: string;
    command_status: boolean;
}
