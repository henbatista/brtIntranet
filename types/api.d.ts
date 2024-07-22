export interface APIRESPONSE<Data extends Array<Data> = []> {
    current_page?: number | null;
    data: Data;
    first_page_url?: string;
    next_page_url?: string;
    path: string;
    per_page?: number | null;
    prev_page_url?: string;
    last_page?: number | null;
    from?: number | null;
    to?: number | null;
    total?: number | null;
}
