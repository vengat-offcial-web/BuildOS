import { create } from 'zustand';
import { initialMaterialsData } from '../data';
import { useNotificationStore } from './useNotificationStore';

const safeGetStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const safeSetStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export const deduplicateMaterials = (matList) => {
  if (!Array.isArray(matList)) return [];
  const seen = new Set();
  return matList.filter(item => {
    if (!item) return false;
    const key = (item.name || '').toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const initialMaterials = (() => {
  const saved = safeGetStorage('buildos_materials', initialMaterialsData);
  const list = Array.isArray(saved) && saved.length > 0 ? saved : initialMaterialsData;
  const filtered = list.filter(m => !(m.siteAllocated && m.siteAllocated.toLowerCase().trim().includes('theme park')));
  return deduplicateMaterials(filtered);
})();

export const useMaterialStore = create((set, get) => ({
  materials: initialMaterials,

  addMaterialOrder: (orderData) => {
    const nameClean = orderData.name?.trim();
    if (!nameClean) return null;

    const newMat = {
      id: Date.now(),
      name: nameClean,
      category: orderData.category?.trim() || "Concrete & Cement",
      totalStock: orderData.totalStock?.trim() || orderData.quantity?.trim() || "300 cum",
      availablePct: orderData.availablePct !== undefined ? Number(orderData.availablePct) : 100,
      siteAllocated: orderData.siteAllocated?.trim() || orderData.site?.trim() || "Hyper Mall (450 cu.m)",
      status: orderData.status?.trim() || "Low Stock Alert",
      unitCost: orderData.unitCost?.trim() || "$85/cu.m"
    };

    set(state => {
      const cleanPrev = deduplicateMaterials(state.materials);
      const existingIndex = cleanPrev.findIndex(m => m.name.toLowerCase().trim() === nameClean.toLowerCase());

      let updated;
      if (existingIndex !== -1) {
        updated = [...cleanPrev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...newMat,
          id: updated[existingIndex].id
        };
      } else {
        updated = [...cleanPrev, newMat];
      }
      safeSetStorage('buildos_materials', updated);
      return { materials: updated };
    });

    const notifStore = useNotificationStore.getState();
    notifStore.logActivity(`Material Dispatched: ${newMat.name}`, newMat.siteAllocated, 'Stock Updated', 'purple');
    return newMat;
  },

  updateMaterial: (id, updatedFields) => {
    set(state => {
      const updated = state.materials.map(m => {
        if (m.id === Number(id) || m.id === id || (m.name && m.name.toLowerCase().trim() === String(id).toLowerCase().trim())) {
          return { ...m, ...updatedFields };
        }
        return m;
      });
      safeSetStorage('buildos_materials', updated);
      return { materials: updated };
    });

    const notifStore = useNotificationStore.getState();
    notifStore.logActivity(`Material Updated`, `ID: ${id}`, 'Inventory Updated', 'purple');
  },

  deleteMaterial: (idOrName) => {
    let removedName = '';

    set(state => {
      const filtered = state.materials.filter(m => {
        if (!m) return false;
        const matchId = m.id === Number(idOrName) || m.id === idOrName;
        const matchName = m.name && m.name.toLowerCase().trim() === String(idOrName).toLowerCase().trim();
        if (matchId || matchName) {
          removedName = m.name;
          return false;
        }
        return true;
      });
      safeSetStorage('buildos_materials', filtered);
      return { materials: filtered };
    });

    const notifStore = useNotificationStore.getState();
    notifStore.logActivity(`Material Removed Everywhere`, `ID/Name: ${idOrName}`, 'Purged from Inventory & Projects', 'purple');
    return removedName || idOrName;
  },

  setMaterials: (updater) => {
    set(state => {
      const updated = typeof updater === 'function' ? updater(state.materials) : updater;
      safeSetStorage('buildos_materials', updated);
      return { materials: updated };
    });
  }
}));

export default useMaterialStore;
