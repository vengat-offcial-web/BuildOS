import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { useData } from '../context/useData';
import {
  TasksHeader,
  TasksFilterBar,
  TasksList,
  CreateTaskModal,
  EditTaskModal,
  DeleteTaskModal
} from '../components/Tasks';

const taskCategoriesList = [
  'Safety Inspection',
  'Concrete & Pouring',
  'Electrical & Wiring',
  'Scaffolding & Structure',
  'Quality Inspection (QA/QC)',
  'General Operations'
];

const formatFriendlyDate = (dateVal) => {
  if (!dateVal) return 'Tomorrow';
  if (dateVal === 'Today' || dateVal === 'Tomorrow') return dateVal;

  try {
    const parts = dateVal.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      const today = new Date();
      today.setHours(0,0,0,0);
      const target = new Date(d);
      target.setHours(0,0,0,0);

      const diffTime = target.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Tomorrow';

      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  } catch {}
  return dateVal;
};

const toIsoDate = (friendlyStr) => {
  const today = new Date();
  if (!friendlyStr || friendlyStr === 'Today') {
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  if (friendlyStr === 'Tomorrow') {
    const tmr = new Date(today);
    tmr.setDate(tmr.getDate() + 1);
    const yyyy = tmr.getFullYear();
    const mm = String(tmr.getMonth() + 1).padStart(2, '0');
    const dd = String(tmr.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  try {
    const parsed = new Date(friendlyStr);
    if (!isNaN(parsed.getTime())) {
      const yyyy = parsed.getFullYear();
      const mm = String(parsed.getMonth() + 1).padStart(2, '0');
      const dd = String(parsed.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
  } catch {}

  const tmr = new Date(today);
  tmr.setDate(tmr.getDate() + 1);
  const yyyy = tmr.getFullYear();
  const mm = String(tmr.getMonth() + 1).padStart(2, '0');
  const dd = String(tmr.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, pendingTasksCount, overdueTasksCount, workers, projects } = useData();
  const outletContext = useOutletContext() || {};
  const searchTerm = outletContext.searchTerm || '';
  const location = useLocation();
  const initialStatusTab = location.state?.filterStatus || 'All';
  const [statusTab, setStatusTab] = useState(initialStatusTab);
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  useEffect(() => {
    if (location.state?.filterStatus) {
      setStatusTab(location.state.filterStatus);
    }
  }, [location.state]);
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Available worker assignees strictly derived from live active registered workers roster
  const availableAssignees = useMemo(() => {
    if (!workers || !Array.isArray(workers)) return [];

    const seen = new Set();
    const result = [];

    workers.forEach(w => {
      if (!w || !w.name) return;
      const cleanName = w.name.trim();
      const key = cleanName.toLowerCase();

      // Exclude declined worker accounts
      if (w.approvalStatus === 'Declined') return;

      if (!seen.has(key)) {
        seen.add(key);
        result.push({
          name: cleanName,
          trade: w.trade || 'Site Specialist',
          site: w.site || ''
        });
      }
    });

    return result;
  }, [workers]);

  // Available construction sites catalog
  const availableSites = useMemo(() => {
    const projSites = (projects || []).map(p => p.name).filter(Boolean);
    const defaultSites = ['Marina Tower', 'Metro Line Extension', 'SkyView Apartments', 'Green Valley Township', 'Hyper Mall'];
    return Array.from(new Set([...projSites, ...defaultSites]));
  }, [projects]);

  // Create Task Form State
  const [newTask, setNewTask] = useState({ 
    title: '', 
    site: availableSites[0] || 'Marina Tower', 
    assignee: availableAssignees[0]?.name || '', 
    category: 'Safety Inspection',
    priority: 'Medium', 
    dueDate: 'Tomorrow' 
  });

  // Edit Task Form State
  const [editingTask, setEditingTask] = useState(null);

  // Delete Target Task State
  const [deletingTask, setDeletingTask] = useState(null);

  // Handlers
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    addTask(newTask);
    setNewTask({ 
      title: '', 
      site: availableSites[0] || 'Marina Tower', 
      assignee: availableAssignees[0]?.name || '', 
      category: 'Safety Inspection',
      priority: 'Medium', 
      dueDate: 'Tomorrow' 
    });
    setShowCreateModal(false);
    triggerToast('New task assigned successfully!');
  };

  const handleOpenEditModal = (task) => {
    setEditingTask({
      id: task.id,
      title: task.title || task.name || '',
      site: task.site || availableSites[0] || 'Marina Tower',
      assignee: task.assignee || availableAssignees[0]?.name || '', 
      category: task.category || 'General Operations',
      status: task.status || 'Pending',
      priority: task.priority || 'Medium',
      dueDate: task.dueDate || 'Tomorrow'
    });
    setShowEditModal(true);
  };

  const handleSaveEditTask = (e) => {
    e.preventDefault();
    if (!editingTask || !editingTask.title.trim()) return;

    if (updateTask) {
      updateTask(editingTask.id, editingTask);
    }
    setShowEditModal(false);
    triggerToast(`Task '${editingTask.title}' updated successfully!`);
    setEditingTask(null);
  };

  const handleOpenDeleteModal = (task) => {
    setDeletingTask(task);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingTask) return;
    if (deleteTask) {
      deleteTask(deletingTask.id);
    }
    setShowDeleteModal(false);
    triggerToast(`Task '${deletingTask.title || deletingTask.name}' deleted.`);
    setDeletingTask(null);
  };

  const filteredTasks = tasks.filter(t => {
    const title = t.title || t.name || '';
    const site = t.site || '';
    const assignee = t.assignee || '';
    const category = t.category || 'General Operations';

    const matchesSearch = !searchTerm || 
      title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      site.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase());

    const isOverdueTask = t.status !== 'Completed' && (t.overdue || t.status === 'Overdue');
    const matchesTab = statusTab === 'All' ? true : statusTab === 'Overdue' ? isOverdueTask : t.status === statusTab;
    const matchesCategory = categoryFilter === 'All Categories' ? true : category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesTab && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-8 relative">
      {/* Header */}
      <TasksHeader
        pendingTasksCount={pendingTasksCount}
        overdueTasksCount={overdueTasksCount}
        onCreateTaskClick={() => setShowCreateModal(true)}
      />

      {/* Filter Tabs & Category Filter Bar */}
      <TasksFilterBar
        statusTab={statusTab}
        onStatusTabChange={setStatusTab}
        overdueTasksCount={overdueTasksCount}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        taskCategoriesList={taskCategoriesList}
      />

      {/* Tasks List */}
      <TasksList
        tasks={filteredTasks}
        onEditTask={handleOpenEditModal}
        onDeleteTask={handleOpenDeleteModal}
      />

      {/* Modals */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        newTask={newTask}
        setNewTask={setNewTask}
        availableAssignees={availableAssignees}
        availableSites={availableSites}
        taskCategoriesList={taskCategoriesList}
        toIsoDate={toIsoDate}
        formatFriendlyDate={formatFriendlyDate}
        onSubmit={handleAddTask}
      />

      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        availableAssignees={availableAssignees}
        availableSites={availableSites}
        taskCategoriesList={taskCategoriesList}
        toIsoDate={toIsoDate}
        formatFriendlyDate={formatFriendlyDate}
        onSubmit={handleSaveEditTask}
      />

      <DeleteTaskModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        deletingTask={deletingTask}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default Tasks;