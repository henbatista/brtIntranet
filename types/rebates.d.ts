// rebates.d.ts
export interface RebatesPayload {
    rebate_template_id: number;
    rebate_template_created_by: string;
    rebate_template_name: string;
    rebate_template_comments: string;
    rebate_template_status: boolean;
    rebates: [
        {
            rebate_id: string;
            rebate_template_id: number;
            rebate_tourcode_id: number;
            rebate_company_iata: string;
            rebate_tourcode_backoffice: string;
            rebate_tourcode_description: string;
            rebate_tourcode_status: boolean;
            rebate_comission_received: number;
            rebate_comission_repassed: number;
            rebate_incentive_received: number;
            rebate_incentive_repassed: number;
            rebate_repasse_preset: number;
        }
    ];
    user: {
        id: number;
        user_branch_id: number;
        user_department_id: number;
        user_position_id: number;
        user_name: string;
        email: string;
        user_email_verified_at: string;
        user_status: boolean;
        user_username: string;
        user_google: string;
        user_birth_date: string;
        user_cpf: string;
        created_at: string;
        email;
        user_name: string;
        updated_at: string;
    };
}
