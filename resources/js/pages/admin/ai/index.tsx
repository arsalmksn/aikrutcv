import { Head, router, useForm } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    ArrowDown,
    ArrowUp,
    Bot,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    Cpu,
    ExternalLink,
    Eye,
    EyeOff,
    Globe,
    Key,
    Layers,
    Loader2,
    Pencil,
    Play,
    Plus,
    RefreshCw,
    Server,
    Settings2,
    Shield,
    Sliders,
    Sparkles,
    Trash2,
    Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export interface AiModelItem {
    id: number;
    ai_provider_id: number;
    name: string;
    model_id: string;
    priority: number;
    is_active: boolean;
    is_default: boolean;
    max_tokens: number | null;
    temperature: number;
}

export interface AiProviderItem {
    id: number;
    name: string;
    slug: string;
    driver: string;
    base_url: string;
    has_api_key: boolean;
    masked_api_key: string | null;
    custom_headers: Record<string, string> | null;
    is_active: boolean;
    models_count: number;
    active_models_count: number;
    models: AiModelItem[];
}

export interface FallbackChainItem {
    id: number;
    name: string;
    model_id: string;
    priority: number;
    is_active: boolean;
    is_default: boolean;
    temperature: number;
    provider: {
        id: number;
        name: string;
        slug: string;
        is_active: boolean;
    };
}

export interface PresetDriver {
    value: string;
    label: string;
}

interface AdminAiPageProps {
    providers: AiProviderItem[];
    fallbackChain: FallbackChainItem[];
    presetDrivers: PresetDriver[];
}

// Preset definitions for quick-fill
const PRESET_CONFIGS: Record<
    string,
    { name: string; slug: string; driver: string; base_url: string; model_name: string; model_id: string }
> = {
    groq: {
        name: 'Groq Cloud',
        slug: 'groq',
        driver: 'openai-compatible',
        base_url: 'https://api.groq.com/openai/v1',
        model_name: 'Llama 3.3 70B Versatile',
        model_id: 'llama-3.3-70b-versatile',
    },
    deepseek: {
        name: 'DeepSeek Official',
        slug: 'deepseek',
        driver: 'openai-compatible',
        base_url: 'https://api.deepseek.com/v1',
        model_name: 'DeepSeek Chat (V3)',
        model_id: 'deepseek-chat',
    },
    gemini: {
        name: 'Google Gemini (OpenAI Endpoint)',
        slug: 'gemini',
        driver: 'openai-compatible',
        base_url: 'https://generativelanguage.googleapis.com/v1beta/openai/',
        model_name: 'Gemini 1.5 Flash',
        model_id: 'gemini-1.5-flash',
    },
    openai: {
        name: 'OpenAI Official',
        slug: 'openai',
        driver: 'openai-compatible',
        base_url: 'https://api.openai.com/v1',
        model_name: 'GPT-4o Mini',
        model_id: 'gpt-4o-mini',
    },
    openrouter: {
        name: 'OpenRouter',
        slug: 'openrouter',
        driver: 'openai-compatible',
        base_url: 'https://openrouter.ai/api/v1',
        model_name: 'Auto / Free Models',
        model_id: 'meta-llama/llama-3.3-70b-instruct',
    },
    ollama: {
        name: 'Ollama Local / Self-Hosted',
        slug: 'ollama',
        driver: 'openai-compatible',
        base_url: 'http://localhost:11434/v1',
        model_name: 'Llama 3.2 3B',
        model_id: 'llama3.2',
    },
    custom: {
        name: '',
        slug: '',
        driver: 'openai-compatible',
        base_url: '',
        model_name: '',
        model_id: '',
    },
};

