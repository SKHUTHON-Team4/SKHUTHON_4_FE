export default function ToggleSwitch({ checked, onChange, size = 'md', disabled = false, ariaLabel }) {
  const isSmall = size === 'sm';

  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={checked}
      className={`relative shrink-0 rounded-full transition-colors disabled:opacity-50 ${
        isSmall ? 'h-5 w-9' : 'h-6 w-12'
      } ${checked ? 'bg-primary' : 'bg-gray-200'}`}
    >
      <span
        className={`absolute rounded-full bg-white shadow transition-transform ${
          isSmall ? 'left-0.5 top-0.5 h-4 w-4' : 'left-0.5 top-0.5 h-5 w-5'
        } ${checked ? (isSmall ? 'translate-x-4' : 'translate-x-6') : 'translate-x-0'}`}
      />
    </button>
  );
}
