import { useDataStore } from '../store/useDataStore';

export const useData = () => {
  const store = useDataStore();
  return {
    ...store,
    projects: store.enrichedProjects,
    tasks: store.enrichedTasks
  };
};

export default useData;
