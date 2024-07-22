export interface TWarnings {
    advice_branch_id?: string;
    advice_department_id?: string;
    advice_user_id?: string;
    advice_id?: string;
    advice_title: string;
    advice_description?: string;
    advice_attach_name?: string;
    advice_img?: File | string;
    advice_original_name?: string;
    advice_start_date?: string | Date;
    advice_end_date?: string | Date;
    advice_start_event?: string | Date;
    advice_end_event?: string | Date;
    advice_status?: string;
}
