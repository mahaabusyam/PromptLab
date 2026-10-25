import { format } from 'date-fns';
import { ArrowLeft, Search } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StatusScreen, primaryAction, secondaryAction } from '@/components/common/StatusScreen';

export default function NotFoundPage() {
  const { pathname } = useLocation();
  const [time] = useState(() => format(new Date(), 'HH:mm:ss')); // captured once, doesn't tick

  return (
    <StatusScreen
      badge="HTTP 404 // ROUTE_NOT_FOUND"
      code="404"
      chip='< route status="undefined_route" />'
      title="Prompt Execution Failed: Page Not Found"
      description="Oops! The prompt or page you are looking for does not exist or has been moved."
      documentTitle="404 · PromptLab"
      details={[
        { label: 'Request path', value: pathname },
        { label: 'Response status', value: '404 Not Found', tone: 'error' },
        { label: 'Timestamp', value: time },
      ]}
    >
      <Link to="/" className={primaryAction}>
        <ArrowLeft className="rtl:-scale-x-100 size-4" aria-hidden="true" />
        Back to Dashboard
      </Link>
      <Link to="/library" className={secondaryAction}>
        <Search className="size-4" aria-hidden="true" />
        Search Prompt Library
      </Link>
    </StatusScreen>
  );
}