export interface CvContactData {
    id?: number;
    cv_id?: number;
    first_name: string;
    last_name?: string | null;
    desired_job_title?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    city?: string | null;
    linkedin_url?: string | null;
    website_url?: string | null;
}

export interface CvExperienceData {
    id?: number;
    cv_id?: number;
    company_name: string;
    position: string;
    city?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    is_current: boolean;
    description?: string | null;
    sort_order: number;
}

export interface CvData {
    id: number;
    user_id: number;
    template_id?: number | null;
    title: string;
    is_published: boolean;
    created_at?: string;
    updated_at?: string;
    contact?: CvContactData | null;
    experiences?: CvExperienceData[];
}
