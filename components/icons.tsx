export function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}

export function RouteIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function TelegramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M21.2 3.6 2.9 10.7c-1.2.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.5c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.6-1.4ZM8.6 13.4l9.3-5.9c.5-.3.9-.1.5.2l-7.9 7.2-.3 3.4-1.6-4.9Z" />
    </svg>
  );
}

export function VkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.9 18C6.6 18 3 13.7 2.9 6.6h3.2c.1 5.2 2.4 7.4 4.2 7.9V6.6h3v4.5c1.8-.2 3.7-2.3 4.3-4.5h3c-.5 2.8-2.5 4.8-4 5.7 1.5.7 3.8 2.5 4.7 5.7h-3.3c-.7-2.2-2.5-3.9-4.7-4.1V18h-.4Z" />
    </svg>
  );
}
