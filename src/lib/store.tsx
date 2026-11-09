'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Client,
  Project,
  Task,
  MarketingAnalysis,
  UgcScript,
  CinematicVideoProject,
  BrandKit,
  Invoice,
  ServiceItem,
  PortfolioCase,
  DeliveryPackage,
  UgcVideoJob,
  Language
} from './types';
import {
  DEFAULT_USER_PROFILE,
  INITIAL_CLIENTS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_MARKETING_ANALYSIS,
  INITIAL_SCRIPTS,
  INITIAL_CINEMATIC_PROJECT,
  INITIAL_BRAND_KIT,
  INITIAL_INVOICES,
  INITIAL_SERVICES,
  INITIAL_PORTFOLIO_CASES,
  INITIAL_DELIVERY_PACKAGES
} from './initial-data';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'activeProjectsCount' | 'totalBilled'>) => void;
  deleteClient: (id: string) => void;
  projects: Project[];
  addProject: (proj: Omit<Project, 'id' | 'progress'>) => void;
  updateProjectStatus: (id: string, status: Project['status']) => void;
  deleteProject: (id: string) => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;
  marketingAnalyses: MarketingAnalysis[];
  addMarketingAnalysis: (analysis: MarketingAnalysis) => void;
  scripts: UgcScript[];
  addScript: (script: UgcScript) => void;
  updateScript: (id: string, newText: string) => void;
  cinematicProject: CinematicVideoProject;
  updateCinematicProject: (project: CinematicVideoProject) => void;
  brandKit: BrandKit;
  updateBrandKit: (kit: BrandKit) => void;
  invoices: Invoice[];
  addInvoice: (inv: Omit<Invoice, 'id'>) => void;
  deleteInvoice: (id: string) => void;
  services: ServiceItem[];
  portfolioCases: PortfolioCase[];
  addPortfolioCase: (item: PortfolioCase) => void;
  deletePortfolioCase: (id: string) => void;
  deliveryPackages: DeliveryPackage[];
  addDeliveryPackage: (pkg: Omit<DeliveryPackage, 'id' | 'downloadCount'>) => void;
  videoJobs: UgcVideoJob[];
  addVideoJob: (job: UgcVideoJob) => void;
  activeModule: string;
  setActiveModule: (module: string) => void;
  isProductToAdModalOpen: boolean;
  setIsProductToAdModalOpen: (open: boolean) => void;
  isNewDocModalOpen: boolean;
  setIsNewDocModalOpen: (open: boolean) => void;
  isNewClientModalOpen: boolean;
  setIsNewClientModalOpen: (open: boolean) => void;
  isNewCaseModalOpen: boolean;
  setIsNewCaseModalOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  clearAllStudioData: () => void;
}

