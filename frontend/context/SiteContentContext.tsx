'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SiteContent,
  DEFAULT_SITE_CONTENT,
  getStoredSiteContent,
  saveSiteContent,
  resetSiteContent,
} from '@/lib/siteContent';

interface SiteContentContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => void;
  resetToDefault: () => void;
  isLoaded: boolean;
  isAdminLoggedIn: boolean;
}

const SiteContentContext = createContext<SiteContentContextType>({
  content: DEFAULT_SITE_CONTENT,
  updateContent: () => {},
  resetToDefault: () => {},
  isLoaded: false,
  isAdminLoggedIn: false,
});

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    // Initial load from localStorage
    const stored = getStoredSiteContent();
    setContent(stored);
    setIsLoaded(true);

    // Check if admin is logged in
    try {
      const token = localStorage.getItem('admin_token');
      setIsAdminLoggedIn(!!token);
    } catch {
      setIsAdminLoggedIn(false);
    }

    // Listen to updates broadcasted from CMS editor
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteContent>;
      if (customEvent.detail) {
        setContent(customEvent.detail);
      }
    };

    window.addEventListener('smin_content_updated', handleUpdate);
    window.addEventListener('storage', () => {
      setContent(getStoredSiteContent());
    });

    return () => {
      window.removeEventListener('smin_content_updated', handleUpdate);
    };
  }, []);

  const handleUpdateContent = (newContent: SiteContent) => {
    setContent(newContent);
    saveSiteContent(newContent);
  };

  const handleResetToDefault = () => {
    const def = resetSiteContent();
    setContent(def);
  };

  return (
    <SiteContentContext.Provider
      value={{
        content,
        updateContent: handleUpdateContent,
        resetToDefault: handleResetToDefault,
        isLoaded,
        isAdminLoggedIn,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
}
