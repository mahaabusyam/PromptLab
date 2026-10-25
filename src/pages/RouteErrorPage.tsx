import { format } from 'date-fns';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useRouteError } from 'react-router-dom';
import { describeRouteError } from '@/app/routeError';
import { StatusScreen, primaryAction, secondaryAction } from '@/components/common/StatusScreen';
import NotFoundPage from './NotFoundPage';

export default function RouteErrorPage() {
  const error = useRouteError();
  const { pathname } = useLocation();
  const [time] = useState(() => format(new Date(), 'HH:mm:ss'));
  const { code, message } = describeRouteError(error);

  useEffect(() => {
    console.error(error); // keep the real error visible for debugging
  }, [error]);

  if (code === 404) return <NotFoundPage />;

  return (
    <StatusScreen
      badge="RUNTIME // UNHANDLED_ERROR"
      code={code ? String(code) : '500'}
      chip='< app status="crashed" />'
      title="Something went wrong"
      description="This page hit an unexpected error. Your saved prompts are safe in local storage."
      documentTitle="Error · PromptLab"
      details={[
        { label: 'Request path', value: pathname },
        { label: 'Error', value: message, tone: 'error' },
        { label: 'Timestamp', value: time },
      ]}
    >
      <button type="button" onClick={() => window.location.reload()} className={primaryAction}>
        <RotateCw className="size-4" aria-hidden="true" />
        Reload page
      </button>
      <Link to="/" className={secondaryAction}>
        <ArrowLeft className="rtl:-scale-x-100 size-4" aria-hidden="true" />
        Back to Dashboard
      </Link>
    </StatusScreen>
  );
}