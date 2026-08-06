"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import styles from "./CookieConsent.module.css";
import {
  CONSENT_CHANGE_EVENT,
  OPEN_CONSENT_SETTINGS_EVENT,
  getStoredConsent,
  getStoredConsentServerSnapshot,
  saveConsent,
  type ConsentState,
} from "@/lib/cookieConsent";

type CookieCategory = {
  key?: string;
  title?: Record<string, string>;
  description?: Record<string, string>;
  required?: boolean;
};

type CookieConsentData = {
  bannerTitle?: Record<string, string>;
  bannerText?: Record<string, string>;
  acceptAllLabel?: Record<string, string>;
  rejectAllLabel?: Record<string, string>;
  customizeLabel?: Record<string, string>;
  modalTitle?: Record<string, string>;
  modalText?: Record<string, string>;
  savePreferencesLabel?: Record<string, string>;
  categories?: CookieCategory[];
};

type CookieConsentClientProps = {
  locale: string;
  data: CookieConsentData;
};

// Delay before the banner appears — gives the page a moment to settle
// instead of slamming the visitor with it on first paint.
const BANNER_DELAY_MS = 1000;

function buildConsent(categories: CookieCategory[], value: boolean): ConsentState {
  return Object.fromEntries(
    categories.map((category) => [category.key ?? "", category.required ? true : value]),
  );
}

function subscribeToConsent(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
  };
}

export default function CookieConsentClient({ locale, data }: CookieConsentClientProps) {
  const categories = useMemo(() => data.categories ?? [], [data.categories]);
  const storedConsent = useSyncExternalStore(
    subscribeToConsent,
    getStoredConsent,
    getStoredConsentServerSnapshot,
  );
  const [bannerReady, setBannerReady] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<ConsentState>(() => buildConsent(categories, true));

  useEffect(() => {
    if (storedConsent) return;
    const timer = window.setTimeout(() => setBannerReady(true), BANNER_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [storedConsent]);

  // Lets a trigger rendered elsewhere (e.g. the footer's "Cookie settings"
  // link) reopen the modal without a direct reference to this component.
  useEffect(() => {
    function handleOpenRequest() {
      setSelected(getStoredConsent() ?? buildConsent(categories, true));
      setModalOpen(true);
    }
    window.addEventListener(OPEN_CONSENT_SETTINGS_EVENT, handleOpenRequest);
    return () => window.removeEventListener(OPEN_CONSENT_SETTINGS_EVENT, handleOpenRequest);
  }, [categories]);

  if (categories.length === 0) return null;

  function openModal() {
    setSelected(storedConsent ?? buildConsent(categories, true));
    setModalOpen(true);
  }

  function acceptAll() {
    saveConsent(buildConsent(categories, true));
    setModalOpen(false);
  }

  function rejectAll() {
    saveConsent(buildConsent(categories, false));
    setModalOpen(false);
  }

  function savePreferences() {
    saveConsent(selected);
    setModalOpen(false);
  }

  function toggleCategory(key: string) {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const showBanner = !storedConsent && bannerReady && !modalOpen;

  return (
    <>
      {showBanner && (
        <div className={styles.banner} data-theme="alt" role="dialog" aria-live="polite">
          <div className={styles.bannerText}>
            {data.bannerTitle?.[locale] && <p className="font-weight-bold">{data.bannerTitle[locale]}</p>}
            {data.bannerText?.[locale] && (
              <p className="text-color-secondary">{data.bannerText[locale]}</p>
            )}
          </div>
          <div className={styles.bannerActions}>
            <button type="button" className={styles.linkButton} onClick={openModal}>
              {data.customizeLabel?.[locale] ?? (locale === "ru" ? "Настроить" : "Customize")}
            </button>
            <button type="button" className={styles.outlineButton} onClick={rejectAll}>
              {data.rejectAllLabel?.[locale] ?? (locale === "ru" ? "Отклонить все" : "Reject all")}
            </button>
            <button type="button" className="button-filled" onClick={acceptAll}>
              {data.acceptAllLabel?.[locale] ?? (locale === "ru" ? "Принять все" : "Accept all")}
            </button>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal} data-theme="alt">
            {data.modalTitle?.[locale] && <h3>{data.modalTitle[locale]}</h3>}
            {data.modalText?.[locale] && (
              <p className="text-color-secondary">{data.modalText[locale]}</p>
            )}

            <div className={styles.categoryList}>
              {categories.map((category) => (
                <label key={category.key} className={styles.categoryItem}>
                  <input
                    type="checkbox"
                    checked={Boolean(selected[category.key ?? ""])}
                    disabled={Boolean(category.required)}
                    onChange={() => category.key && toggleCategory(category.key)}
                  />
                  <span>
                    <span className={styles.categoryTitle}>{category.title?.[locale]}</span>
                    <span className="text-color-secondary">{category.description?.[locale]}</span>
                  </span>
                </label>
              ))}
            </div>

            <div className={styles.modalActions}>
              <button type="button" className="button-filled" onClick={savePreferences}>
                {data.savePreferencesLabel?.[locale] ??
                  (locale === "ru" ? "Сохранить настройки" : "Save preferences")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
