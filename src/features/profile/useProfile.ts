import { useProfileContext } from './ProfileProvider';

export function useProfile() {
  return useProfileContext();
}
