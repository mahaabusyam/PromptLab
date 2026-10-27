import { format } from "date-fns";
import { ArrowLeft, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import {
  StatusScreen,
  primaryAction,
  secondaryAction,
} from "@/components/common/StatusScreen";

export default function NotFoundPage() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [time] = useState(() => format(new Date(), "HH:mm:ss")); // captured once, doesn't tick

  return (
    <StatusScreen
      badge="HTTP 404 // ROUTE_NOT_FOUND"
      code="404"
      chip='< route status="undefined_route" />'
      title={t("notFound.title")}
      description={t("notFound.description")}
      documentTitle={t("notFound.documentTitle")}
      details={[
        { label: t("status.requestPath"), value: pathname },
        {
          label: t("notFound.responseStatus"),
          value: "404 Not Found",
          tone: "error",
        },
        { label: t("status.timestamp"), value: time },
      ]}
    >
      <Link to="/" className={primaryAction}>
        <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        {t("status.backToDashboard")}
      </Link>
      <Link to="/library" className={secondaryAction}>
        <Search className="size-4" aria-hidden="true" />
        {t("notFound.searchLibrary")}
      </Link>
    </StatusScreen>
  );
}
