"use client";

import { useState } from "react";
import { FileChartColumnIncreasing } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type GenerateReportDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function GenerateReportDrawer({
  open,
  onOpenChange,
}: GenerateReportDrawerProps) {
  const [pending, setPending] = useState(false);

  const generateReport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);

    try {
      // TODO: appeler l'API de génération quand l'endpoint sera disponible.
      toast.success("Rapport généré", {
        description: "Le rapport a été ajouté à l’historique.",
      });
      onOpenChange(false);
    } finally {
      setPending(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full w-full sm:max-w-2xl">
        <DrawerHeader className="border-b border-outline-variant/20 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-primary-container/20 p-2.5 text-primary">
              <FileChartColumnIncreasing size={21} />
            </span>
            <div>
              <DrawerTitle className="text-xl font-bold text-on-surface">
                Générer un rapport
              </DrawerTitle>
              <DrawerDescription>
                Créez une photographie figée des statistiques sélectionnées.
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <form
          onSubmit={generateReport}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-on-surface-variant">
              Laissez les champs vides pour un rapport sur l&apos;ensemble des tickets.
            </div>

            <FieldGroup className="gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <Label htmlFor="report-start-date">Date de début</Label>
                  <Input id="report-start-date" name="startDate" type="date" />
                </Field>
                <Field>
                  <Label htmlFor="report-end-date">Date de fin</Label>
                  <Input id="report-end-date" name="endDate" type="date" />
                </Field>
              </div>

              <Field>
                <Label>Client</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tous les clients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les clients</SelectItem>
                    <SelectItem value="first-info">First Info CI</SelectItem>
                    <SelectItem value="global-logistics">
                      Global Logistics CI
                    </SelectItem>
                    <SelectItem value="tech-solutions">Tech Solutions</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <Label>Catégorie</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="sage-100">Sage 100</SelectItem>
                    <SelectItem value="paie">Sage Paie</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </div>

          <DrawerFooter className="flex-row justify-end border-t border-outline-variant/20 px-6 py-4">
            <DrawerClose asChild>
              <Button type="button" variant="outline" disabled={pending}>
                Annuler
              </Button>
            </DrawerClose>
            <Button type="submit" disabled={pending}>
              {pending ? "Génération…" : "Générer"}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
