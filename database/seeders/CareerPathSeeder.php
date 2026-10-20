<?php

namespace Database\Seeders;

use App\Models\CareerCategory;
use App\Models\CareerRole;
use App\Models\CareerSubCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CareerPathSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = self::getDefaultCareerPaths();

        foreach ($data as $catIndex => $catData) {
            /** @var CareerCategory $category */
            $category = CareerCategory::updateOrCreate(
                ['slug' => $catData['slug'] ?? Str::slug($catData['name'])],
                [
                    'name' => $catData['name'],
                    'description' => $catData['description'] ?? null,
                    'icon' => $catData['icon'] ?? 'Briefcase',
                    'sort_order' => $catIndex,
                    'is_active' => true,
                ]
            );

            foreach ($catData['sub_categories'] as $subIndex => $subData) {
                $subSkills = $subData['popular_skills'] ?? [];
                if (empty($subSkills) && ! empty($subData['roles'])) {
                    foreach ($subData['roles'] as $roleData) {
                        $subSkills = array_merge($subSkills, $roleData['popular_skills'] ?? []);
                    }
                    $subSkills = array_values(array_unique(array_filter($subSkills)));
                }

                /** @var CareerSubCategory $subCategory */
                $subCategory = CareerSubCategory::updateOrCreate(
                    [
                        'career_category_id' => $category->id,
                        'slug' => $subData['slug'] ?? Str::slug($subData['name']),
                    ],
                    [
                        'name' => $subData['name'],
                        'description' => $subData['description'] ?? null,
                        'popular_skills' => $subSkills,
                        'sort_order' => $subIndex,
                        'is_active' => true,
                    ]
                );

                $seededRoleSlugs = [];
                foreach ($subData['roles'] as $roleIndex => $roleData) {
                    $roleSlug = $roleData['slug'] ?? Str::slug($roleData['name']);
                    $seededRoleSlugs[] = $roleSlug;

                    CareerRole::updateOrCreate(
                        [
                            'career_sub_category_id' => $subCategory->id,
                            'slug' => $roleSlug,
                        ],
                        [
                            'name' => $roleData['name'],
                            'popular_skills' => $roleData['popular_skills'] ?? [],
                            'sort_order' => $roleIndex,
                            'is_active' => true,
                        ]
                    );
                }

                // Clean Sync: Delete obsolete/generic roles under this subCategory that are not in the current seeded slugs
                CareerRole::where('career_sub_category_id', $subCategory->id)
                    ->whereNotIn('slug', $seededRoleSlugs)
                    ->delete();
            }
        }
    }

    /**
     * Default hierarchical career paths data structure.
     * Level 1: Bidang Utama (CareerCategory)
     * Level 2: Sub-Bidang Fungsional Netral (CareerSubCategory)
     * Level 3: Tech Stack & Skill Spesifik Langsung (CareerRole)
     *
     * @return array<int, array<string, mixed>>
     */
    public static function getDefaultCareerPaths(): array
    {
        return [
            // =========================================================================
            // 1. SOFTWARE & TECHNOLOGY
            // =========================================================================
            [
                'name' => 'IT & Software Development',
                'slug' => 'it-software-development',
                'description' => 'Pengembangan perangkat lunak, teknologi informasi, dan sistem.',
                'icon' => 'Code',
                'sub_categories' => [
                    [
                        'name' => 'Frontend Development',
                        'slug' => 'frontend-development',
                        'description' => 'Pengembangan antarmuka dan pengalaman user.',
                        'roles' => [
                            [
                                'name' => 'Web Development',
                                'slug' => 'web-development',
                                'popular_skills' => ['React', 'Next.js', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML & CSS', 'SASS'],
                            ],
                            [
                                'name' => 'UI/UX Design',
                                'slug' => 'ui-ux-design',
                                'popular_skills' => ['Figma', 'Wireframing', 'Prototyping', 'Design System', 'User Research'],
                            ],
                            [
                                'name' => 'Game Development',
                                'slug' => 'game-development',
                                'popular_skills' => ['Unity', 'Unreal Engine', 'C#', 'C++', '3D Modeling'],
                            ],
                            [
                                'name' => 'AR/VR Development',
                                'slug' => 'ar-vr-development',
                                'popular_skills' => ['WebXR', 'Three.js', 'Unity VR', 'Blender', 'Meta Quest SDK'],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Backend Development',
                        'slug' => 'backend-development',
                        'description' => 'Pengembangan logika server dan API.',
                        'roles' => [
                            [
                                'name' => 'Laravel / PHP',
                                'slug' => 'laravel-php',
                                'popular_skills' => ['PHP 8+', 'Laravel', 'Eloquent ORM', 'MySQL', 'PostgreSQL', 'Redis', 'RESTful API'],
                            ],
                            [
                                'name' => 'Node.js (Express / NestJS)',
                                'slug' => 'nodejs-express-nestjs',
                                'popular_skills' => ['Node.js', 'TypeScript', 'Express.js', 'NestJS', 'PostgreSQL', 'Prisma', 'TypeORM'],
                            ],
                            [
                                'name' => 'Golang',
                                'slug' => 'golang',
                                'popular_skills' => ['Go (Golang)', 'Gin / Fiber', 'gRPC', 'Microservices', 'PostgreSQL', 'Docker'],
                            ],
                            [
                                'name' => 'Python (FastAPI / Django)',
                                'slug' => 'python-fastapi-django',
                                'popular_skills' => ['Python 3', 'FastAPI', 'Django REST Framework', 'Celery', 'PostgreSQL', 'Redis'],
                            ],
                            [
                                'name' => 'Java (Spring Boot)',
                                'slug' => 'java-spring-boot',
                                'popular_skills' => ['Java 17+', 'Spring Boot', 'Spring Security', 'Hibernate / JPA', 'Maven', 'Microservices'],
                            ],
                            [
                                'name' => 'C# / .NET',
                                'slug' => 'dotnet-csharp',
                                'popular_skills' => ['C#', '.NET Core / .NET 8', 'Entity Framework', 'SQL Server', 'REST API'],
                            ],
                            [
                                'name' => 'RESTful API / GraphQL / gRPC',
                                'slug' => 'api-graphql-grpc',
                                'popular_skills' => ['RESTful API', 'GraphQL', 'gRPC', 'API Architecture', 'Postman', 'OAuth2'],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Full Stack Development',
                        'slug' => 'full-stack-development',
                        'description' => 'Frontend + Backend sekaligus.',
                        'roles' => [
                            [
                                'name' => 'Laravel + Inertia / React / Vue',
                                'slug' => 'laravel-inertia-fullstack',
                                'popular_skills' => ['Laravel', 'Inertia.js', 'React', 'Vue.js', 'Tailwind CSS', 'MySQL', 'Vite'],
                            ],
                            [
                                'name' => 'Next.js Full Stack',
                                'slug' => 'nextjs-fullstack',
                                'popular_skills' => ['Next.js App Router', 'TypeScript', 'Server Actions', 'Prisma', 'Tailwind CSS', 'PostgreSQL'],
                            ],
                            [
                                'name' => 'MERN / PERN Stack',
                                'slug' => 'mern-pern-stack',
                                'popular_skills' => ['MongoDB / PostgreSQL', 'Express.js', 'React', 'Node.js', 'REST API', 'Docker'],
                            ],
                            [
                                'name' => 'Python + React Full Stack',
                                'slug' => 'python-react-fullstack',
                                'popular_skills' => ['Python', 'FastAPI', 'React', 'TypeScript', 'PostgreSQL', 'Docker'],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Mobile App Development',
                        'slug' => 'mobile-app-development',
                        'description' => 'Aplikasi mobile untuk iOS & Android.',
                        'roles' => [
                            [
                                'name' => 'Flutter / Dart',
                                'slug' => 'flutter-dart',
                                'popular_skills' => ['Flutter', 'Dart', 'Bloc / Provider', 'REST API', 'Firebase', 'Clean Architecture'],
                            ],
                            [
                                'name' => 'React Native / Expo',
                                'slug' => 'react-native-expo',
                                'popular_skills' => ['React Native', 'Expo', 'TypeScript', 'Redux Toolkit', 'Native Modules', 'REST API'],
                            ],
                            [
                                'name' => 'Kotlin / Android Native',
                                'slug' => 'kotlin-android-native',
                                'popular_skills' => ['Kotlin', 'Jetpack Compose', 'Coroutines / Flow', 'Room Database', 'Retrofit', 'MVVM'],
                            ],
                            [
                                'name' => 'Swift / iOS Native',
                                'slug' => 'swift-ios-native',
                                'popular_skills' => ['Swift', 'SwiftUI', 'UIKit', 'Xcode', 'CoreData', 'Combine'],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Cloud & DevOps',
                        'slug' => 'cloud-devops',
                        'description' => 'Infrastruktur, deployment, monitoring.',
                        'roles' => [
                            [
                                'name' => 'Docker & Kubernetes',
                                'slug' => 'docker-kubernetes',
                                'popular_skills' => ['Docker', 'Kubernetes', 'Helm', 'Container Security', 'Microservices Orchestration'],
                            ],
                            [
                                'name' => 'Amazon Web Services (AWS)',
                                'slug' => 'aws',
                                'popular_skills' => ['Amazon Web Services (AWS)', 'EC2 / S3 / RDS', 'Lambda', 'CloudFront', 'IAM'],
                            ],
                            [
                                'name' => 'Google Cloud Platform (GCP)',
                                'slug' => 'gcp',
                                'popular_skills' => ['Google Cloud (GCP)', 'Cloud Run', 'GKE', 'BigQuery', 'Cloud Storage'],
                            ],
                            [
                                'name' => 'CI/CD (GitHub Actions / GitLab CI)',
                                'slug' => 'cicd-automation',
                                'popular_skills' => ['GitHub Actions', 'GitLab CI', 'Jenkins', 'Automated Testing', 'Release Automation'],
                            ],
                            [
                                'name' => 'Terraform & IaC',
                                'slug' => 'terraform-iac',
                                'popular_skills' => ['Terraform', 'Infrastructure as Code', 'Ansible', 'CloudFormation'],
                            ],
                            [
                                'name' => 'Linux / SRE & Server Administration',
                                'slug' => 'linux-sre-sysadmin',
                                'popular_skills' => ['Linux / Ubuntu', 'Nginx', 'Prometheus', 'Grafana', 'Bash Scripting'],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Quality Assurance & Testing',
                        'slug' => 'quality-assurance-testing',
                        'description' => 'Penjaminan kualitas perangkat lunak melalui pengujian otomatis, fungsional, dan performa.',
                        'roles' => [
                            [
                                'name' => 'Automation Testing (Playwright / Cypress)',
                                'slug' => 'automation-testing-playwright-cypress',
                                'popular_skills' => ['Playwright', 'Cypress', 'Pest', 'PHPUnit', 'Selenium', 'JavaScript / TypeScript'],
                            ],
                            [
                                'name' => 'API Testing (Postman / K6 / JMeter)',
                                'slug' => 'api-testing-postman-k6',
                                'popular_skills' => ['Postman', 'JMeter', 'K6', 'API Contract Testing', 'Load Testing'],
                            ],
                            [
                                'name' => 'Manual Testing & Test Case Design',
                                'slug' => 'manual-testing-design',
                                'popular_skills' => ['Test Case Design', 'Exploratory Testing', 'Bug Tracking (Jira)', 'Regression Testing'],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Cybersecurity & Network',
                        'slug' => 'cybersecurity-network',
                        'description' => 'Perlindungan aset digital, pengujian penetrasi sistem, audit keamanan, dan jaringan.',
                        'roles' => [
                            [
                                'name' => 'Penetration Testing & Ethical Hacking',
                                'slug' => 'penetration-testing-ethical-hacking',
                                'popular_skills' => ['OWASP Top 10', 'Burp Suite', 'Ethical Hacking', 'Vulnerability Assessment', 'Linux'],
                            ],
                            [
                                'name' => 'SOC, SIEM & Security Operations',
                                'slug' => 'soc-siem-security-ops',
                                'popular_skills' => ['SIEM', 'Network Security', 'Incident Response', 'Firewall / IDS', 'Security Compliance'],
                            ],
                            [
                                'name' => 'Network Security & Firewalls',
                                'slug' => 'network-security-firewalls',
                                'popular_skills' => ['TCP/IP', 'VPN', 'Firewalls', 'Wireshark', 'Network Architecture'],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Embedded Systems & IoT',
                        'slug' => 'embedded-systems-iot',
                        'description' => 'Pengembangan sistem tertanam, firmware perangkat keras, dan ekosistem Internet of Things.',
                        'roles' => [
                            [
                                'name' => 'Embedded C / C++ & Microcontrollers',
                                'slug' => 'embedded-c-cpp-microcontrollers',
                                'popular_skills' => ['C / C++', 'Microcontrollers (STM32, AVR)', 'RTOS', 'I2C / SPI / UART'],
                            ],
                            [
                                'name' => 'ESP32 / Arduino / Raspberry Pi (IoT)',
                                'slug' => 'esp32-arduino-raspberrypi-iot',
                                'popular_skills' => ['ESP32 / Arduino', 'Raspberry Pi', 'MQTT', 'Node-RED', 'Python', 'Sensors'],
                            ],
                        ],
                    ],
                ],
            ],

            // =========================================================================
            // 2. DATA SCIENCE & ARTIFICIAL INTELLIGENCE
            // =========================================================================
            [
                'name' => 'Data Science & Artificial Intelligence',
                'slug' => 'data-ai',
                'description' => 'Pengolahan big data, analitik bisnis, machine learning, deep learning, dan aplikasi generative AI.',
                'icon' => 'Brain',
                'sub_categories' => [
                    [
                        'name' => 'Data Analytics & Business Intelligence',
                        'slug' => 'data-analytics-bi',
                        'description' => 'Menganalisis tren data dan menyajikan dashboard visual untuk pengambilan keputusan strategis.',
                        'roles' => [
                            [
                                'name' => 'SQL & Data Analysis',
                                'slug' => 'sql-data-analysis',
                                'popular_skills' => ['SQL', 'PostgreSQL', 'Data Cleaning', 'Data Modeling', 'Aggregations'],
                            ],
                            [
                                'name' => 'Python Data Analysis (Pandas / NumPy)',
                                'slug' => 'python-pandas-numpy',
                                'popular_skills' => ['Python', 'Pandas', 'NumPy', 'Matplotlib / Seaborn', 'Data Wrangling'],
                            ],
                            [
                                'name' => 'Power BI & DAX Dashboards',
                                'slug' => 'power-bi-dax',
                                'popular_skills' => ['Power BI', 'DAX', 'Data Warehousing', 'KPI Dashboards', 'Power Query'],
                            ],
                            [
                                'name' => 'Tableau Visual Analytics',
                                'slug' => 'tableau-visual-analytics',
                                'popular_skills' => ['Tableau Desktop', 'Tableau Server', 'Data Visualization', 'Interactive Dashboards'],
                            ],
                            [
                                'name' => 'Microsoft Excel (Advanced Modeling)',
                                'slug' => 'excel-advanced-modeling',
                                'popular_skills' => ['Advanced Excel', 'Pivot Tables', 'VLOOKUP / XLOOKUP', 'VBA / Macros', 'Financial Analysis'],
                            ],
                        ],
                    ],
                    [
                        'name' => 'AI, Machine Learning & Deep Learning',
                        'slug' => 'machine-learning-ai',
                        'description' => 'Membangun model prediktif, pemrosesan bahasa alami (NLP), computer vision, dan rekayasa prompt.',
                        'roles' => [
                            [
                                'name' => 'Scikit-Learn & Machine Learning',
                                'slug' => 'scikit-learn-ml',
                                'popular_skills' => ['Python', 'Scikit-Learn', 'Regression', 'Classification', 'Feature Engineering'],
                            ],
                            [
                                'name' => 'PyTorch & Deep Learning',
                                'slug' => 'pytorch-deep-learning',
                                'popular_skills' => ['PyTorch', 'Neural Networks', 'Computer Vision', 'NLP', 'CUDA'],
                            ],
                            [
                                'name' => 'TensorFlow & Keras',
                                'slug' => 'tensorflow-keras',
                                'popular_skills' => ['TensorFlow', 'Keras', 'Model Training', 'Transfer Learning'],
                            ],
                            [
                                'name' => 'LLM & Prompt Engineering (LangChain / RAG)',
                                'slug' => 'llm-prompt-rag',
                                'popular_skills' => ['Prompt Engineering', 'LangChain', 'LlamaIndex', 'OpenAI / Claude API', 'Vector Databases', 'RAG'],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Data Engineering & Infrastructure',
                        'slug' => 'data-engineering-infrastructure',
                        'description' => 'Membangun pipeline data (ETL/ELT), arsitektur data warehouse, dan streaming data real-time.',
                        'roles' => [
                            [
                                'name' => 'Apache Spark & Big Data',
                                'slug' => 'apache-spark-big-data',
                                'popular_skills' => ['Apache Spark', 'PySpark', 'Hadoop', 'Distributed Computing'],
                            ],
                            [
                                'name' => 'Airflow & Data Pipeline (ETL / ELT)',
                                'slug' => 'airflow-etl-pipeline',
                                'popular_skills' => ['Apache Airflow', 'ETL / ELT', 'Python', 'Workflow Scheduling', 'Data Orchestration'],
                            ],
                            [
                                'name' => 'PostgreSQL & Data Warehousing',
                                'slug' => 'postgresql-data-warehousing',
                                'popular_skills' => ['PostgreSQL', 'Snowflake', 'BigQuery', 'Schema Design', 'Data Pipeline'],
                            ],
                        ],
                    ],
                ],
            ],

            // =========================================================================
            // 3. UI/UX & PRODUCT DESIGN
            // =========================================================================
            [
                'name' => 'UI/UX & Product Design',
                'slug' => 'product-design',
                'description' => 'Riset pengalaman pengguna, desain antarmuka aplikasi, visual branding, dan sistem desain.',
                'icon' => 'Palette',
                'sub_categories' => [
                    [
                        'name' => 'Product & Interaction Design',
                        'slug' => 'product-interaction-design',
                        'description' => 'Mendesain alur interaksi pengguna, wireframe, prototype, dan user experience aplikasi digital.',
                        'roles' => [
                            [
                                'name' => 'Figma (UI Design & Prototyping)',
                                'slug' => 'figma-ui-prototyping',
                                'popular_skills' => ['Figma', 'Prototyping', 'Auto Layout', 'Interactive Components', 'Mobile & Web UI'],
                            ],
                            [
                                'name' => 'Wireframing & User Flow Architecture',
                                'slug' => 'wireframing-user-flows',
                                'popular_skills' => ['Wireframing', 'User Flows', 'Information Architecture', 'Low-fidelity Prototyping'],
                            ],
                            [
                                'name' => 'UX Research & Usability Testing',
                                'slug' => 'ux-research-usability-testing',
                                'popular_skills' => ['User Interviews', 'Usability Testing', 'Survey Design', 'User Personas', 'Journey Mapping'],
                            ],
                            [
                                'name' => 'Interaction Design & Micro-animations',
                                'slug' => 'interaction-design-micro-animations',
                                'popular_skills' => ['Micro-interactions', 'Smart Animate', 'Framer', 'Lottie / After Effects'],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Visual, Graphic & Motion Design',
                        'slug' => 'visual-graphic-motion-design',
                        'description' => 'Kreasi visual aset, ilustrasi, motion graphics, dan konsistensi branding digital.',
                        'roles' => [
                            [
                                'name' => 'Design Systems & Tokens (Figma)',
                                'slug' => 'design-systems-tokens',
                                'popular_skills' => ['Design Tokens', 'Figma Variables', 'Component Libraries', 'Storybook Sync'],
                            ],
                            [
                                'name' => 'Adobe Illustrator & Vector Graphics',
                                'slug' => 'adobe-illustrator-vector',
                                'popular_skills' => ['Adobe Illustrator', 'Vector Art', 'Iconography', 'Brand Guidelines'],
                            ],
                            [
                                'name' => 'Adobe Photoshop & Visual Assets',
                                'slug' => 'adobe-photoshop-visual',
                                'popular_skills' => ['Adobe Photoshop', 'Photo Manipulation', 'Digital Marketing Assets', 'Banner Design'],
                            ],
                        ],
                    ],
                ],
            ],

            // =========================================================================
            // 4. PRODUCT & PROJECT MANAGEMENT
            // =========================================================================
            [
                'name' => 'Product & Project Management',
                'slug' => 'product-management',
                'description' => 'Perencanaan roadmap produk, metodologi Agile/Scrum, dan koordinasi eksekusi proyek lintas divisi.',
                'icon' => 'Briefcase',
                'sub_categories' => [
                    [
                        'name' => 'Product Strategy & Management',
                        'slug' => 'product-strategy-management',
                        'description' => 'Mendefinisikan visi, requirement, dan fitur produk berdasarkan riset pasar dan kebutuhan bisnis.',
                        'roles' => [
                            [
                                'name' => 'PRD Writing & Feature Specs',
                                'slug' => 'prd-writing-specs',
                                'popular_skills' => ['PRD Writing', 'User Stories', 'Acceptance Criteria', 'Feature Scoping'],
                            ],
                            [
                                'name' => 'Product Roadmap & Vision',
                                'slug' => 'product-roadmap-vision',
                                'popular_skills' => ['Product Roadmap', 'Prioritization Frameworks (RICE)', 'Stakeholder Management'],
                            ],
                            [
                                'name' => 'A/B Testing & Product Metrics',
                                'slug' => 'ab-testing-product-metrics',
                                'popular_skills' => ['A/B Testing', 'Funnel Analysis', 'Mixpanel', 'Google Analytics', 'KPI Tracking'],
                            ],
                            [
                                'name' => 'Jira & Backlog Management',
                                'slug' => 'jira-backlog-management',
                                'popular_skills' => ['Jira', 'Backlog Refinement', 'Epics & Stories', 'Confluence Documentation'],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Agile Delivery & Technical Project Management',
                        'slug' => 'agile-delivery-project-management',
                        'description' => 'Memfasilitasi ritme kerja tim, sprint planning, eliminasi hambatan teknis, dan ketepatan timeline.',
                        'roles' => [
                            [
                                'name' => 'Scrum & Sprint Planning (Agile)',
                                'slug' => 'scrum-sprint-planning',
                                'popular_skills' => ['Scrum Framework', 'Sprint Planning', 'Daily Standups', 'Sprint Retrospectives', 'Velocity Tracking'],
                            ],
                            [
                                'name' => 'Project Scheduling & Timeline (Gantt)',
                                'slug' => 'project-scheduling-timeline',
                                'popular_skills' => ['Gantt Charts', 'Timeline Tracking', 'Risk Mitigation', 'Asana / Trello', 'Resource Allocation'],
                            ],
                        ],
                    ],
                ],
            ],

            // =========================================================================
            // 5. DIGITAL MARKETING & CONTENT
            // =========================================================================
            [
                'name' => 'Digital Marketing & Content',
                'slug' => 'marketing-growth',
                'description' => 'Pemasaran digital terukur, optimasi mesin pencari (SEO), kampanye iklan berbayar, dan strategi konten.',
                'icon' => 'TrendingUp',
                'sub_categories' => [
                    [
                        'name' => 'Performance Marketing & SEO',
                        'slug' => 'performance-marketing-seo',
                        'description' => 'Kampanye iklan berbayar (PPC), analisis konversi pengguna, dan optimasi organik mesin telusur.',
                        'roles' => [
                            [
                                'name' => 'Google Ads & PPC Campaigns',
                                'slug' => 'google-ads-ppc',
                                'popular_skills' => ['Google Ads', 'Keyword Research', 'Ad Copywriting', 'Conversion Tracking', 'ROI Optimization'],
                            ],
                            [
                                'name' => 'Meta Ads (Facebook & Instagram)',
                                'slug' => 'meta-ads-fb-ig',
                                'popular_skills' => ['Meta Ads Manager', 'Audience Targeting', 'A/B Testing Creatives', 'Pixel Setup', 'Retargeting'],
                            ],
                            [
                                'name' => 'Technical SEO & On-Page / Off-Page',
                                'slug' => 'technical-seo',
                                'popular_skills' => ['Technical SEO', 'Keyword Research', 'Ahrefs / SEMrush', 'Google Search Console', 'Link Building'],
                            ],
                            [
                                'name' => 'Google Analytics 4 & Conversion Tracking',
                                'slug' => 'ga4-conversion-tracking',
                                'popular_skills' => ['Google Analytics 4 (GA4)', 'Google Tag Manager', 'Custom Events', 'Funnel Tracking'],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Content & Social Media Strategy',
                        'slug' => 'content-social-media-strategy',
                        'description' => 'Pembuatan konten copywriting, kurasi media sosial, dan penumbuhan komunitas audiens.',
                        'roles' => [
                            [
                                'name' => 'Copywriting & Content Strategy',
                                'slug' => 'copywriting-content-strategy',
                                'popular_skills' => ['Sales Copywriting', 'Content Strategy', 'Email Marketing', 'Articles / Blog Writing', 'Brand Tone'],
                            ],
                            [
                                'name' => 'Social Media Campaign Planning',
                                'slug' => 'social-media-campaign-planning',
                                'popular_skills' => ['Content Calendar', 'Social Media Analytics', 'Community Engagement', 'Trend Jacking'],
                            ],
                            [
                                'name' => 'TikTok & Instagram Reels Content',
                                'slug' => 'tiktok-reels-content',
                                'popular_skills' => ['Short-form Video', 'CapCut / Premiere Pro', 'Hook Creation', 'Viral Content Strategy'],
                            ],
                        ],
                    ],
                ],
            ],

            // =========================================================================
            // 6. FINANCE, ACCOUNTING & BUSINESS
            // =========================================================================
            [
                'name' => 'Finance, Accounting & Business',
                'slug' => 'finance-business',
                'description' => 'Pembukuan keuangan, analisis permodalan, audit kepatuhan pajak, dan eksplorasi peluang bisnis.',
                'icon' => 'DollarSign',
                'sub_categories' => [
                    [
                        'name' => 'Accounting & Taxation',
                        'slug' => 'accounting-taxation',
                        'description' => 'Penyusunan laporan keuangan, jurnal akuntansi, rekonsiliasi, dan pelaporan perpajakan.',
                        'roles' => [
                            [
                                'name' => 'Financial Reporting & General Ledger',
                                'slug' => 'financial-reporting-gl',
                                'popular_skills' => ['Balance Sheet', 'Income Statement', 'General Ledger', 'Bank Reconciliation', 'Audit Support'],
                            ],
                            [
                                'name' => 'Taxation (PPh, PPN & e-Faktur)',
                                'slug' => 'taxation-efaktur',
                                'popular_skills' => ['e-Faktur', 'PPh 21 / 23 / 25', 'PPN', 'Tax Compliance', 'SPT Tahunan'],
                            ],
                            [
                                'name' => 'SAP / Accurate Accounting Software',
                                'slug' => 'sap-accurate-accounting',
                                'popular_skills' => ['Accurate Online', 'SAP ERP', 'Jurnal.id', 'Invoicing & Receivables'],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Finance & Business Strategy',
                        'slug' => 'finance-business-strategy',
                        'description' => 'Analisis kelayakan investasi, pemodelan keuangan, dan inisiasi kemitraan strategis perusahaan.',
                        'roles' => [
                            [
                                'name' => 'Financial Modeling & Valuation (DCF)',
                                'slug' => 'financial-modeling-valuation',
                                'popular_skills' => ['Financial Modeling', 'DCF Valuation', 'Three Statement Model', 'Sensitivity Analysis'],
                            ],
                            [
                                'name' => 'Budgeting, Forecasting & Variance Analysis',
                                'slug' => 'budgeting-forecasting-variance',
                                'popular_skills' => ['Budgeting & Forecasting', 'Variance Analysis', 'Cost Optimization', 'Cash Flow Management'],
                            ],
                            [
                                'name' => 'B2B Partnership & Business Development',
                                'slug' => 'b2b-partnership-strategy',
                                'popular_skills' => ['B2B Sales Pitching', 'Partnership Agreement', 'Lead Prospecting', 'Contract Negotiation'],
                            ],
                        ],
                    ],
                ],
            ],

            // =========================================================================
            // 7. HUMAN RESOURCES & OPERATIONS
            // =========================================================================
            [
                'name' => 'Human Resources & Operations',
                'slug' => 'hr-operations',
                'description' => 'Perekrutan talenta, pengembangan SDM, penggajian, serta efisiensi operasional organisasi.',
                'icon' => 'Users',
                'sub_categories' => [
                    [
                        'name' => 'Talent Acquisition & HR Management',
                        'slug' => 'talent-acquisition-hr',
                        'description' => 'Proses rekrutmen talenta berkualitas, hubungan industrial, dan manajemen performa karyawan.',
                        'roles' => [
                            [
                                'name' => 'Talent Sourcing & Candidate Screening',
                                'slug' => 'talent-sourcing-screening',
                                'popular_skills' => ['Technical Sourcing', 'LinkedIn Recruiter', 'Candidate Screening', 'Behavioral Interviewing'],
                            ],
                            [
                                'name' => 'ATS Systems & Recruitment Funnel',
                                'slug' => 'ats-recruitment-funnel',
                                'popular_skills' => ['ATS Management', 'Recruitment Pipeline', 'Candidate Experience', 'Hiring Analytics'],
                            ],
                            [
                                'name' => 'Payroll & Compensation (BPJS / PPh 21)',
                                'slug' => 'payroll-bpjs-pph21',
                                'popular_skills' => ['Payroll Administration', 'BPJS Ketenagakerjaan / Kesehatan', 'PPh 21 Calculation', 'HRIS'],
                            ],
                            [
                                'name' => 'Employee Relations & KPI Performance',
                                'slug' => 'employee-relations-kpi',
                                'popular_skills' => ['Performance Appraisal', 'KPI / OKR Design', 'Employee Onboarding', 'Company Culture'],
                            ],
                        ],
                    ],
                ],
            ],

            // =========================================================================
            // 8. SALES & CUSTOMER EXPERIENCE
            // =========================================================================
            [
                'name' => 'Sales & Customer Experience',
                'slug' => 'sales-support',
                'description' => 'Penjualan solusi bisnis, manajemen relasi pelanggan, dan pelayanan kepuasan klien.',
                'icon' => 'Headphones',
                'sub_categories' => [
                    [
                        'name' => 'Customer Success & Relationship Management',
                        'slug' => 'customer-success-relationship',
                        'description' => 'Mendampingi kepuasan penggunaan solusi oleh klien, retensi akun, dan dukungan pelanggan.',
                        'roles' => [
                            [
                                'name' => 'CRM Systems (HubSpot / Salesforce)',
                                'slug' => 'crm-hubspot-salesforce',
                                'popular_skills' => ['HubSpot CRM', 'Salesforce', 'Pipeline Tracking', 'Customer Data Management'],
                            ],
                            [
                                'name' => 'Client Onboarding & Retention Management',
                                'slug' => 'client-onboarding-retention',
                                'popular_skills' => ['Client Onboarding', 'Churn Reduction', 'Customer Satisfaction (CSAT)', 'QBR Meetings'],
                            ],
                            [
                                'name' => 'B2B Prospecting & Deal Closing',
                                'slug' => 'b2b-prospecting-deal-closing',
                                'popular_skills' => ['Solution Selling', 'Cold Outreach', 'Product Demo', 'Contract Negotiation', 'Sales Closing'],
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }
}
