import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { FrameCustomization, UploadedImage } from '../types';

// Define the database schema
interface FrameItDB extends DBSchema {
  frames: {
    key: string;
    value: {
      id: string;
      customization: FrameCustomization;
      image: UploadedImage;
      createdAt: number;
      updatedAt: number;
    };
    indexes: {
      'createdAt': number;
      'updatedAt': number;
    };
  };
  settings: {
    key: string;
    value: {
      key: string;
      value: any;
      updatedAt: number;
    };
  };
}

class IndexedDBService {
  private db: IDBPDatabase<FrameItDB> | null = null;
  private readonly DB_NAME = 'FrameItDB';
  private readonly DB_VERSION = 1;

  async init(): Promise<void> {
    try {
      this.db = await openDB<FrameItDB>(this.DB_NAME, this.DB_VERSION, {
        upgrade(db) {
          // Create frames store
          if (!db.objectStoreNames.contains('frames')) {
            const framesStore = db.createObjectStore('frames', { keyPath: 'id' });
            framesStore.createIndex('createdAt', 'createdAt', { unique: false });
            framesStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          }

          // Create settings store
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' });
          }
        },
      });
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
    }
  }

  async saveFrame(id: string, customization: FrameCustomization, image: UploadedImage): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) return;

    try {
      const now = Date.now();
      await this.db.put('frames', {
        id,
        customization,
        image,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      console.error('Failed to save frame to IndexedDB:', error);
    }
  }

  async updateFrame(id: string, customization: FrameCustomization, image: UploadedImage): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) return;

    try {
      const existing = await this.db.get('frames', id);
      if (existing) {
        await this.db.put('frames', {
          ...existing,
          customization,
          image,
          updatedAt: Date.now(),
        });
      } else {
        await this.saveFrame(id, customization, image);
      }
    } catch (error) {
      console.error('Failed to update frame in IndexedDB:', error);
    }
  }

  async getFrame(id: string): Promise<{ customization: FrameCustomization; image: UploadedImage } | null> {
    if (!this.db) await this.init();
    if (!this.db) return null;

    try {
      const frame = await this.db.get('frames', id);
      return frame ? { customization: frame.customization, image: frame.image } : null;
    } catch (error) {
      console.error('Failed to get frame from IndexedDB:', error);
      return null;
    }
  }

  async getAllFrames(): Promise<Array<{ id: string; customization: FrameCustomization; image: UploadedImage; createdAt: number; updatedAt: number }>> {
    if (!this.db) await this.init();
    if (!this.db) return [];

    try {
      return await this.db.getAll('frames');
    } catch (error) {
      console.error('Failed to get all frames from IndexedDB:', error);
      return [];
    }
  }

  async deleteFrame(id: string): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) return;

    try {
      await this.db.delete('frames', id);
    } catch (error) {
      console.error('Failed to delete frame from IndexedDB:', error);
    }
  }

  async clearAllFrames(): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) return;

    try {
      await this.db.clear('frames');
    } catch (error) {
      console.error('Failed to clear frames from IndexedDB:', error);
    }
  }

  async saveSetting(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) return;

    try {
      await this.db.put('settings', {
        key,
        value,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Failed to save setting to IndexedDB:', error);
    }
  }

  async getSetting(key: string): Promise<any> {
    if (!this.db) await this.init();
    if (!this.db) return null;

    try {
      const setting = await this.db.get('settings', key);
      return setting?.value || null;
    } catch (error) {
      console.error('Failed to get setting from IndexedDB:', error);
      return null;
    }
  }

  async saveCurrentImage(image: UploadedImage): Promise<void> {
    await this.saveSetting('currentImage', image);
  }

  async getCurrentImage(): Promise<UploadedImage | null> {
    return await this.getSetting('currentImage');
  }

  async saveCurrentCustomization(customization: FrameCustomization): Promise<void> {
    await this.saveSetting('currentCustomization', customization);
  }

  async getCurrentCustomization(): Promise<FrameCustomization | null> {
    return await this.getSetting('currentCustomization');
  }

  async saveFrameCollection(frames: any[], activeFrameId: string | null): Promise<void> {
    await this.saveSetting('frameCollection', { frames, activeFrameId });
  }

  async getFrameCollection(): Promise<{ frames: any[]; activeFrameId: string | null } | null> {
    return await this.getSetting('frameCollection');
  }
}

// Create a singleton instance
export const indexedDBService = new IndexedDBService();