export default function AdminAiPage({
    providers,
    fallbackChain,
    presetDrivers,
}: AdminAiPageProps) {
    const [activeTab, setActiveTab] = useState<'chain' | 'providers'>('chain');

    // Dialog state for Provider
    const [providerModalOpen, setProviderModalOpen] = useState(false);
    const [editingProvider, setEditingProvider] = useState<AiProviderItem | null>(null);
    const [selectedPreset, setSelectedPreset] = useState<string>('groq');
    const [showApiKey, setShowApiKey] = useState(false);
    const [deletingProvider, setDeletingProvider] = useState<AiProviderItem | null>(null);

    // Dialog state for Model
    const [modelModalOpen, setModelModalOpen] = useState(false);
    const [targetProviderForModel, setTargetProviderForModel] = useState<AiProviderItem | null>(null);
    const [editingModel, setEditingModel] = useState<AiModelItem | null>(null);
    const [deletingModel, setDeletingModel] = useState<AiModelItem | null>(null);

    // Test connection modal state
    const [testModalOpen, setTestModalOpen] = useState(false);
    const [testingModel, setTestingModel] = useState<AiModelItem | FallbackChainItem | null>(null);
    const [testPrompt, setTestPrompt] = useState('Tes koneksi. Jawab "Koneksi Berhasil!" dalam 2 kata.');
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<{
        success: boolean;
        latency_ms: number;
        provider?: string;
        model?: string;
        response?: string;
        error?: string;
    } | null>(null);

    // Forms
    const providerForm = useForm({
        name: '',
        slug: '',
        driver: 'openai-compatible',
        base_url: '',
        api_key: '',
        is_active: true,
    });

    const modelForm = useForm({
        name: '',
        model_id: '',
        priority: 1,
        max_tokens: 4096 as number | null,
        temperature: 0.7,
        is_active: true,
        is_default: false,
    });

    // Counts
    const activeProvidersCount = providers.filter((p) => p.is_active).length;
    const activeModelsInChain = fallbackChain.filter((m) => m.is_active && m.provider.is_active);
    const primaryModel = activeModelsInChain[0] ?? null;

    // Open Add Provider Modal
    const handleOpenAddProvider = (presetKey = 'groq') => {
        setEditingProvider(null);
        setShowApiKey(false);
        setSelectedPreset(presetKey);
        const preset = PRESET_CONFIGS[presetKey] || PRESET_CONFIGS.custom;
        providerForm.setData({
            name: preset.name,
            slug: preset.slug,
            driver: preset.driver,
            base_url: preset.base_url,
            api_key: '',
            is_active: true,
        });
        setProviderModalOpen(true);
    };

    // Apply preset inside modal
    const handleApplyPreset = (key: string) => {
        setSelectedPreset(key);
        const preset = PRESET_CONFIGS[key] || PRESET_CONFIGS.custom;
        providerForm.setData((prev) => ({
            ...prev,
            name: preset.name,
            slug: preset.slug,
            driver: preset.driver,
            base_url: preset.base_url,
        }));
    };

    // Open Edit Provider Modal
    const handleOpenEditProvider = (provider: AiProviderItem) => {
        setEditingProvider(provider);
        setShowApiKey(false);
        providerForm.setData({
            name: provider.name,
            slug: provider.slug,
            driver: provider.driver,
            base_url: provider.base_url,
            api_key: '',
            is_active: provider.is_active,
        });
        setProviderModalOpen(true);
    };

    // Submit Provider Form
    const handleProviderSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProvider) {
            providerForm.patch(`/admin/ai-settings/providers/${editingProvider.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setProviderModalOpen(false);
                    toast.success(`Provider ${providerForm.data.name} berhasil diperbarui.`);
                },
                onError: () => {
                    toast.error('Gagal memperbarui provider. Periksa input.');
                },
            });
        } else {
            providerForm.post('/admin/ai-settings/providers', {
                preserveScroll: true,
                onSuccess: () => {
                    setProviderModalOpen(false);
                    toast.success('Provider AI baru berhasil ditambahkan.');
                },
                onError: () => {
                    toast.error('Gagal menambahkan provider. Periksa input.');
                },
            });
        }
    };

    // Open Add Model Modal
    const handleOpenAddModel = (provider: AiProviderItem) => {
        setTargetProviderForModel(provider);
        setEditingModel(null);
        // Next priority calculation
        const maxPriority = fallbackChain.reduce((max, m) => Math.max(max, m.priority), 0);
        modelForm.setData({
            name: '',
            model_id: '',
            priority: maxPriority + 1,
            max_tokens: 4096,
            temperature: 0.7,
            is_active: true,
            is_default: false,
        });
        setModelModalOpen(true);
    };

    // Open Edit Model Modal
    const handleOpenEditModel = (model: AiModelItem) => {
        setEditingModel(model);
        modelForm.setData({
            name: model.name,
            model_id: model.model_id,
            priority: model.priority,
            max_tokens: model.max_tokens,
            temperature: model.temperature,
            is_active: model.is_active,
            is_default: model.is_default,
        });
        setModelModalOpen(true);
    };

    // Submit Model Form
    const handleModelSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingModel) {
            modelForm.patch(`/admin/ai-settings/models/${editingModel.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setModelModalOpen(false);
                    toast.success(`Model ${modelForm.data.name} berhasil diperbarui.`);
                },
                onError: () => {
                    toast.error('Gagal memperbarui model.');
                },
            });
        } else if (targetProviderForModel) {
            modelForm.post(`/admin/ai-settings/providers/${targetProviderForModel.id}/models`, {
                preserveScroll: true,
                onSuccess: () => {
                    setModelModalOpen(false);
                    toast.success(`Model berhasil ditambahkan ke ${targetProviderForModel.name}.`);
                },
                onError: () => {
                    toast.error('Gagal menambahkan model.');
                },
            });
        }
    };

    // Quick toggle model active
    const handleToggleModelActive = (modelId: number, currentActive: boolean) => {
        router.patch(
            `/admin/ai-settings/models/${modelId}`,
            {
                is_active: !currentActive,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(!currentActive ? 'Model diaktifkan' : 'Model dinonaktifkan');
                },
            }
        );
    };

    // Quick toggle provider active
    const handleToggleProviderActive = (provider: AiProviderItem) => {
        router.patch(
            `/admin/ai-settings/providers/${provider.id}`,
            {
                name: provider.name,
                slug: provider.slug,
                driver: provider.driver,
                base_url: provider.base_url,
                is_active: !provider.is_active,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        !provider.is_active
                            ? `Provider ${provider.name} diaktifkan`
                            : `Provider ${provider.name} dinonaktifkan`
                    );
                },
            }
        );
    };

    // Move priority up or down
    const handleReorderPriority = (modelId: number, direction: 'up' | 'down') => {
        const sorted = [...fallbackChain].sort((a, b) => a.priority - b.priority);
        const index = sorted.findIndex((m) => m.id === modelId);
        if (index === -1) return;

        if (direction === 'up' && index > 0) {
            const targetIndex = index - 1;
            const currentItem = sorted[index];
            const targetItem = sorted[targetIndex];

            const tempPriority = currentItem.priority;
            currentItem.priority = targetItem.priority;
            targetItem.priority = tempPriority === targetItem.priority ? targetItem.priority + 1 : tempPriority;

            submitPriorityUpdate(sorted);
        } else if (direction === 'down' && index < sorted.length - 1) {
            const targetIndex = index + 1;
            const currentItem = sorted[index];
            const targetItem = sorted[targetIndex];

            const tempPriority = currentItem.priority;
            currentItem.priority = targetItem.priority;
            targetItem.priority = tempPriority === targetItem.priority ? targetItem.priority - 1 : tempPriority;

            submitPriorityUpdate(sorted);
        }
    };

    const submitPriorityUpdate = (items: FallbackChainItem[]) => {
        router.post(
            '/admin/ai-settings/priorities',
            {
                priorities: items.map((item, idx) => ({
                    id: item.id,
                    priority: idx + 1,
                })),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Urutan rantai fallback berhasil diperbarui.');
                },
            }
        );
    };

    // Test connection trigger
    const handleOpenTestConnection = (model: AiModelItem | FallbackChainItem) => {
        setTestingModel(model);
        setTestResult(null);
        setTestModalOpen(true);
    };

    const handleRunTest = async () => {
        if (!testingModel) return;
        setIsTesting(true);
        setTestResult(null);

        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const res = await fetch(`/admin/ai-settings/models/${testingModel.id}/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ prompt: testPrompt }),
            });

            const data = await res.json();
            setTestResult(data);
            if (data.success) {
                toast.success(`Koneksi Sukses! Latency: ${data.latency_ms}ms`);
            } else {
                toast.error(`Koneksi Gagal: ${data.error || 'Terjadi kesalahan'}`);
            }
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Koneksi jaringan terputus';
            setTestResult({
                success: false,
                latency_ms: 0,
                error: errorMsg,
            });
            toast.error(errorMsg);
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <>
            <Head title="Pengaturan AI Model & Provider - Admin" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Pengaturan AI Model & Fallback
                            </h1>
                            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                Laravel AI SDK
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola penyedia AI (OpenAI, Gemini, Groq, DeepSeek, Ollama, Custom Endpoint) dan tentukan urutan otomatis rantai fallback jika terjadi kegagalan/rate-limit.
                        </p>
                    </div>

                    <div>
                        <Button
                            onClick={() => handleOpenAddProvider('groq')}
                            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                        >
                            <Plus className="size-4" />
                            <span>Tambah Provider</span>
                        </Button>
                    </div>
                </div>

                {/* KPI / Status Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border border-border/60 shadow-sm transition hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total AI Provider
                            </CardTitle>
                            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                                <Globe className="size-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{providers.length}</div>
                            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                <span className="inline-block size-2 rounded-full bg-emerald-500" />
                                {activeProvidersCount} provider aktif
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border border-border/60 shadow-sm transition hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Model Dalam Fallback Chain
                            </CardTitle>
                            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                                <Layers className="size-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{activeModelsInChain.length}</div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Dari total {fallbackChain.length} model terdaftar
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border border-border/60 shadow-sm transition hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Model Utama (Prioritas 1)
                            </CardTitle>
                            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                                <Zap className="size-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="truncate text-lg font-bold text-foreground">
                                {primaryModel ? primaryModel.name : 'Belum Ada'}
                            </div>
                            <p className="mt-1 truncate text-xs text-muted-foreground">
                                {primaryModel ? `${primaryModel.provider.name} (${primaryModel.model_id})` : 'Harap aktifkan minimal 1 model'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border border-border/60 shadow-sm transition hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Status Failover Otomatis
                            </CardTitle>
                            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400">
                                <Shield className="size-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="size-5" />
                                <span>Aktif ({activeModelsInChain.length} Tingkat)</span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Otomatis alih ke tier berikutnya bila error/429
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs switcher */}
                <div className="flex border-b border-border/60 pb-px">
                    <button
                        type="button"
                        onClick={() => setActiveTab('chain')}
                        className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                            activeTab === 'chain'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Layers className="size-4" />
                        <span>Rantai Prioritas & Fallback ({fallbackChain.length})</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('providers')}
                        className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                            activeTab === 'providers'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Bot className="size-4" />
                        <span>Penyedia & Model ({providers.length})</span>
                    </button>
                </div>

                {/* TAB 1: Rantai Prioritas & Fallback */}
                {activeTab === 'chain' && (
                    <div className="space-y-4">
                        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-800 dark:text-amber-300">
                            <div className="flex items-start gap-3">
                                <Zap className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                                <div>
                                    <h4 className="font-semibold">Mekanisme Urutan Fallback Cerdas:</h4>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        Sistem selalu memanggil model dengan <strong>Prioritas 1</strong> terlebih dahulu. Jika terjadi limit rate (HTTP 429), timeout, atau server error, sistem secara otomatis mengeksekusi fallback ke <strong>Prioritas 2</strong>, dst, tanpa menyebabkan kegagalan fitur pada pengguna.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-border/60 bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                                        <tr>
                                            <th className="px-4 py-3 text-center">Urutan Prioritas</th>
                                            <th className="px-4 py-3">Nama Model</th>
                                            <th className="px-4 py-3">Provider</th>
                                            <th className="px-4 py-3">Model ID</th>
                                            <th className="px-4 py-3">Suhu & Token</th>
                                            <th className="px-4 py-3">Status Rantai</th>
                                            <th className="px-4 py-3 text-right">Aksi & Tes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {fallbackChain.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                                                    Belum ada model yang terdaftar. Tambahkan provider dan model di tab Penyedia.
                                                </td>
                                            </tr>
                                        ) : (
                                            fallbackChain.map((model, idx) => {
                                                const isChainActive = model.is_active && model.provider.is_active;
                                                return (
                                                    <tr
                                                        key={model.id}
                                                        className={`transition hover:bg-muted/30 ${
                                                            !isChainActive ? 'opacity-60 bg-muted/10' : ''
                                                        }`}
                                                    >
                                                        {/* Priority Ranking */}
                                                        <td className="px-4 py-3.5 text-center">
                                                            <div className="inline-flex items-center gap-1.5">
                                                                <span
                                                                    className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${
                                                                        idx === 0 && isChainActive
                                                                            ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/30'
                                                                            : 'bg-muted text-foreground'
                                                                    }`}
                                                                >
                                                                    {model.priority}
                                                                </span>
                                                                <div className="flex flex-col">
                                                                    <button
                                                                        type="button"
                                                                        disabled={idx === 0}
                                                                        onClick={() => handleReorderPriority(model.id, 'up')}
                                                                        className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                                                                        title="Naikkan prioritas"
                                                                    >
                                                                        <ArrowUp className="size-3" />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        disabled={idx === fallbackChain.length - 1}
                                                                        onClick={() => handleReorderPriority(model.id, 'down')}
                                                                        className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                                                                        title="Turunkan prioritas"
                                                                    >
                                                                        <ArrowDown className="size-3" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Model Name */}
                                                        <td className="px-4 py-3.5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-foreground">
                                                                    {model.name}
                                                                </span>
                                                                {idx === 0 && isChainActive && (
                                                                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400">
                                                                        Primary
                                                                    </Badge>
                                                                )}
                                                                {idx > 0 && isChainActive && (
                                                                    <Badge variant="outline" className="text-muted-foreground">
                                                                        Fallback #{idx}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* Provider */}
                                                        <td className="px-4 py-3.5">
                                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                                <Bot className="size-3.5" />
                                                                <span>{model.provider.name}</span>
                                                                {!model.provider.is_active && (
                                                                    <Badge variant="destructive" className="ml-1 text-[10px]">
                                                                        Provider Nonaktif
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* Model ID */}
                                                        <td className="px-4 py-3.5">
                                                            <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
                                                                {model.model_id}
                                                            </code>
                                                        </td>

                                                        {/* Params */}
                                                        <td className="px-4 py-3.5 text-xs text-muted-foreground">
                                                            <span>Temp: {model.temperature}</span>
                                                        </td>

                                                        {/* Active Status */}
                                                        <td className="px-4 py-3.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleToggleModelActive(model.id, model.is_active)}
                                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
                                                                    model.is_active
                                                                        ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400'
                                                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                                }`}
                                                            >
                                                                <span
                                                                    className={`size-1.5 rounded-full ${
                                                                        model.is_active ? 'bg-emerald-500' : 'bg-muted-foreground'
                                                                    }`}
                                                                />
                                                                {model.is_active ? 'Aktif' : 'Nonaktif'}
                                                            </button>
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="px-4 py-3.5 text-right">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleOpenTestConnection(model)}
                                                                    className="h-8 gap-1.5 text-xs text-primary hover:text-primary"
                                                                >
                                                                    <Play className="size-3 fill-current" />
                                                                    <span>Tes Ping</span>
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: Kelola Provider & Model */}
                {activeTab === 'providers' && (
                    <div className="space-y-6">
                        {/* Quick Presets Bar */}
                        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-muted/30 p-3">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">
                                Preset Cepat:
                            </span>
                            {Object.entries(PRESET_CONFIGS).map(([key, preset]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => handleOpenAddProvider(key)}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background px-2.5 py-1 text-xs font-medium text-foreground shadow-xs transition hover:border-primary/50 hover:bg-primary/5"
                                >
                                    <Sparkles className="size-3 text-primary" />
                                    <span>{preset.name || 'Provider Kustom'}</span>
                                </button>
                            ))}
                        </div>

                        {/* Providers Cards Grid */}
                        <div className="grid grid-cols-1 gap-6">
                            {providers.map((provider) => (
                                <Card key={provider.id} className="border border-border/60 shadow-xs">
                                    <CardHeader className="border-b border-border/40 pb-4">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                    <Cpu className="size-5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <CardTitle className="text-base font-bold text-foreground">
                                                            {provider.name}
                                                        </CardTitle>
                                                        <Badge variant="outline" className="text-xs">
                                                            {provider.driver}
                                                        </Badge>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleProviderActive(provider)}
                                                            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium transition ${
                                                                provider.is_active
                                                                    ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400'
                                                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                                }`}
                                                        >
                                                            <span
                                                                className={`size-1.5 rounded-full ${
                                                                    provider.is_active ? 'bg-emerald-500' : 'bg-muted-foreground'
                                                                }`}
                                                            />
                                                            {provider.is_active ? 'Aktif' : 'Nonaktif'}
                                                        </button>
                                                    </div>
                                                    <CardDescription className="mt-1 flex flex-wrap items-center gap-3 text-xs">
                                                        <span className="flex items-center gap-1 text-muted-foreground">
                                                            <Globe className="size-3" />
                                                            {provider.base_url}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-muted-foreground">
                                                            <Key className="size-3" />
                                                            {provider.has_api_key ? (
                                                                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                                                                    {provider.masked_api_key}
                                                                </span>
                                                            ) : (
                                                                <span className="text-amber-600 dark:text-amber-400">
                                                                    Belum diatur API Key
                                                                </span>
                                                            )}
                                                        </span>
                                                    </CardDescription>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleOpenAddModel(provider)}
                                                    className="h-8 gap-1.5 text-xs"
                                                >
                                                    <Plus className="size-3.5" />
                                                    <span>Tambah Model</span>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleOpenEditProvider(provider)}
                                                    className="size-8 p-0"
                                                    title="Edit Provider"
                                                >
                                                    <Pencil className="size-3.5" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setDeletingProvider(provider)}
                                                    className="size-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    title="Hapus Provider"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    {/* Models Table within Provider */}
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-muted/20 text-muted-foreground">
                                                    <tr>
                                                        <th className="px-4 py-2.5 font-medium">Prioritas</th>
                                                        <th className="px-4 py-2.5 font-medium">Model Display Name</th>
                                                        <th className="px-4 py-2.5 font-medium">Model ID API</th>
                                                        <th className="px-4 py-2.5 font-medium">Suhu & Token</th>
                                                        <th className="px-4 py-2.5 font-medium">Status</th>
                                                        <th className="px-4 py-2.5 text-right font-medium">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border/30">
                                                    {provider.models.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={6} className="py-6 text-center text-muted-foreground">
                                                                Belum ada model terdaftar untuk provider ini.{' '}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleOpenAddModel(provider)}
                                                                    className="text-primary underline hover:text-primary/80"
                                                                >
                                                                    Tambahkan model sekarang
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        provider.models.map((model) => (
                                                            <tr key={model.id} className="transition hover:bg-muted/30">
                                                                <td className="px-4 py-2.5 font-bold">
                                                                    #{model.priority}
                                                                </td>
                                                                <td className="px-4 py-2.5 font-medium text-foreground">
                                                                    {model.name}
                                                                </td>
                                                                <td className="px-4 py-2.5">
                                                                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-muted-foreground">
                                                                        {model.model_id}
                                                                    </code>
                                                                </td>
                                                                <td className="px-4 py-2.5 text-muted-foreground">
                                                                    Temp: {model.temperature} | Max: {model.max_tokens || 'Auto'}
                                                                </td>
                                                                <td className="px-4 py-2.5">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleToggleModelActive(model.id, model.is_active)}
                                                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition ${
                                                                            model.is_active
                                                                                ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400'
                                                                                : 'bg-muted text-muted-foreground'
                                                                        }`}
                                                                    >
                                                                        <span
                                                                            className={`size-1 rounded-full ${
                                                                                model.is_active ? 'bg-emerald-500' : 'bg-muted-foreground'
                                                                            }`}
                                                                        />
                                                                        {model.is_active ? 'Aktif' : 'Nonaktif'}
                                                                    </button>
                                                                </td>
                                                                <td className="px-4 py-2.5 text-right">
                                                                    <div className="flex items-center justify-end gap-1">
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            onClick={() => handleOpenTestConnection(model)}
                                                                            className="h-7 px-2 text-xs text-primary hover:text-primary"
                                                                        >
                                                                            <Play className="size-3 fill-current mr-1" />
                                                                            <span>Tes</span>
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            onClick={() => handleOpenEditModel(model)}
                                                                            className="size-7 p-0"
                                                                            title="Edit Model"
                                                                        >
                                                                            <Pencil className="size-3" />
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            onClick={() => setDeletingModel(model)}
                                                                            className="size-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                            title="Hapus Model"
                                                                        >
                                                                            <Trash2 className="size-3" />
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL: Tambah / Edit Provider */}
            <Dialog open={providerModalOpen} onOpenChange={setProviderModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Cpu className="size-5 text-primary" />
                            <span>{editingProvider ? 'Edit Provider AI' : 'Tambah Provider AI'}</span>
                        </DialogTitle>
                        <DialogDescription>
                            Konfigurasikan endpoint dan API Key untuk provider AI. API Key tersimpan secara terenkripsi di database.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleProviderSubmit} className="space-y-4 py-2">
                        {/* Pilihan Template Preset (Hanya muncul saat tambah provider baru) */}
                        {!editingProvider && (
                            <div className="space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                        <Sparkles className="size-3.5 text-primary" />
                                        Template Preset Cepat
                                    </span>
                                    <span className="text-[11px] text-muted-foreground">Klik untuk otomatis mengisi form</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {Object.entries(PRESET_CONFIGS).map(([key, preset]) => {
                                        const label =
                                            key === 'custom'
                                                ? 'Kosongkan (Kustom)'
                                                : key === 'gemini'
                                                ? 'Google Gemini'
                                                : key === 'ollama'
                                                ? 'Ollama (Local)'
                                                : preset.name.replace(/ Official/g, '');
                                        const isSelected = selectedPreset === key;
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => handleApplyPreset(key)}
                                                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition border ${
                                                    isSelected
                                                        ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                                                        : 'bg-background text-foreground border-border/70 hover:bg-accent hover:border-accent'
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Nama Provider & Slug */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="space-y-1.5 sm:col-span-2 min-w-0">
                                <Label htmlFor="provider-name">Nama Provider</Label>
                                <Input
                                    id="provider-name"
                                    value={providerForm.data.name}
                                    onChange={(e) => providerForm.setData('name', e.target.value)}
                                    placeholder="Contoh: Groq Cloud, DeepSeek, Custom Ollama"
                                    required
                                />
                                {providerForm.errors.name && (
                                    <p className="text-xs text-destructive">{providerForm.errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-1.5 sm:col-span-1 min-w-0">
                                <Label htmlFor="provider-slug">Identifier Slug</Label>
                                <Input
                                    id="provider-slug"
                                    value={providerForm.data.slug}
                                    onChange={(e) => providerForm.setData('slug', e.target.value)}
                                    placeholder="groq, deepseek, ollama"
                                    required
                                />
                                {providerForm.errors.slug && (
                                    <p className="text-xs text-destructive">{providerForm.errors.slug}</p>
                                )}
                            </div>
                        </div>

                        {/* Driver AI */}
                        <div className="space-y-1.5 min-w-0">
                            <Label htmlFor="provider-driver">Driver AI</Label>
                            <Select
                                value={providerForm.data.driver}
                                onValueChange={(val) => providerForm.setData('driver', val)}
                            >
                                <SelectTrigger id="provider-driver" className="w-full">
                                    <SelectValue placeholder="Pilih Driver" />
                                </SelectTrigger>
                                <SelectContent>
                                    {presetDrivers.map((driver) => (
                                        <SelectItem key={driver.value} value={driver.value}>
                                            {driver.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {providerForm.errors.driver && (
                                <p className="text-xs text-destructive">{providerForm.errors.driver}</p>
                            )}
                        </div>

                        {/* Base URL */}
                        <div className="space-y-1.5">
                            <Label htmlFor="provider-url">Base URL Endpoint API</Label>
                            <Input
                                id="provider-url"
                                value={providerForm.data.base_url}
                                onChange={(e) => providerForm.setData('base_url', e.target.value)}
                                placeholder="https://api.groq.com/openai/v1"
                                required
                            />
                            <p className="text-[11px] text-muted-foreground">
                                Format OpenAI-compatible: sertakan path /v1 jika dibutuhkan provider.
                            </p>
                            {providerForm.errors.base_url && (
                                <p className="text-xs text-destructive">{providerForm.errors.base_url}</p>
                            )}
                        </div>

                        {/* API Key */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="provider-key">API Key</Label>
                                {editingProvider && editingProvider.has_api_key && (
                                    <span className="text-[11px] text-muted-foreground">
                                        Saat ini: {editingProvider.masked_api_key} (kosongkan jika tidak ingin mengubah)
                                    </span>
                                )}
                            </div>
                            <div className="relative">
                                <Input
                                    id="provider-key"
                                    type={showApiKey ? 'text' : 'password'}
                                    value={providerForm.data.api_key}
                                    onChange={(e) => providerForm.setData('api_key', e.target.value)}
                                    placeholder={editingProvider?.has_api_key ? '••••••••••••••••' : 'gsk_... / sk-...'}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowApiKey(!showApiKey)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showApiKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                            {providerForm.errors.api_key && (
                                <p className="text-xs text-destructive">{providerForm.errors.api_key}</p>
                            )}
                        </div>

                        {/* Active checkbox */}
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                id="provider-active"
                                type="checkbox"
                                checked={providerForm.data.is_active}
                                onChange={(e) => providerForm.setData('is_active', e.target.checked)}
                                className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="provider-active" className="text-sm cursor-pointer">
                                Aktifkan Provider ini dalam ekosistem AI
                            </Label>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setProviderModalOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={providerForm.processing}>
                                {providerForm.processing && <Loader2 className="mr-2 size-4 animate-spin" />}
                                <span>{editingProvider ? 'Simpan Perubahan' : 'Tambah Provider'}</span>
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* MODAL: Tambah / Edit Model */}
            <Dialog open={modelModalOpen} onOpenChange={setModelModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Bot className="size-5 text-primary" />
                            <span>{editingModel ? 'Edit Model AI' : 'Tambah Model Baru'}</span>
                        </DialogTitle>
                        <DialogDescription>
                            Atur nama tampilan, model ID API, prioritas dalam rantai fallback, dan parameter inferensi.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleModelSubmit} className="space-y-4 py-2">
                        {/* Display Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="model-name">Nama Tampilan Model</Label>
                            <Input
                                id="model-name"
                                value={modelForm.data.name}
                                onChange={(e) => modelForm.setData('name', e.target.value)}
                                placeholder="Contoh: Llama 3.3 70B Versatile"
                                required
                            />
                            {modelForm.errors.name && (
                                <p className="text-xs text-destructive">{modelForm.errors.name}</p>
                            )}
                        </div>

                        {/* Model ID API */}
                        <div className="space-y-1.5">
                            <Label htmlFor="model-id">Model ID API</Label>
                            <Input
                                id="model-id"
                                value={modelForm.data.model_id}
                                onChange={(e) => modelForm.setData('model_id', e.target.value)}
                                placeholder="Contoh: llama-3.3-70b-versatile, deepseek-chat"
                                required
                            />
                            <p className="text-[11px] text-muted-foreground">
                                Identifier persis yang diminta oleh provider API (misal: gpt-4o-mini).
                            </p>
                            {modelForm.errors.model_id && (
                                <p className="text-xs text-destructive">{modelForm.errors.model_id}</p>
                            )}
                        </div>

                        {/* Priority Ranking */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5 min-w-0">
                                <Label htmlFor="model-priority">Urutan Prioritas</Label>
                                <Input
                                    id="model-priority"
                                    type="number"
                                    min="1"
                                    value={modelForm.data.priority}
                                    onChange={(e) => modelForm.setData('priority', parseInt(e.target.value) || 1)}
                                    required
                                />
                                <p className="text-[10px] text-muted-foreground">1 = Paling utama</p>
                            </div>

                            <div className="space-y-1.5 min-w-0">
                                <Label htmlFor="model-temp">Temperature (0 - 2)</Label>
                                <Input
                                    id="model-temp"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="2"
                                    value={modelForm.data.temperature}
                                    onChange={(e) => modelForm.setData('temperature', parseFloat(e.target.value) || 0.7)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Max Tokens */}
                        <div className="space-y-1.5">
                            <Label htmlFor="model-tokens">Max Tokens (Opsional)</Label>
                            <Input
                                id="model-tokens"
                                type="number"
                                placeholder="4096"
                                value={modelForm.data.max_tokens ?? ''}
                                onChange={(e) =>
                                    modelForm.setData('max_tokens', e.target.value ? parseInt(e.target.value) : null)
                                }
                            />
                        </div>

                        {/* Status Checkbox */}
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                id="model-active"
                                type="checkbox"
                                checked={modelForm.data.is_active}
                                onChange={(e) => modelForm.setData('is_active', e.target.checked)}
                                className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="model-active" className="text-sm cursor-pointer">
                                Aktifkan Model ini dalam eksekusi AI
                            </Label>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setModelModalOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={modelForm.processing}>
                                {modelForm.processing && <Loader2 className="mr-2 size-4 animate-spin" />}
                                <span>{editingModel ? 'Simpan Perubahan' : 'Tambah Model'}</span>
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* MODAL: Tes Koneksi & Latency Ping */}
            <Dialog open={testModalOpen} onOpenChange={setTestModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Activity className="size-5 text-primary" />
                            <span>Tes Koneksi & Latency AI</span>
                        </DialogTitle>
                        <DialogDescription>
                            Kirim permintaan prompt uji instan untuk memeriksa kredensial, konektivitas provider, dan kecepatan respons (latency).
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {testingModel && (
                            <div className="rounded-lg border border-border/60 bg-muted/40 p-3 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-foreground">
                                        {testingModel.name}
                                    </span>
                                    <Badge variant="outline" className="font-mono text-[11px]">
                                        {testingModel.model_id}
                                    </Badge>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label htmlFor="test-prompt">Prompt Uji</Label>
                            <Input
                                id="test-prompt"
                                value={testPrompt}
                                onChange={(e) => setTestPrompt(e.target.value)}
                                placeholder="Tulis pesan uji..."
                            />
                        </div>

                        {/* Test Results Output */}
                        {testResult && (
                            <div
                                className={`rounded-xl border p-4 text-xs transition ${
                                    testResult.success
                                        ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-950 dark:text-emerald-200'
                                        : 'border-destructive/30 bg-destructive/5 text-destructive'
                                }`}
                            >
                                <div className="flex items-center justify-between pb-2 border-b border-border/20">
                                    <div className="flex items-center gap-1.5 font-bold">
                                        {testResult.success ? (
                                            <>
                                                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                                                <span>Koneksi Berhasil (200 OK)</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="size-4 text-destructive" />
                                                <span>Koneksi Gagal</span>
                                            </>
                                        )}
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={
                                            testResult.success
                                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                : 'border-destructive/30 bg-destructive/10 text-destructive'
                                        }
                                    >
                                        <Clock className="size-3 mr-1" />
                                        {testResult.latency_ms} ms
                                    </Badge>
                                </div>

                                <div className="mt-2.5">
                                    <span className="font-semibold text-foreground/80">Respon Provider:</span>
                                    <div className="mt-1 rounded-md bg-background/80 p-2.5 font-mono text-[11px] text-foreground border border-border/40 whitespace-pre-wrap max-h-36 overflow-y-auto">
                                        {testResult.success
                                            ? testResult.response || '(Respon kosong)'
                                            : testResult.error || 'Terjadi kesalahan sistem.'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setTestModalOpen(false)}
                        >
                            Tutup
                        </Button>
                        <Button
                            type="button"
                            onClick={handleRunTest}
                            disabled={isTesting}
                            className="gap-2"
                        >
                            {isTesting ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>Mengirim Tes...</span>
                                </>
                            ) : (
                                <>
                                    <Play className="size-3.5 fill-current" />
                                    <span>Kirim Tes Ping</span>
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL: Konfirmasi Hapus Provider */}
            <Dialog open={!!deletingProvider} onOpenChange={(open) => !open && setDeletingProvider(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <AlertTriangle className="size-5" />
                        </div>
                        <DialogTitle>Hapus Provider AI?</DialogTitle>
                        <DialogDescription>
                            Tindakan ini akan menghapus provider{' '}
                            <strong className="text-foreground">{deletingProvider?.name}</strong> beserta semua model di dalamnya dari konfigurasi rantai fallback.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingProvider(null)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                                if (deletingProvider) {
                                    router.delete(`/admin/ai-settings/providers/${deletingProvider.id}`, {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            setDeletingProvider(null);
                                            toast.success('Provider berhasil dihapus.');
                                        },
                                    });
                                }
                            }}
                        >
                            Ya, Hapus Provider
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL: Konfirmasi Hapus Model */}
            <Dialog open={!!deletingModel} onOpenChange={(open) => !open && setDeletingModel(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <AlertTriangle className="size-5" />
                        </div>
                        <DialogTitle>Hapus Model AI?</DialogTitle>
                        <DialogDescription>
                            Tindakan ini akan menghapus model{' '}
                            <strong className="text-foreground">{deletingModel?.name}</strong> dari rantai fallback.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingModel(null)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                                if (deletingModel) {
                                    router.delete(`/admin/ai-settings/models/${deletingModel.id}`, {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            setDeletingModel(null);
                                            toast.success('Model berhasil dihapus.');
                                        },
                                    });
                                }
                            }}
                        >
                            Ya, Hapus Model
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

AdminAiPage.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '/admin/dashboard',
        },
        {
            title: 'Pengaturan AI',
            href: '/admin/ai-settings',
        },
    ],
};
