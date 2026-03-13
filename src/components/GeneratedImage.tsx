import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;
try {
  // Initialize safely in case of environment issues
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (e) {
  console.error("Failed to initialize Gemini API", e);
}

// IndexedDB helper to cache images and avoid regenerating on every reload
const getDb = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    try {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject(new Error("IndexedDB not supported or blocked"));
      }
      const request = window.indexedDB.open('ImageCache', 1);
      request.onupgradeneeded = () => {
        try {
          request.result.createObjectStore('images');
        } catch (err) {
          reject(err);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    } catch (e) {
      reject(e);
    }
  });
};

const getCachedImage = async (key: string) => {
  try {
    const db = await getDb();
    return new Promise<string | null>((resolve) => {
      try {
        const tx = db.transaction('images', 'readonly');
        const store = tx.objectStore('images');
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      } catch (err) {
        resolve(null);
      }
    });
  } catch (e) {
    return null;
  }
};

const setCachedImage = async (key: string, data: string) => {
  try {
    const db = await getDb();
    return new Promise<void>((resolve) => {
      try {
        const tx = db.transaction('images', 'readwrite');
        const store = tx.objectStore('images');
        store.put(data, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (err) {
        resolve();
      }
    });
  } catch (e) {
    // ignore
  }
};

export function GeneratedImage({ prompt, alt, className }: { prompt: string, alt: string, className?: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    const fetchImg = async () => {
      // Create a safe cache key from the prompt
      const key = prompt.replace(/[^a-zA-Z0-9]/g, '').substring(0, 50);
      const cached = await getCachedImage(key);
      
      if (cached) {
        if (isMounted) setSrc(cached);
        return;
      }
      
      if (!ai) {
        if (isMounted) setError(true);
        return;
      }
      
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: prompt,
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            const dataUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            await setCachedImage(key, dataUrl);
            if (isMounted) setSrc(dataUrl);
            break;
          }
        }
      } catch (e) {
        console.error("Image generation failed", e);
        if (isMounted) setError(true);
      }
    };
    
    fetchImg();
    return () => { isMounted = false; };
  }, [prompt]);

  if (error) {
    return (
      <div className={`bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center ${className}`}>
        <span className="text-xs text-zinc-400">Image unavailable</span>
      </div>
    );
  }

  if (!src) {
    return (
      <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 flex flex-col items-center justify-center gap-4 ${className}`}>
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-bold text-center px-4">Generating AI Image...</span>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} referrerPolicy="no-referrer" />;
}
