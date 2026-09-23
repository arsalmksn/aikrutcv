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

export interface CvData {
    id: number;
    user_id: number;
    template_id?: number | null;
    title: string;
    is_published: boolean;
    created_at?: string;
    updated_at?: string;
    contact?: CvContactData | null;
}