function generateStudioId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [marketingAnalyses, setMarketingAnalyses] = useState<MarketingAnalysis[]>([]);
  const [scripts, setScripts] = useState<UgcScript[]>(INITIAL_SCRIPTS);
  const [cinematicProject, setCinematicProject] = useState<CinematicVideoProject>(INITIAL_CINEMATIC_PROJECT);
  const [brandKit, setBrandKit] = useState<BrandKit>(INITIAL_BRAND_KIT);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [services] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [portfolioCases, setPortfolioCases] = useState<PortfolioCase[]>(INITIAL_PORTFOLIO_CASES);
  const [deliveryPackages, setDeliveryPackages] = useState<DeliveryPackage[]>(INITIAL_DELIVERY_PACKAGES);
  const [videoJobs, setVideoJobs] = useState<UgcVideoJob[]>([]);
  const [activeModule, setActiveModule] = useState<string>('overview');
  const [isProductToAdModalOpen, setIsProductToAdModalOpen] = useState<boolean>(false);
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState<boolean>(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState<boolean>(false);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Clean hydration from localStorage without data loss
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('ai_ugc_lang') as Language;
      if (savedLang) setLanguage(savedLang);

      const savedProfile = localStorage.getItem('ai_ugc_user_profile');
      if (savedProfile) setUserProfile(JSON.parse(savedProfile));

      const savedClients = localStorage.getItem('ai_ugc_clients');
      if (savedClients) setClients(JSON.parse(savedClients));

      const savedProjects = localStorage.getItem('ai_ugc_projects');
      if (savedProjects) setProjects(JSON.parse(savedProjects));

      const savedTasks = localStorage.getItem('ai_ugc_tasks');
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedInvoices = localStorage.getItem('ai_ugc_invoices');
      if (savedInvoices) setInvoices(JSON.parse(savedInvoices));

      const savedPortfolio = localStorage.getItem('ai_ugc_portfolio');
      if (savedPortfolio) setPortfolioCases(JSON.parse(savedPortfolio));

      const savedDeliveries = localStorage.getItem('ai_ugc_deliveries');
      if (savedDeliveries) setDeliveryPackages(JSON.parse(savedDeliveries));

      const savedScripts = localStorage.getItem('ai_ugc_scripts');
      if (savedScripts) setScripts(JSON.parse(savedScripts));

      const savedMarketing = localStorage.getItem('ai_ugc_marketing');
      if (savedMarketing) setMarketingAnalyses(JSON.parse(savedMarketing));

      const savedBrandKit = localStorage.getItem('ai_ugc_brand_kit');
      if (savedBrandKit) setBrandKit(JSON.parse(savedBrandKit));

      const savedJobs = localStorage.getItem('ai_ugc_video_jobs');
      if (savedJobs) setVideoJobs(JSON.parse(savedJobs));

      // Asynchronous background sync with Turso / SQLite DB
      fetch('/api/studio/sync')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success) {
            if (Array.isArray(data.clients) && data.clients.length > 0) {
              setClients(data.clients);
              localStorage.setItem('ai_ugc_clients', JSON.stringify(data.clients));
            }
            if (Array.isArray(data.projects) && data.projects.length > 0) {
              setProjects(data.projects);
              localStorage.setItem('ai_ugc_projects', JSON.stringify(data.projects));
            }
            if (Array.isArray(data.tasks) && data.tasks.length > 0) {
              setTasks(data.tasks);
              localStorage.setItem('ai_ugc_tasks', JSON.stringify(data.tasks));
            }
            if (Array.isArray(data.invoices) && data.invoices.length > 0) {
              setInvoices(data.invoices);
              localStorage.setItem('ai_ugc_invoices', JSON.stringify(data.invoices));
            }
          }
        })
        .catch(() => {
          // Seamless offline fallback to localStorage
        });
    } catch {
      // ignore
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('ai_ugc_lang', lang);
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...profile };
    setUserProfile(updated);
    localStorage.setItem('ai_ugc_user_profile', JSON.stringify(updated));
  };

  const addClient = (data: Omit<Client, 'id' | 'createdAt' | 'activeProjectsCount' | 'totalBilled'>) => {
    const newClient: Client = {
      ...data,
      id: generateStudioId('cli'),
      activeProjectsCount: 0,
      totalBilled: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newClient, ...clients];
    setClients(updated);
    localStorage.setItem('ai_ugc_clients', JSON.stringify(updated));
    fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient)
    }).catch(() => {});
  };

  const deleteClient = (id: string) => {
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
    localStorage.setItem('ai_ugc_clients', JSON.stringify(updated));
    fetch(`/api/clients?id=${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const addProject = (data: Omit<Project, 'id' | 'progress'>) => {
    const newProj: Project = {
      ...data,
      id: generateStudioId('proj'),
      progress: 0
    };
    const updated = [newProj, ...projects];
    setProjects(updated);
    localStorage.setItem('ai_ugc_projects', JSON.stringify(updated));
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProj)
    }).catch(() => {});
  };

  const updateProjectStatus = (id: string, status: Project['status']) => {
    const updated = projects.map(p => p.id === id ? { ...p, status } : p);
    setProjects(updated);
    localStorage.setItem('ai_ugc_projects', JSON.stringify(updated));
    fetch('/api/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    }).catch(() => {});
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('ai_ugc_projects', JSON.stringify(updated));
    fetch(`/api/projects?id=${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const addTask = (data: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...data,
      id: generateStudioId('task')
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    localStorage.setItem('ai_ugc_tasks', JSON.stringify(updated));
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    }).catch(() => {});
  };

  const toggleTaskStatus = (id: string) => {
    let nextStatus: Task['status'] = 'todo';
    const updated = tasks.map(t => {
      if (t.id === id) {
        nextStatus = t.status === 'done' ? 'todo' : 'done';
        return {
          ...t,
          status: nextStatus
        };
      }
      return t;
    });
    setTasks(updated);
    localStorage.setItem('ai_ugc_tasks', JSON.stringify(updated));
    fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: nextStatus })
    }).catch(() => {});
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    localStorage.setItem('ai_ugc_tasks', JSON.stringify(updated));
    fetch(`/api/tasks?id=${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const addMarketingAnalysis = (analysis: MarketingAnalysis) => {
    const updated = [analysis, ...marketingAnalyses];
    setMarketingAnalyses(updated);
    localStorage.setItem('ai_ugc_marketing', JSON.stringify(updated));
  };

  const addScript = (script: UgcScript) => {
    const updated = [script, ...scripts];
    setScripts(updated);
    localStorage.setItem('ai_ugc_scripts', JSON.stringify(updated));
  };

  const updateScript = (id: string, newText: string) => {
    const updated = scripts.map(s => s.id === id ? { ...s, fullText: newText, wordCount: newText.trim().split(/\s+/).length } : s);
    setScripts(updated);
    localStorage.setItem('ai_ugc_scripts', JSON.stringify(updated));
  };

  const updateCinematicProject = (proj: CinematicVideoProject) => {
    setCinematicProject(proj);
    localStorage.setItem('ai_ugc_cinematic', JSON.stringify(proj));
  };

  const updateBrandKit = (kit: BrandKit) => {
    setBrandKit(kit);
    localStorage.setItem('ai_ugc_brand_kit', JSON.stringify(kit));
  };

  const addInvoice = (inv: Omit<Invoice, 'id'>) => {
    const newInv: Invoice = {
      ...inv,
      id: generateStudioId('inv')
    };
    const updated = [newInv, ...invoices];
    setInvoices(updated);
    localStorage.setItem('ai_ugc_invoices', JSON.stringify(updated));
    fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInv)
    }).catch(() => {});
  };

  const deleteInvoice = (id: string) => {
    const updated = invoices.filter(i => i.id !== id);
    setInvoices(updated);
    localStorage.setItem('ai_ugc_invoices', JSON.stringify(updated));
    fetch(`/api/invoices?id=${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const addPortfolioCase = (item: PortfolioCase) => {
    const updated = [item, ...portfolioCases];
    setPortfolioCases(updated);
    localStorage.setItem('ai_ugc_portfolio', JSON.stringify(updated));
  };

  const deletePortfolioCase = (id: string) => {
    const updated = portfolioCases.filter(c => c.id !== id);
    setPortfolioCases(updated);
    localStorage.setItem('ai_ugc_portfolio', JSON.stringify(updated));
  };

  const addDeliveryPackage = (pkg: Omit<DeliveryPackage, 'id' | 'downloadCount'>) => {
    const newPkg: DeliveryPackage = {
      ...pkg,
      id: generateStudioId('del'),
      downloadCount: 0
    };
    const updated = [newPkg, ...deliveryPackages];
    setDeliveryPackages(updated);
    localStorage.setItem('ai_ugc_deliveries', JSON.stringify(updated));
  };

  const addVideoJob = (job: UgcVideoJob) => {
    const updated = [job, ...videoJobs];
    setVideoJobs(updated);
    localStorage.setItem('ai_ugc_video_jobs', JSON.stringify(updated));
  };

  const clearAllStudioData = () => {
    setClients([]);
    setProjects([]);
    setTasks([]);
    setMarketingAnalyses([]);
    setInvoices([]);
    setPortfolioCases([]);
    setDeliveryPackages([]);
    setVideoJobs([]);
    localStorage.removeItem('ai_ugc_clients');
    localStorage.removeItem('ai_ugc_projects');
    localStorage.removeItem('ai_ugc_tasks');
    localStorage.removeItem('ai_ugc_invoices');
    localStorage.removeItem('ai_ugc_portfolio');
    localStorage.removeItem('ai_ugc_deliveries');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        userProfile,
        updateUserProfile,
        clients,
        addClient,
        deleteClient,
        projects,
        addProject,
        updateProjectStatus,
        deleteProject,
        tasks,
        addTask,
        toggleTaskStatus,
        deleteTask,
        marketingAnalyses,
        addMarketingAnalysis,
        scripts,
        addScript,
        updateScript,
        cinematicProject,
        updateCinematicProject,
        brandKit,
        updateBrandKit,
        invoices,
        addInvoice,
        deleteInvoice,
        services,
        portfolioCases,
        addPortfolioCase,
        deletePortfolioCase,
        deliveryPackages,
        addDeliveryPackage,
        videoJobs,
        addVideoJob,
        activeModule,
        setActiveModule,
        isProductToAdModalOpen,
        setIsProductToAdModalOpen,
        isNewDocModalOpen,
        setIsNewDocModalOpen,
        isNewClientModalOpen,
        setIsNewClientModalOpen,
        isNewCaseModalOpen,
        setIsNewCaseModalOpen,
        searchQuery,
        setSearchQuery,
        isProfileModalOpen,
        setIsProfileModalOpen,
        clearAllStudioData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
