export interface CareerRoleItem {
    id: string;
    name: string;
    category: string;
    categoryTitle: string;
    popularSkills?: string[];
}

export interface CareerCategoryItem {
    id: string;
    title: string;
    description: string;
    icon: string;
    roles: string[];
    popular_skills: string[];
}

export const CAREER_CATEGORIES: CareerCategoryItem[] = [
    {
        id: 'tech-engineering',
        title: 'Software & Technology',
        description: 'Full Stack, Frontend, Backend, Mobile, DevOps, Cloud Engineering',
        icon: 'Code',
        roles: [
            'Full Stack Developer',
            'Frontend Developer',
            'Backend Developer',
            'Mobile App Developer',
            'DevOps & Cloud Engineer',
            'QA & Automation Engineer',
            'Cybersecurity Specialist',
            'System Architect',
        ],
        popular_skills: ['JavaScript', 'TypeScript', 'PHP', 'Laravel', 'React', 'Node.js', 'Python', 'Docker', 'PostgreSQL', 'Git'],
    },
    {
        id: 'data-ai',
        title: 'Data Science & Artificial Intelligence',
        description: 'Data Analytics, Machine Learning, Data Engineering, Business Intelligence',
        icon: 'Brain',
        roles: [
            'Data Analyst',
            'Data Scientist',
            'Data Engineer',
            'Machine Learning Engineer',
            'Business Intelligence Analyst',
            'AI Prompt Engineer',
        ],
        popular_skills: ['Python', 'SQL', 'Pandas', 'Power BI', 'Tableau', 'Scikit-learn', 'TensorFlow', 'PostgreSQL', 'Excel'],
    },
    {
        id: 'product-design',
        title: 'UI/UX & Product Design',
        description: 'User Experience, Interaction Design, Visual Design, User Research',
        icon: 'Palette',
        roles: [
            'UI/UX Designer',
            'Product Designer',
            'UX Researcher',
            'Interaction Designer',
            'Graphic & Visual Designer',
            'Design System Lead',
        ],
        popular_skills: ['Figma', 'Wireframing', 'Prototyping', 'User Research', 'Design System', 'Adobe Illustrator', 'Usability Testing'],
    },
    {
        id: 'product-management',
        title: 'Product & Project Management',
        description: 'Product Strategy, Agile / Scrum, Delivery Management, Technical Planning',
        icon: 'Briefcase',
        roles: [
            'Product Manager',
            'Associate Product Manager',
            'Project Manager',
            'Scrum Master',
            'Technical Program Manager',
            'Product Owner',
        ],
        popular_skills: ['Jira', 'Agile/Scrum', 'Product Roadmap', 'User Stories', 'PRD Writing', 'A/B Testing', 'Stakeholder Management'],
    },
    {
        id: 'marketing-growth',
        title: 'Digital Marketing & Content',
        description: 'Performance Marketing, SEO, Social Media, Content Strategy, Copywriting',
        icon: 'TrendingUp',
        roles: [
            'Digital Marketing Specialist',
            'SEO Specialist',
            'Social Media Manager',
            'Growth Marketer',
            'Content Strategist / Copywriter',
            'Performance Marketing Lead',
        ],
        popular_skills: ['Google Ads', 'Meta Ads', 'SEO', 'Google Analytics 4', 'Copywriting', 'Content Marketing', 'Canva'],
    },
    {
        id: 'finance-business',
        title: 'Finance, Accounting & Business',
        description: 'Financial Analysis, Accounting, Business Development, Consulting',
        icon: 'DollarSign',
        roles: [
            'Financial Analyst',
            'Accountant',
            'Business Analyst',
            'Business Development',
            'Auditor',
            'Tax Consultant',
        ],
        popular_skills: ['Financial Modeling', 'Microsoft Excel', 'Financial Reporting', 'Taxation', 'SAP', 'Accounting'],
    },
    {
        id: 'hr-operations',
        title: 'Human Resources & Operations',
        description: 'Talent Acquisition, People Operations, Administration, General Affairs',
        icon: 'Users',
        roles: [
            'HR Generalist',
            'Technical Recruiter',
            'People Operations',
            'Operations Specialist',
            'Administrative Assistant',
            'Talent Development Specialist',
        ],
        popular_skills: ['Recruitment', 'ATS Systems', 'Employee Relations', 'Payroll', 'Performance Management', 'Communication'],
    },
    {
        id: 'sales-support',
        title: 'Sales & Customer Experience',
        description: 'Sales Executive, Customer Success, Account Management, Support',
        icon: 'Headphones',
        roles: [
            'Customer Success Specialist',
            'Account Executive',
            'Sales Development Representative',
            'Customer Support Specialist',
            'Client Relationship Manager',
        ],
        popular_skills: ['CRM (HubSpot/Salesforce)', 'Client Communication', 'Negotiation', 'Zendesk', 'Customer Retention'],
    },
];

/**
 * Flatten all roles into a single list with category metadata for instant searching.
 */
export const ALL_CAREER_ROLES: CareerRoleItem[] = CAREER_CATEGORIES.flatMap((category) =>
    category.roles.map((roleName) => ({
        id: `${category.id}-${roleName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: roleName,
        category: category.id,
        categoryTitle: category.title,
        popularSkills: category.popular_skills,
    }))
);
