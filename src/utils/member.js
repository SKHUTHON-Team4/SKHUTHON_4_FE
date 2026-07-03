export function needsOnboarding(user) {
  return !user?.nickname?.trim() || user?.age == null;
}
