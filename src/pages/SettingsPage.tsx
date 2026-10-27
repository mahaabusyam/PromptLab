import { zodResolver } from "@hookform/resolvers/zod";
import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ApiSection } from "@/features/settings/components/ApiSection";
import { AppearanceSection } from "@/features/settings/components/AppearanceSection";
import { DataSection } from "@/features/settings/components/DataSection";
import { GeneralSection } from "@/features/settings/components/GeneralSection";
import { SettingsHeader } from "@/features/settings/components/SettingsHeader";
import { SettingsNav } from "@/features/settings/components/SettingsNav";
import { generalSchema, type GeneralValues } from "@/features/settings/schemas";
import { useSettingsStore } from "@/stores/settingsStore";

export default function SettingsPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.update);
  const [saved, setSaved] = useState(false);

  const stored: GeneralValues = {
    workspaceName: settings.workspaceName,
    defaultModel: settings.defaultModel,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<GeneralValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: stored,
  });

  // Keep the form in sync when the store changes from elsewhere (e.g. after a backup restore)
  useEffect(() => {
    reset({
      workspaceName: settings.workspaceName,
      defaultModel: settings.defaultModel,
    });
  }, [settings.workspaceName, settings.defaultModel, reset]);

  const onSubmit = handleSubmit((values) => {
    update(values);
    setSaved(true);
  });

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-enter]",
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "transform,opacity",
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="space-y-6">
      <SettingsHeader
        isDirty={isDirty}
        saved={saved}
        onDiscard={() => {
          reset(stored);
          setSaved(false);
        }}
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <SettingsNav />

        <div className="flex flex-col gap-6 lg:col-span-9">
          <form
            id="general-form"
            noValidate
            onSubmit={onSubmit}
            onChange={() => setSaved(false)}
          >
            <GeneralSection register={register} errors={errors} />
          </form>
          <AppearanceSection />
          <DataSection />
          <ApiSection />
        </div>
      </div>
    </div>
  );
}
