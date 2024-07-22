export interface TBranch {
    branch_id: string;
    branch_city: TCity;
    branch_name: string;
    branch_region_id?: number;
    branch_phone: string;
    branch_alias: string;
    branch_status: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    region: TRegion;
}

export interface TCity {
    city_id: string;
    city_name: string;
    city_federation_unit: string;
    city_federation_unit_name?: string;
    city_country: string;
    city_iata: string;
    city_country_id: string;
}

export interface TRegion {
    region_id: string;
    region_name: string;
    region_status: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
}
