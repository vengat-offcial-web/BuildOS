import React, { useState, useMemo, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useData } from '../context/useData';
import {
  MaterialsHeader,
  MaterialsFilterBar,
  MaterialGrid,
  NewOrderModal,
  EditMaterialModal
} from '../components/Materials';

const INITIAL_NEW_ORDER = {
  name: '',
  category: '',
  totalStock: '',
  siteAllocated: '',
  unitCost: '',
  status: 'Low Stock Alert'
};

const INITIAL_EDIT_FORM = {
  id: '',
  name: '',
  category: '',
  totalStock: '',
  siteAllocated: '',
  unitCost: '',
  status: 'Stocked'
};

function Materials() {
  const { materials, addMaterialOrder, updateMaterial, deleteMaterial } = useData();
  const outletContext = useOutletContext() || {};
  const searchTerm = outletContext.searchTerm || '';

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [newOrder, setNewOrder] = useState(INITIAL_NEW_ORDER);

  // Edit Material Form State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editForm, setEditForm] = useState(INITIAL_EDIT_FORM);

  const handleNewOrderChange = useCallback((field, value) => {
    setNewOrder(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!newOrder.name.trim()) return;

    addMaterialOrder({
      name: newOrder.name.trim(),
      category: newOrder.category.trim() || 'Concrete & Cement',
      totalStock: newOrder.totalStock.trim() || '300 cum',
      siteAllocated: newOrder.siteAllocated.trim() || 'Hyper Mall (450 cu.m)',
      unitCost: newOrder.unitCost.trim() || '$85/cu.m',
      status: newOrder.status || 'Low Stock Alert'
    });

    setNewOrder(INITIAL_NEW_ORDER);
    setShowOrderModal(false);
  };

  const handleOpenEditModal = useCallback((mat) => {
    setEditingMaterial(mat);
    setEditForm({
      id: mat.id,
      name: mat.name || '',
      category: mat.category || '',
      totalStock: mat.totalStock || '',
      siteAllocated: mat.siteAllocated || '',
      unitCost: mat.unitCost || '',
      status: mat.status || 'Stocked'
    });
    setShowEditModal(true);
  }, []);

  const handleEditChange = useCallback((field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) return;

    updateMaterial(editForm.id, {
      name: editForm.name.trim(),
      category: editForm.category.trim() || 'General Construction',
      totalStock: editForm.totalStock.trim() || '100 Units',
      siteAllocated: editForm.siteAllocated.trim() || 'Site Allocated',
      unitCost: editForm.unitCost.trim() || '$100/Unit',
      status: editForm.status || 'Stocked'
    });

    setShowEditModal(false);
    setEditingMaterial(null);
  };

  const handleCloseEditModal = useCallback(() => {
    setShowEditModal(false);
    setEditingMaterial(null);
  }, []);

  // Derive category counts dynamically for the dropdown filter
  const categoryStats = useMemo(() => {
    const counts = {};
    (materials || []).forEach(m => {
      if (m && m.category && m.category.trim()) {
        const cat = m.category.trim();
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return counts;
  }, [materials]);

  const filtered = useMemo(() => {
    const seen = new Set();
    return (materials || []).filter(m => {
      if (!m || !m.name) return false;
      const key = m.name.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);

      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (m.siteAllocated && m.siteAllocated.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'All' || 
                              (m.category && m.category.toLowerCase().includes(categoryFilter.toLowerCase())) ||
                              (m.category && categoryFilter.toLowerCase().includes(m.category.toLowerCase()));
      return matchesSearch && matchesCategory;
    });
  }, [materials, searchTerm, categoryFilter]);

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <MaterialsHeader onOpenNewOrder={() => setShowOrderModal(true)} />

      {/* Filter Category Bar */}
      <MaterialsFilterBar
        filteredCount={filtered.length}
        totalCount={(materials || []).length}
        categoryFilter={categoryFilter}
        categoryStats={categoryStats}
        onCategoryFilterChange={setCategoryFilter}
        onResetCategory={() => setCategoryFilter('All')}
      />

      {/* Inventory Cards Grid */}
      <MaterialGrid
        materials={filtered}
        onEdit={handleOpenEditModal}
        onDelete={deleteMaterial}
      />

      {/* New Order Modal Popup */}
      <NewOrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        newOrder={newOrder}
        onChange={handleNewOrderChange}
        onSubmit={handleOrderSubmit}
      />

      {/* Edit Material Modal Popup */}
      <EditMaterialModal
        isOpen={showEditModal && !!editingMaterial}
        onClose={handleCloseEditModal}
        editForm={editForm}
        onChange={handleEditChange}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
}

export default Materials;