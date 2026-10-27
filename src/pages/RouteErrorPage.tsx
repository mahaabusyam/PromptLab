import { format } from 'date-fns';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useRouteError } from 'react-router-dom';
import { describeRouteError } from '@/app/routeError';
import { StatusScreen, primaryAction, secondaryAction } from '@/components/common/StatusScreen';
import NotFoundPage from './NotFoundPage';

export default function RouteErrorPage() {
  const { t } = useTranslation();
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
      title={t('routeError.title')}
      description={t('routeError.description')}
      documentTitle={t('routeError.documentTitle')}
      details={[
        { label: t('status.requestPath'), value: pathname },
        { label: t('routeError.error'), value: message, tone: 'error' },
        { label: t('status.timestamp'), value: time },
      ]}
    >
      <button type="button" onClick={() => window.location.reload()} className={primaryAction}>
        <RotateCw className="size-4" aria-hidden="true" />
        {t('routeError.reload')}
      </button>
      <Link to="/" className={secondaryAction}>
        <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        {t('status.backToDashboard')}
      </Link>
    </StatusScreen>
  );
}