export interface TVisit {
    visit_id?: string;
    visit_objective?: string;
    visit_agency_name?: string;
    visit_agency_address?: string;
    visit_agency_city?: string;
    visit_agency_city_uf?: string;
    visit_agency_complement?: string;
    visit_date?: Date | string;
    visit_distance_km?: string;
    visit_agency_profile?: string;
    visit_agency_perfile_additional?: string;
    visit_agency_brt_profile?: string;
    visit_activity_performed?: string;
    visit_people_contacted?: string;
    visit_comments?: string;
    visit_agency_concessions?: string;
    visit_status?: boolean;
}
