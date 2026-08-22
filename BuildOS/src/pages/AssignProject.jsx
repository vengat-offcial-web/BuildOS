import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/useData';
import {
  AssignProjectHeader,
  SuccessToastNotification,
  ProjectInfoCard,
  SiteEngineerCard,
  TimelineCard,
  WorkforceCard,
  PriorityCard,
  FormActionBar
} from '../components/AssignProject';

const INITIAL_FORM_STATE = {
  name: '',
  location: '',
  description: '',
  selectedEngineer: null,
  startDate: '2026-08-15',
  deadline: '2027-02-15',
  workforceRequired: 25,
  priority: 'Medium'
};

function AssignProject() {
  const navigate = useNavigate();
  const { addProject, workers } = useData();

  // Form & UI States
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [engineerSearch, setEngineerSearch] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Field change handler that automatically clears validation error for that field
  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      if (!prev[field] && !prev.dateSequence) return prev;
      const updated = { ...prev };
      delete updated[field];
      if (field === 'startDate' || field === 'deadline') {
        delete updated.dateSequence;
      }
      return updated;
    });
  }, []);

  const handleCitySelect = useCallback((city) => {
    handleFieldChange('location', city);
  }, [handleFieldChange]);

  const handleEngineerSelect = useCallback((engineer) => {
    handleFieldChange('selectedEngineer', engineer);
    setErrors(prev => ({ ...prev, engineer: null }));
  }, [handleFieldChange]);

  // Derived Filtered Engineers List
  const filteredEngineers = useMemo(() => {
    const activeEngineers = (workers || []).map((w, idx) => ({
      id: w.id || idx + 1,
      name: w.name,
      role: w.trade || 'Site Lead',
      phone: w.phone || '+91 98765 00000',
      avatarBg: "from-[#E9D5FF] to-[#C4B5FD]"
    }));

    if (!engineerSearch.trim()) return activeEngineers;

    const query = engineerSearch.toLowerCase().trim();
    return activeEngineers.filter(e =>
      e.name.toLowerCase().includes(query) ||
      e.role.toLowerCase().includes(query)
    );
  }, [engineerSearch, workers]);

  // Derived Estimated Duration
  const durationText = useMemo(() => {
    const { startDate, deadline } = formData;
    if (!startDate || !deadline) return null;
    const start = new Date(startDate);
    const end = new Date(deadline);
    const diffTime = end - start;
    if (diffTime < 0) return { days: 0, text: "Invalid date sequence" };
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = (diffDays / 30.4).toFixed(1);
    return { days: diffDays, text: `${diffDays} Days (~${months} Months)` };
  }, [formData.startDate, formData.deadline]);

  // Form Validation
  const validateForm = useCallback(() => {
    const errs = {};
    const { name, location, selectedEngineer, startDate, deadline, workforceRequired } = formData;

    if (!name.trim()) errs.name = "Project name is required";
    if (!location.trim()) errs.location = "Site location is required";
    if (!selectedEngineer) errs.engineer = "Please assign a site engineer";
    if (!deadline) errs.deadline = "Target deadline is required";

    if (startDate && deadline && new Date(deadline) < new Date(startDate)) {
      errs.dateSequence = "Target deadline cannot be before the start date";
    }

    if (!workforceRequired || workforceRequired < 1) {
      errs.workers = "Workforce requirement must be at least 1 worker";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [formData]);

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    const projectPayload = {
      name: formData.name.trim(),
      location: formData.location.trim(),
      description: formData.description.trim(),
      manager: formData.selectedEngineer ? formData.selectedEngineer.name : 'Rajesh Kumar',
      startDate: formData.startDate,
      deadline: formData.deadline,
      workforceRequired: formData.workforceRequired,
      priority: formData.priority,
      status: 'Planning'
    };

    setTimeout(() => {
      addProject(projectPayload);
      setSubmitting(false);
      setSuccessToast(true);

      setTimeout(() => {
        navigate('/projects');
      }, 1400);
    }, 400);
  };

  const handleCancel = useCallback(() => {
    navigate('/projects');
  }, [navigate]);

  return (
    <div className="space-y-8 pb-16 relative">
      {/* Top Header & Navigation */}
      <AssignProjectHeader onBack={handleCancel} />

      {/* Success Notification Toast */}
      {successToast && <SuccessToastNotification />}

      {/* Main 2-Column Responsive Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          <ProjectInfoCard
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
            onCitySelect={handleCitySelect}
          />

          <SiteEngineerCard
            engineers={filteredEngineers}
            selectedEngineer={formData.selectedEngineer}
            engineerSearch={engineerSearch}
            errors={errors}
            onSearchChange={setEngineerSearch}
            onEngineerSelect={handleEngineerSelect}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <TimelineCard
            startDate={formData.startDate}
            deadline={formData.deadline}
            durationText={durationText}
            errors={errors}
            onChange={handleFieldChange}
          />

          <WorkforceCard
            workforceRequired={formData.workforceRequired}
            errors={errors}
            onChange={handleFieldChange}
          />

          <PriorityCard
            priority={formData.priority}
            onChange={handleFieldChange}
          />
        </div>

        {/* Action Bar */}
        <FormActionBar
          submitting={submitting}
          onCancel={handleCancel}
        />
      </form>
    </div>
  );
}

export default AssignProject;
