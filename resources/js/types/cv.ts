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
    expected_salary?: string | null;
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

export interface CvEducationData {
    id?: number;
    cv_id?: number;
    institution_name: string;
    degree?: string | null;
    field_of_study?: string | null;
    city?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    is_current: boolean;
    description?: string | null;
    sort_order: number;
}

export interface CvSkillData {
    id?: number;
    cv_id?: number;
    name: string;
    level?: string | null;
    sort_order: number;
}

export interface CvSummaryData {
    id?: number;
    cv_id?: number;
    content?: string | null;
}

export interface CvOrganizationData {
    id?: number;
    cv_id?: number;
    organization_name: string;
    role: string;
    start_date?: string | null;
    end_date?: string | null;
    duration?: string | null;
    description?: string | null;
    sort_order: number;
}

export interface CvCertificationData {
    id?: number;
    cv_id?: number;
    name: string;
    issuer: string;
    issue_date?: string | null;
    expiration_date?: string | null;
    validity_period?: string | null;
    sort_order: number;
}

export interface CvAwardData {
    id?: number;
    cv_id?: number;
    title: string;
    subtitle?: string | null;
    year?: string | null;
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
    educations?: CvEducationData[];
    skills?: CvSkillData[];
    summary?: CvSummaryData | null;
    organizations?: CvOrganizationData[];
    certifications?: CvCertificationData[];
    awards?: CvAwardData[];
}
