export interface CareerSubRoleItem {
    id: string | number;
    db_id?: number;
    name: string;
    slug?: string;
    popular_skills?: string[];
}

export interface CareerSubCategoryItem {
    id: string | number;
    db_id?: number;
    name: string;
    slug?: string;
    description?: string | null;
    popular_skills?: string[];
    roles?: CareerSubRoleItem[];
}

export interface CareerRoleItem {
    id: string;
    name: string;
    category: string;
    categoryTitle: string;
    popularSkills?: string[];
}

export interface CareerCategoryItem {
    id: string;
    db_id?: number;
    title: string;
    name?: string;
    description: string;
    icon: string;
    roles: string[];
    popular_skills: string[];
    sub_categories?: CareerSubCategoryItem[];
}

export const CAREER_CATEGORIES: CareerCategoryItem[] = [
    {
        id: 'tech-engineering',
        title: 'Software & Technology',
        description: 'Rekayasa perangkat lunak, web, mobile, cloud computing, infrastruktur, dan keamanan sistem.',
        icon: 'Code',
        roles: [
            'React / Next.js',
            'Vue.js / Nuxt',
            'Laravel / PHP',
            'Node.js (Express / NestJS)',
            'Golang',
            'Python (FastAPI / Django)',
            'Flutter / Dart',
            'Docker & Kubernetes',
            'Amazon Web Services (AWS)',
        ],
        popular_skills: ['JavaScript', 'TypeScript', 'PHP', 'Laravel', 'React', 'Node.js', 'Python', 'Docker', 'PostgreSQL', 'Git'],
        sub_categories: [
            {
                id: 'frontend-web-development',
                name: 'Frontend Web Development',
                description: 'Pengembangan antarmuka pengguna web interaktif dan responsif.',
                roles: [
                    { id: 'react-nextjs', name: 'React / Next.js', popular_skills: ['React 19', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
                    { id: 'vue-nuxt', name: 'Vue.js / Nuxt', popular_skills: ['Vue 3', 'Nuxt.js', 'TypeScript', 'Tailwind CSS'] },
                    { id: 'angular', name: 'Angular', popular_skills: ['Angular', 'TypeScript', 'RxJS', 'NgRx'] },
                    { id: 'svelte-sveltekit', name: 'Svelte / SvelteKit', popular_skills: ['Svelte', 'SvelteKit', 'TypeScript', 'Vite'] },
                    { id: 'modern-css-tailwind', name: 'Modern CSS & Tailwind CSS', popular_skills: ['HTML5', 'Tailwind CSS', 'Modern CSS', 'Responsive'] },
                ],
            },
            {
                id: 'backend-web-development',
                name: 'Backend Web Development',
                description: 'Arsitektur server, logika bisnis, pemrosesan data, dan integrasi API.',
                roles: [
                    { id: 'laravel-php', name: 'Laravel / PHP', popular_skills: ['PHP 8+', 'Laravel', 'Eloquent ORM', 'MySQL', 'Redis'] },
                    { id: 'nodejs-express-nestjs', name: 'Node.js (Express / NestJS)', popular_skills: ['Node.js', 'TypeScript', 'Express.js', 'NestJS', 'Prisma'] },
                    { id: 'golang', name: 'Golang', popular_skills: ['Go (Golang)', 'Gin / Fiber', 'gRPC', 'Microservices', 'Docker'] },
                    { id: 'python-fastapi-django', name: 'Python (FastAPI / Django)', popular_skills: ['Python 3', 'FastAPI', 'Django', 'Celery', 'PostgreSQL'] },
                    { id: 'java-spring-boot', name: 'Java (Spring Boot)', popular_skills: ['Java 17+', 'Spring Boot', 'Spring Security', 'Hibernate'] },
                    { id: 'dotnet-csharp', name: 'C# / .NET', popular_skills: ['C#', '.NET 8', 'Entity Framework', 'REST API'] },
                    { id: 'api-graphql-grpc', name: 'RESTful API / GraphQL / gRPC', popular_skills: ['RESTful API', 'GraphQL', 'gRPC', 'Postman'] },
                ],
            },
            {
                id: 'fullstack-web-development',
                name: 'Full Stack Web Development',
                description: 'Pengembangan menyeluruh dari sisi klien hingga server dan database.',
                roles: [
                    { id: 'laravel-inertia-fullstack', name: 'Laravel + Inertia / React / Vue', popular_skills: ['Laravel', 'Inertia.js', 'React', 'Vue.js', 'Tailwind CSS'] },
                    { id: 'nextjs-fullstack', name: 'Next.js Full Stack', popular_skills: ['Next.js App Router', 'TypeScript', 'Server Actions', 'Prisma'] },
                    { id: 'mern-pern-stack', name: 'MERN / PERN Stack', popular_skills: ['MongoDB / PostgreSQL', 'Express.js', 'React', 'Node.js'] },
                    { id: 'python-react-fullstack', name: 'Python + React Full Stack', popular_skills: ['Python', 'FastAPI', 'React', 'TypeScript'] },
                ],
            },
            {
                id: 'mobile-application-development',
                name: 'Mobile Application Development',
                description: 'Pengembangan aplikasi mobile iOS, Android, maupun multiplatform.',
                roles: [
                    { id: 'flutter-dart', name: 'Flutter / Dart', popular_skills: ['Flutter', 'Dart', 'Bloc / Provider', 'REST API'] },
                    { id: 'react-native-expo', name: 'React Native / Expo', popular_skills: ['React Native', 'Expo', 'TypeScript', 'Redux Toolkit'] },
                    { id: 'kotlin-android-native', name: 'Kotlin / Android Native', popular_skills: ['Kotlin', 'Jetpack Compose', 'Coroutines', 'Retrofit'] },
                    { id: 'swift-ios-native', name: 'Swift / iOS Native', popular_skills: ['Swift', 'SwiftUI', 'UIKit', 'Xcode'] },
                ],
            },
            {
                id: 'cloud-devops-infrastructure',
                name: 'Cloud, DevOps & Infrastructure',
                description: 'Otomatisasi deployment, CI/CD, kontainer, dan infrastruktur cloud.',
                roles: [
                    { id: 'docker-kubernetes', name: 'Docker & Kubernetes', popular_skills: ['Docker', 'Kubernetes', 'Helm', 'Container Security'] },
                    { id: 'aws', name: 'Amazon Web Services (AWS)', popular_skills: ['AWS', 'EC2 / S3 / RDS', 'Lambda', 'CloudFront'] },
                    { id: 'gcp', name: 'Google Cloud Platform (GCP)', popular_skills: ['Google Cloud', 'Cloud Run', 'GKE', 'BigQuery'] },
                    { id: 'cicd-automation', name: 'CI/CD (GitHub Actions / GitLab CI)', popular_skills: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'Automated Testing'] },
                    { id: 'terraform-iac', name: 'Terraform & IaC', popular_skills: ['Terraform', 'Infrastructure as Code', 'Ansible'] },
                    { id: 'linux-sre-sysadmin', name: 'Linux / SRE & Server Administration', popular_skills: ['Linux', 'Nginx', 'Prometheus', 'Grafana'] },
                ],
            },
            {
                id: 'quality-assurance-testing',
                name: 'Quality Assurance & Testing',
                description: 'Penjaminan kualitas melalui pengujian otomatis, fungsional, dan performa.',
                roles: [
                    { id: 'automation-testing-playwright-cypress', name: 'Automation Testing (Playwright / Cypress)', popular_skills: ['Playwright', 'Cypress', 'Pest', 'Selenium'] },
                    { id: 'api-testing-postman-k6', name: 'API Testing (Postman / K6 / JMeter)', popular_skills: ['Postman', 'JMeter', 'K6', 'Load Testing'] },
                    { id: 'manual-testing-design', name: 'Manual Testing & Test Case Design', popular_skills: ['Test Case Design', 'Exploratory Testing', 'Bug Tracking'] },
                ],
            },
            {
                id: 'cybersecurity-network',
                name: 'Cybersecurity & Network',
                description: 'Perlindungan sistem, ethical hacking, audit keamanan, dan jaringan.',
                roles: [
                    { id: 'penetration-testing-ethical-hacking', name: 'Penetration Testing & Ethical Hacking', popular_skills: ['OWASP Top 10', 'Burp Suite', 'Ethical Hacking', 'Linux'] },
                    { id: 'soc-siem-security-ops', name: 'SOC, SIEM & Security Operations', popular_skills: ['SIEM', 'Network Security', 'Incident Response'] },
                    { id: 'network-security-firewalls', name: 'Network Security & Firewalls', popular_skills: ['TCP/IP', 'VPN', 'Firewalls', 'Wireshark'] },
                ],
            },
            {
                id: 'embedded-systems-iot',
                name: 'Embedded Systems & IoT',
                description: 'Sistem tertanam, firmware perangkat keras, dan ekosistem IoT.',
                roles: [
                    { id: 'embedded-c-cpp-microcontrollers', name: 'Embedded C / C++ & Microcontrollers', popular_skills: ['C / C++', 'Microcontrollers (STM32)', 'RTOS'] },
                    { id: 'esp32-arduino-raspberrypi-iot', name: 'ESP32 / Arduino / Raspberry Pi (IoT)', popular_skills: ['ESP32', 'Arduino', 'Raspberry Pi', 'MQTT', 'Python'] },
                ],
            },
        ],
    },
    {
        id: 'data-ai',
        title: 'Data Science & Artificial Intelligence',
        description: 'Pengolahan big data, analitik bisnis, machine learning, deep learning, dan generative AI.',
        icon: 'Brain',
        roles: [
            'SQL & Data Analysis',
            'Python Data Analysis (Pandas / NumPy)',
            'Power BI & DAX Dashboards',
            'Tableau Visual Analytics',
            'Scikit-Learn & Machine Learning',
            'PyTorch & Deep Learning',
            'LLM & Prompt Engineering (LangChain / RAG)',
            'Apache Spark & Big Data',
        ],
        popular_skills: ['Python', 'SQL', 'Pandas', 'Power BI', 'Tableau', 'Scikit-learn', 'TensorFlow', 'PostgreSQL', 'Excel'],
        sub_categories: [
            {
                id: 'data-analytics-bi',
                name: 'Data Analytics & Business Intelligence',
                description: 'Menganalisis tren data dan menyajikan dashboard visual untuk pengambilan keputusan.',
                roles: [
                    { id: 'sql-data-analysis', name: 'SQL & Data Analysis', popular_skills: ['SQL', 'PostgreSQL', 'Data Cleaning', 'Data Modeling'] },
                    { id: 'python-pandas-numpy', name: 'Python Data Analysis (Pandas / NumPy)', popular_skills: ['Python', 'Pandas', 'NumPy', 'Data Wrangling'] },
                    { id: 'power-bi-dax', name: 'Power BI & DAX Dashboards', popular_skills: ['Power BI', 'DAX', 'KPI Dashboards', 'Power Query'] },
                    { id: 'tableau-visual-analytics', name: 'Tableau Visual Analytics', popular_skills: ['Tableau Desktop', 'Data Visualization'] },
                    { id: 'excel-advanced-modeling', name: 'Microsoft Excel (Advanced Modeling)', popular_skills: ['Advanced Excel', 'Pivot Tables', 'XLOOKUP', 'VBA'] },
                ],
            },
            {
                id: 'machine-learning-ai',
                name: 'AI, Machine Learning & Deep Learning',
                description: 'Membangun model prediktif, computer vision, NLP, dan implementasi LLM.',
                roles: [
                    { id: 'scikit-learn-ml', name: 'Scikit-Learn & Machine Learning', popular_skills: ['Python', 'Scikit-Learn', 'Regression', 'Classification'] },
                    { id: 'pytorch-deep-learning', name: 'PyTorch & Deep Learning', popular_skills: ['PyTorch', 'Neural Networks', 'Computer Vision', 'CUDA'] },
                    { id: 'tensorflow-keras', name: 'TensorFlow & Keras', popular_skills: ['TensorFlow', 'Keras', 'Model Training'] },
                    { id: 'llm-prompt-rag', name: 'LLM & Prompt Engineering (LangChain / RAG)', popular_skills: ['Prompt Engineering', 'LangChain', 'OpenAI API', 'Vector DB', 'RAG'] },
                ],
            },
            {
                id: 'data-engineering-infrastructure',
                name: 'Data Engineering & Infrastructure',
                description: 'Membangun data pipeline (ETL/ELT), arsitektur data warehouse, dan streaming data.',
                roles: [
                    { id: 'apache-spark-big-data', name: 'Apache Spark & Big Data', popular_skills: ['Apache Spark', 'PySpark', 'Hadoop', 'Distributed Computing'] },
                    { id: 'airflow-etl-pipeline', name: 'Airflow & Data Pipeline (ETL / ELT)', popular_skills: ['Airflow', 'ETL / ELT', 'Python', 'Data Orchestration'] },
                    { id: 'postgresql-data-warehousing', name: 'PostgreSQL & Data Warehousing', popular_skills: ['PostgreSQL', 'Snowflake', 'BigQuery', 'Schema Design'] },
                ],
            },
        ],
    },
    {
        id: 'product-design',
        title: 'UI/UX & Product Design',
        description: 'Riset pengalaman pengguna, desain antarmuka aplikasi, visual branding, dan sistem desain.',
        icon: 'Palette',
        roles: [
            'Figma (UI Design & Prototyping)',
            'Wireframing & User Flow Architecture',
            'UX Research & Usability Testing',
            'Design Systems & Tokens (Figma)',
            'Adobe Illustrator & Vector Graphics',
            'Adobe Photoshop & Visual Assets',
        ],
        popular_skills: ['Figma', 'Wireframing', 'Prototyping', 'User Research', 'Design System', 'Adobe Illustrator', 'Usability Testing'],
        sub_categories: [
            {
                id: 'product-interaction-design',
                name: 'Product & Interaction Design',
                description: 'Mendesain interaksi, wireframe, prototype, dan user experience aplikasi digital.',
                roles: [
                    { id: 'figma-ui-prototyping', name: 'Figma (UI Design & Prototyping)', popular_skills: ['Figma', 'Prototyping', 'Auto Layout', 'Interactive Components'] },
                    { id: 'wireframing-user-flows', name: 'Wireframing & User Flow Architecture', popular_skills: ['Wireframing', 'User Flows', 'Information Architecture'] },
                    { id: 'ux-research-usability-testing', name: 'UX Research & Usability Testing', popular_skills: ['User Interviews', 'Usability Testing', 'Survey Design', 'Personas'] },
                    { id: 'interaction-design-micro-animations', name: 'Interaction Design & Micro-animations', popular_skills: ['Micro-interactions', 'Smart Animate', 'Framer', 'Lottie'] },
                ],
            },
            {
                id: 'visual-graphic-motion-design',
                name: 'Visual, Graphic & Motion Design',
                description: 'Kreasi aset visual, ilustrasi, motion graphics, dan konsistensi branding.',
                roles: [
                    { id: 'design-systems-tokens', name: 'Design Systems & Tokens (Figma)', popular_skills: ['Design Tokens', 'Figma Variables', 'Component Libraries'] },
                    { id: 'adobe-illustrator-vector', name: 'Adobe Illustrator & Vector Graphics', popular_skills: ['Adobe Illustrator', 'Vector Art', 'Iconography'] },
                    { id: 'adobe-photoshop-visual', name: 'Adobe Photoshop & Visual Assets', popular_skills: ['Adobe Photoshop', 'Photo Manipulation', 'Digital Assets'] },
                ],
            },
        ],
    },
    {
        id: 'product-management',
        title: 'Product & Project Management',
        description: 'Perencanaan roadmap produk, metodologi Agile/Scrum, dan koordinasi eksekusi proyek lintas divisi.',
        icon: 'Briefcase',
        roles: [
            'PRD Writing & Feature Specs',
            'Product Roadmap & Vision',
            'A/B Testing & Product Metrics',
            'Jira & Backlog Management',
            'Scrum & Sprint Planning (Agile)',
            'Project Scheduling & Timeline (Gantt)',
        ],
        popular_skills: ['Jira', 'Agile/Scrum', 'Product Roadmap', 'User Stories', 'PRD Writing', 'A/B Testing', 'Stakeholder Management'],
        sub_categories: [
            {
                id: 'product-strategy-management',
                name: 'Product Strategy & Management',
                description: 'Mendefinisikan visi, requirement, dan fitur produk berdasarkan riset pasar dan kebutuhan bisnis.',
                roles: [
                    { id: 'prd-writing-specs', name: 'PRD Writing & Feature Specs', popular_skills: ['PRD Writing', 'User Stories', 'Acceptance Criteria'] },
                    { id: 'product-roadmap-vision', name: 'Product Roadmap & Vision', popular_skills: ['Product Roadmap', 'Prioritization (RICE)', 'Stakeholder Management'] },
                    { id: 'ab-testing-product-metrics', name: 'A/B Testing & Product Metrics', popular_skills: ['A/B Testing', 'Funnel Analysis', 'Mixpanel', 'KPI Tracking'] },
                    { id: 'jira-backlog-management', name: 'Jira & Backlog Management', popular_skills: ['Jira', 'Backlog Refinement', 'Confluence'] },
                ],
            },
            {
                id: 'agile-delivery-project-management',
                name: 'Agile Delivery & Technical Project Management',
                description: 'Memfasilitasi ritme kerja tim, sprint planning, eliminasi hambatan, dan ketepatan timeline.',
                roles: [
                    { id: 'scrum-sprint-planning', name: 'Scrum & Sprint Planning (Agile)', popular_skills: ['Scrum Framework', 'Sprint Planning', 'Daily Standups', 'Retrospectives'] },
                    { id: 'project-scheduling-timeline', name: 'Project Scheduling & Timeline (Gantt)', popular_skills: ['Gantt Charts', 'Timeline Tracking', 'Risk Mitigation', 'Asana'] },
                ],
            },
        ],
    },
    {
        id: 'marketing-growth',
        title: 'Digital Marketing & Content',
        description: 'Pemasaran digital terukur, SEO, kampanye iklan berbayar, dan strategi konten.',
        icon: 'TrendingUp',
        roles: [
            'Google Ads & PPC Campaigns',
            'Meta Ads (Facebook & Instagram)',
            'Technical SEO & On-Page / Off-Page',
            'Google Analytics 4 & Conversion Tracking',
            'Copywriting & Content Strategy',
            'Social Media Campaign Planning',
        ],
        popular_skills: ['Google Ads', 'Meta Ads', 'SEO', 'Google Analytics 4', 'Copywriting', 'Content Marketing', 'Canva'],
        sub_categories: [
            {
                id: 'performance-marketing-seo',
                name: 'Performance Marketing & SEO',
                description: 'Kampanye iklan berbayar (PPC) dan optimasi organik mesin telusur.',
                roles: [
                    { id: 'google-ads-ppc', name: 'Google Ads & PPC Campaigns', popular_skills: ['Google Ads', 'Keyword Research', 'Conversion Tracking'] },
                    { id: 'meta-ads-fb-ig', name: 'Meta Ads (Facebook & Instagram)', popular_skills: ['Meta Ads Manager', 'Audience Targeting', 'Pixel Setup'] },
                    { id: 'technical-seo', name: 'Technical SEO & On-Page / Off-Page', popular_skills: ['Technical SEO', 'Keyword Research', 'Ahrefs', 'Search Console'] },
                    { id: 'ga4-conversion-tracking', name: 'Google Analytics 4 & Conversion Tracking', popular_skills: ['GA4', 'Google Tag Manager', 'Funnel Tracking'] },
                ],
            },
            {
                id: 'content-social-media-strategy',
                name: 'Content & Social Media Strategy',
                description: 'Pembuatan konten copywriting, kurasi media sosial, dan pertumbuhan komunitas.',
                roles: [
                    { id: 'copywriting-content-strategy', name: 'Copywriting & Content Strategy', popular_skills: ['Sales Copywriting', 'Content Strategy', 'Email Marketing'] },
                    { id: 'social-media-campaign-planning', name: 'Social Media Campaign Planning', popular_skills: ['Content Calendar', 'Social Media Analytics', 'Community Engagement'] },
                    { id: 'tiktok-reels-content', name: 'TikTok & Instagram Reels Content', popular_skills: ['Short-form Video', 'CapCut', 'Viral Content Strategy'] },
                ],
            },
        ],
    },
    {
        id: 'finance-business',
        title: 'Finance, Accounting & Business',
        description: 'Pembukuan keuangan, analisis permodalan, audit kepatuhan pajak, dan eksplorasi bisnis.',
        icon: 'DollarSign',
        roles: [
            'Financial Reporting & General Ledger',
            'Taxation (PPh, PPN & e-Faktur)',
            'SAP / Accurate Accounting Software',
            'Financial Modeling & Valuation (DCF)',
            'Budgeting, Forecasting & Variance Analysis',
            'B2B Partnership & Business Development',
        ],
        popular_skills: ['Financial Modeling', 'Microsoft Excel', 'Financial Reporting', 'Taxation', 'SAP', 'Accounting'],
        sub_categories: [
            {
                id: 'accounting-taxation',
                name: 'Accounting & Taxation',
                description: 'Penyusunan laporan keuangan, jurnal akuntansi, dan pelaporan pajak.',
                roles: [
                    { id: 'financial-reporting-gl', name: 'Financial Reporting & General Ledger', popular_skills: ['Balance Sheet', 'Income Statement', 'Reconciliation'] },
                    { id: 'taxation-efaktur', name: 'Taxation (PPh, PPN & e-Faktur)', popular_skills: ['e-Faktur', 'PPh 21/23/25', 'PPN', 'SPT Tahunan'] },
                    { id: 'sap-accurate-accounting', name: 'SAP / Accurate Accounting Software', popular_skills: ['Accurate Online', 'SAP ERP', 'Jurnal.id'] },
                ],
            },
            {
                id: 'finance-business-strategy',
                name: 'Finance & Business Strategy',
                description: 'Analisis kelayakan investasi, pemodelan keuangan, dan kemitraan bisnis.',
                roles: [
                    { id: 'financial-modeling-valuation', name: 'Financial Modeling & Valuation (DCF)', popular_skills: ['Financial Modeling', 'DCF Valuation', 'Sensitivity Analysis'] },
                    { id: 'budgeting-forecasting-variance', name: 'Budgeting, Forecasting & Variance Analysis', popular_skills: ['Budgeting', 'Variance Analysis', 'Cash Flow'] },
                    { id: 'b2b-partnership-strategy', name: 'B2B Partnership & Business Development', popular_skills: ['B2B Sales', 'Partnership Agreement', 'Lead Prospecting'] },
                ],
            },
        ],
    },
    {
        id: 'hr-operations',
        title: 'Human Resources & Operations',
        description: 'Perekrutan talenta, pengembangan SDM, penggajian, dan operasional organisasi.',
        icon: 'Users',
        roles: [
            'Talent Sourcing & Candidate Screening',
            'ATS Systems & Recruitment Funnel',
            'Payroll & Compensation (BPJS / PPh 21)',
            'Employee Relations & KPI Performance',
        ],
        popular_skills: ['Recruitment', 'ATS Systems', 'Employee Relations', 'Payroll', 'Performance Management', 'Communication'],
        sub_categories: [
            {
                id: 'talent-acquisition-hr',
                name: 'Talent Acquisition & HR Management',
                description: 'Proses rekrutmen talenta, hubungan industrial, dan manajemen performa.',
                roles: [
                    { id: 'talent-sourcing-screening', name: 'Talent Sourcing & Candidate Screening', popular_skills: ['Technical Sourcing', 'LinkedIn Recruiter', 'Interviewing'] },
                    { id: 'ats-recruitment-funnel', name: 'ATS Systems & Recruitment Funnel', popular_skills: ['ATS Management', 'Recruitment Pipeline', 'Hiring Analytics'] },
                    { id: 'payroll-bpjs-pph21', name: 'Payroll & Compensation (BPJS / PPh 21)', popular_skills: ['Payroll Administration', 'BPJS', 'PPh 21', 'HRIS'] },
                    { id: 'employee-relations-kpi', name: 'Employee Relations & KPI Performance', popular_skills: ['Performance Appraisal', 'KPI / OKR Design', 'Culture'] },
                ],
            },
        ],
    },
    {
        id: 'sales-support',
        title: 'Sales & Customer Experience',
        description: 'Penjualan solusi bisnis, manajemen relasi pelanggan, dan pelayanan kepuasan klien.',
        icon: 'Headphones',
        roles: [
            'CRM Systems (HubSpot / Salesforce)',
            'Client Onboarding & Retention Management',
            'B2B Prospecting & Deal Closing',
        ],
        popular_skills: ['CRM (HubSpot/Salesforce)', 'Client Communication', 'Negotiation', 'Zendesk', 'Customer Retention'],
        sub_categories: [
            {
                id: 'customer-success-relationship',
                name: 'Customer Success & Relationship Management',
                description: 'Mendampingi kepuasan penggunaan solusi oleh klien, retensi akun, dan dukungan pelanggan.',
                roles: [
                    { id: 'crm-hubspot-salesforce', name: 'CRM Systems (HubSpot / Salesforce)', popular_skills: ['HubSpot CRM', 'Salesforce', 'Pipeline Tracking'] },
                    { id: 'client-onboarding-retention', name: 'Client Onboarding & Retention Management', popular_skills: ['Client Onboarding', 'Retention', 'CSAT'] },
                    { id: 'b2b-prospecting-deal-closing', name: 'B2B Prospecting & Deal Closing', popular_skills: ['Solution Selling', 'Product Demo', 'Contract Closing'] },
                ],
            },
        ],
    },
];

/**
 * Flatten all roles into a single list with category metadata for instant searching.
 */
export const ALL_CAREER_ROLES: CareerRoleItem[] = CAREER_CATEGORIES.flatMap((category) => {
    if (category.sub_categories && category.sub_categories.length > 0) {
        return category.sub_categories.flatMap((sub) => {
            if (sub.roles && sub.roles.length > 0) {
                return sub.roles.map((r) => ({
                    id: `${category.id}-${sub.id}-${r.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                    name: r.name,
                    category: category.id,
                    categoryTitle: category.title,
                    popularSkills: r.popular_skills,
                }));
            }
            if (sub.popular_skills && sub.popular_skills.length > 0) {
                return sub.popular_skills.map((skill) => ({
                    id: `${category.id}-${sub.id}-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                    name: skill,
                    category: category.id,
                    categoryTitle: category.title,
                    popularSkills: [skill],
                }));
            }
            return [];
        });
    }
    return category.roles.map((roleName) => ({
        id: `${category.id}-${roleName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: roleName,
        category: category.id,
        categoryTitle: category.title,
        popularSkills: category.popular_skills,
    }));
});
