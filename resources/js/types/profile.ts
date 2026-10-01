export interface UserExperienceItem {
    id?: number;
    company: string;
    position: string;
    location: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    description: string[];
    sort_order?: number;
}

export interface UserEducationItem {
    id?: number;
    institution: string;
    degree: string;
    major: string;
    start_date: string;
    end_date: string;
    gpa: string;
    sort_order?: number;
}

export interface UserOrganizationItem {
    id?: number;
    organizations_name: string;
    role: string;
    start_date: string;
    end_date: string;
    duration: string;
    description: string[];
    sort_order?: number;
}

export interface UserCertificationItem {
    id?: number;
    name: string;
    issuer: string;
    issue_date: string;
    expiration_date: string;
    validity_period: string;
    sort_order?: number;
}

export interface UserAwardItem {
    id?: number;
    title: string;
    subtitle: string;
    year: string;
    description: string;
    sort_order?: number;
}

export interface UserResumeItem {
    id: number;
    file_name: string;
    file_url: string;
    file_size?: number;
    uploaded_at?: string;
}

export interface UserAttachmentItem {
    id: number;
    title: string;
    file_name: string;
    file_url: string;
    file_type?: string;
    file_size?: number;
    uploaded_at?: string;
}

export interface ExpectedSalary {
    currency: string;
    amount: number;
    is_negotiable: boolean;
}

export interface ProfileCompleteness {
    percentage: number;
    completed_sections: {
        profile: boolean;
        summary: boolean;
        preferences: boolean;
        skills: boolean;
        experiences: boolean;
        educations: boolean;
    };
}

export interface LatestEducationInfo {
    institution: string;
    degree: string;
    major: string;
    status: string;
}

export interface UserProfileData {
    id: number;
    user_id: number;
    full_name: string;
    whatsapp_number: string;
    email: string;
    location: string;
    age: number | null;
    gender: string;
    about_me: string;
    portfolio_link: string;
    field_of_interest: string[];
    employment_type: string[];
    expected_monthly_salary: ExpectedSalary;
    tools: string[];
    experiences: UserExperienceItem[];
    educations: UserEducationItem[];
    organizations: UserOrganizationItem[];
    certifications: UserCertificationItem[];
    awards: UserAwardItem[];
    resumes: UserResumeItem[];
    attachments: UserAttachmentItem[];
    total_experience: string;
    latest_education: LatestEducationInfo | null;
    completeness: ProfileCompleteness;
}
