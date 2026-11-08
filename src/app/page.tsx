'use client';

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/lib/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { OverviewView } from '@/components/dashboard/OverviewView';
import { MarketingIntelligenceView } from '@/components/marketing/MarketingIntelligenceView';
import { ClientsView } from '@/components/clients/ClientsView';
import { ProjectsView } from '@/components/projects/ProjectsView';
import { UgcStudioView } from '@/components/ugc/UgcStudioView';
import { CinematicStudioView } from '@/components/cinematic/CinematicStudioView';
import { CreativeStudioView } from '@/components/creative/CreativeStudioView';
import { SocialMediaView } from '@/components/social/SocialMediaView';
import { BusinessManagerView } from '@/components/business/BusinessManagerView';
import { PortfolioView } from '@/components/portfolio/PortfolioView';
import { MediaLibraryView } from '@/components/media/MediaLibraryView';
import { SettingsView } from '@/components/settings/SettingsView';
import { ProductToAdWizardModal } from '@/components/modals/ProductToAdWizardModal';
import { NewProjectModal } from '@/components/modals/NewProjectModal';
import { UserProfileModal } from '@/components/modals/UserProfileModal';
import { StudioLockScreen } from '@/components/auth/StudioLockScreen';

function StudioApp() {
  const { activeModule, userProfile } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/auth/status')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.isRequired) {
          setIsUnlocked(!!data.isUnlocked);
        } else {
          setIsUnlocked(true);
        }
        setAuthChecked(true);
      })
      .catch(() => {
        setIsUnlocked(true);
        setAuthChecked(true);
      });
  }, []);

  if (authChecked && !isUnlocked) {
    return (
      <StudioLockScreen
        onUnlocked={() => setIsUnlocked(true)}
        studioName={userProfile.studioName}
        ownerName={userProfile.name}
      />
    );
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'overview':
        return <OverviewView onOpenNewProject={() => setIsNewProjectModalOpen(true)} />;
      case 'marketing':
        return <MarketingIntelligenceView />;
      case 'clients':
        return <ClientsView />;
      case 'projects':
        return <ProjectsView onOpenNewProject={() => setIsNewProjectModalOpen(true)} />;
      case 'ugc':
        return <UgcStudioView />;
      case 'cinematic':
        return <CinematicStudioView />;
      case 'creative':
        return <CreativeStudioView />;
      case 'social':
        return <SocialMediaView />;
      case 'business':
        return <BusinessManagerView />;
      case 'portfolio':
        return <PortfolioView />;
      case 'media':
        return <MediaLibraryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView onOpenNewProject={() => setIsNewProjectModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d0f] flex text-[#f5f5f3]">
      {/* Sidebar Navigation */}
      <Sidebar
        onOpenNewProject={() => setIsNewProjectModalOpen(true)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onOpenNewProject={() => setIsNewProjectModalOpen(true)}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveModule()}
        </main>
      </div>

      {/* Global Modals */}
      <ProductToAdWizardModal />
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
      <UserProfileModal />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <StudioApp />
    </AppProvider>
  );
}
