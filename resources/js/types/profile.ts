export interface UserExperienceItem {
    id?: number;
    company: string;
    position: string;
    location: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    description?: string | string[] | null;
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
    description?: string | null;
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
    currency?: string;
    amount?: number | null;
    range_text?: string | null;
    min_amount?: number | string | null;
    max_amount?: number | string | null;
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
        certifications?: boolean;
        portfolio?: boolean;
        resumes?: boolean;
    };
}

export interface LatestEducationInfo {
    institution: string;
    degree: string;
    major: string;
    status: string;
}

export interface JobRecommendationItem {
    job_title: string;
    career_level: string;
    work_mode: string;
    match_score: number;
    match_level: string;
    salary_estimate: string;
    match_reason: string;
    matched_skills: string[];
    skills_to_highlight: string[];
    key_responsibilities?: string[];
    search_keywords?: string;
    search_links?: {
        linkedin: string;
        jobstreet: string;
        glints: string;
        kalibrr: string;
    };
}

export interface JobRecommendationsData {
    profile_summary_insight: string;
    recommendations: JobRecommendationItem[];
}

export interface AiRubricScoreItem {
    score: number;
    label: string;
    feedback: string;
}

export interface AiActionableTip {
    title: string;
    tip: string;
    target_section?: 'profile' | 'summary' | 'preferences' | 'experiences' | 'educations' | 'skills' | 'resumes' | string;
}

export interface AiProfileScoringData {
    overall_score: number;
    grade: string;
    headline: string;
    executive_summary: string;
    rubric_scores: {
        experience_impact: AiRubricScoreItem;
        skills_relevance: AiRubricScoreItem;
        summary_clarity: AiRubricScoreItem;
        credentials_completeness: AiRubricScoreItem;
    };
    strengths: string[];
    improvements: string[];
    actionable_tips: AiActionableTip[];
}

export interface UserProfileData {
    id: number;
    user_id: number;
    full_name: string;
    avatar?: string | null;
    whatsapp_number: string;
    email: string;
    location: string;
    age: number | null;
    gender: string;
    about_me: string;
    career_level?: string;
    profile_data_source?: 'manual' | 'onboarding' | 'cv_import' | string | null;
    is_cv_import_locked?: boolean;
    portfolio_link: string;
    linkedin_url?: string;
    social_links?: Record<string, string>;
    field_of_interest: string[];
    employment_type: string[];
    expected_monthly_salary: ExpectedSalary;
    tools: string[];
    job_recommendations?: JobRecommendationsData | null;
    job_recommendations_updated_at?: string | null;
    ai_scoring?: AiProfileScoringData | null;
    ai_scoring_updated_at?: string | null;
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

