"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { galleryPhotos as initialPhotos, coupleInfo } from "@/data/wedding-data";
import { GalleryImage } from "@/types/wedding";
import { idbGet, idbSet, idbRemove } from "@/lib/idb-storage";

interface MediaContextType {
  photos: GalleryImage[];
  heroBgType: "video" | "image";
  heroVideoUrl: string;
  heroImageUrl: string;
  addPhoto: (photo: Omit<GalleryImage, "id">) => void;
  deletePhoto: (id: string) => void;
  updateHeroVideo: (url: string) => void;
  updateHeroImage: (url: string) => void;
  setHeroBgType: (type: "video" | "image") => void;
  removeHeroVideo: () => void;
  resetToDefaults: () => void;
  isLoaded: boolean;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

const LOCAL_PHOTOS_KEY = "aswin_wedding_uploaded_photos_v1";
const LOCAL_VIDEO_KEY = "aswin_wedding_hero_video_v1";
const LOCAL_IMAGE_KEY = "aswin_wedding_hero_image_v1";
const LOCAL_BG_TYPE_KEY = "aswin_wedding_hero_bg_type_v1";

const DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop";

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [photos, setPhotos] = useState<GalleryImage[]>(initialPhotos);
  const [heroBgType, setBgTypeState] = useState<"video" | "image">("video");
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>(coupleInfo.heroVideoUrl);
  const [heroImageUrl, setHeroImageUrl] = useState<string>(DEFAULT_HERO_IMAGE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadMedia() {
      try {
        // Load custom photos from IndexedDB
        let savedPhotos: any = await idbGet(LOCAL_PHOTOS_KEY);
        if (!savedPhotos) {
          const lsPhotos = localStorage.getItem(LOCAL_PHOTOS_KEY);
          if (lsPhotos) savedPhotos = JSON.parse(lsPhotos);
        }

        if (Array.isArray(savedPhotos) && savedPhotos.length > 0) {
          setPhotos([...initialPhotos, ...savedPhotos]);
        }

        // Load hero video
        let savedVideo: any = await idbGet(LOCAL_VIDEO_KEY);
        if (!savedVideo) savedVideo = localStorage.getItem(LOCAL_VIDEO_KEY);
        if (savedVideo && typeof savedVideo === "string") {
          setHeroVideoUrl(savedVideo);
        }

        // Load hero image
        let savedImage: any = await idbGet(LOCAL_IMAGE_KEY);
        if (!savedImage) savedImage = localStorage.getItem(LOCAL_IMAGE_KEY);
        if (savedImage && typeof savedImage === "string") {
          setHeroImageUrl(savedImage);
        }

        // Load hero bg type
        const savedBgType = localStorage.getItem(LOCAL_BG_TYPE_KEY);
        if (savedBgType === "image" || savedBgType === "video") {
          setBgTypeState(savedBgType);
        }
      } catch (err) {
        console.error("Error loading media storage:", err);
      } finally {
        setIsLoaded(true);
      }
    }
    loadMedia();
  }, []);

  const addPhoto = async (photoData: Omit<GalleryImage, "id">) => {
    const newPhoto: GalleryImage = {
      ...photoData,
      id: `uploaded-${Date.now()}`,
    };

    const updatedList = [newPhoto, ...photos];
    setPhotos(updatedList);

    const customOnly = updatedList.filter((p) => p.id.startsWith("uploaded-"));

    try {
      await idbSet(LOCAL_PHOTOS_KEY, customOnly);
    } catch (idbErr) {
      console.error("IndexedDB photo save error:", idbErr);
    }

    try {
      localStorage.setItem(LOCAL_PHOTOS_KEY, JSON.stringify(customOnly));
    } catch (lsErr) {
      // Ignored if quota exceeded
    }
  };

  const deletePhoto = async (id: string) => {
    const updatedList = photos.filter((p) => p.id !== id);
    setPhotos(updatedList);

    const customOnly = updatedList.filter((p) => p.id.startsWith("uploaded-"));

    try {
      await idbSet(LOCAL_PHOTOS_KEY, customOnly);
    } catch (idbErr) {
      console.error("IndexedDB delete error:", idbErr);
    }

    try {
      localStorage.setItem(LOCAL_PHOTOS_KEY, JSON.stringify(customOnly));
    } catch (e) {
      // Ignore
    }
  };

  const updateHeroVideo = async (url: string) => {
    setHeroVideoUrl(url);
    try {
      await idbSet(LOCAL_VIDEO_KEY, url);
    } catch (idbErr) {
      console.error("Error saving video to IndexedDB:", idbErr);
    }

    try {
      localStorage.setItem(LOCAL_VIDEO_KEY, url);
    } catch (lsErr) {
      // Ignore
    }
  };

  const updateHeroImage = async (url: string) => {
    setHeroImageUrl(url);
    try {
      await idbSet(LOCAL_IMAGE_KEY, url);
    } catch (idbErr) {
      console.error("Error saving image to IndexedDB:", idbErr);
    }

    try {
      localStorage.setItem(LOCAL_IMAGE_KEY, url);
    } catch (lsErr) {
      // Ignore
    }
  };

  const setHeroBgType = (type: "video" | "image") => {
    setBgTypeState(type);
    try {
      localStorage.setItem(LOCAL_BG_TYPE_KEY, type);
    } catch (e) {
      // Ignore
    }
  };

  const removeHeroVideo = async () => {
    setHeroVideoUrl(coupleInfo.heroVideoUrl);
    try {
      await idbRemove(LOCAL_VIDEO_KEY);
      localStorage.removeItem(LOCAL_VIDEO_KEY);
    } catch (err) {
      console.error("Error removing custom hero video:", err);
    }
  };

  const resetToDefaults = async () => {
    setPhotos(initialPhotos);
    setBgTypeState("video");
    setHeroVideoUrl(coupleInfo.heroVideoUrl);
    setHeroImageUrl(DEFAULT_HERO_IMAGE);
    try {
      await idbRemove(LOCAL_PHOTOS_KEY);
      await idbRemove(LOCAL_VIDEO_KEY);
      await idbRemove(LOCAL_IMAGE_KEY);
      localStorage.removeItem(LOCAL_PHOTOS_KEY);
      localStorage.removeItem(LOCAL_VIDEO_KEY);
      localStorage.removeItem(LOCAL_IMAGE_KEY);
      localStorage.removeItem(LOCAL_BG_TYPE_KEY);
    } catch (err) {
      console.error("Error resetting defaults:", err);
    }
  };

  return (
    <MediaContext.Provider
      value={{
        photos,
        heroBgType,
        heroVideoUrl,
        heroImageUrl,
        addPhoto,
        deletePhoto,
        updateHeroVideo,
        updateHeroImage,
        setHeroBgType,
        removeHeroVideo,
        resetToDefaults,
        isLoaded,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error("useMedia must be used within a MediaProvider");
  }
  return context;
}
