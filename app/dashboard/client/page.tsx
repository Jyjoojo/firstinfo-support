"use client";

import {
  ChevronRight,
  CircleCheckBig,
  ClipboardList,
  Hourglass,
  ThumbsUp,
  TrendingDown,
} from "lucide-react";
import { motion } from "motion/react";
import ContractsOverview from "@/app/ui/dashboard/client/ContractsOverview";
import KnowledgeBaseWidget from "@/app/ui/dashboard/client/KnowledgeBaseWidget";
import {
  DirectSupportWidget,
  MaintenanceNotice,
} from "@/app/ui/dashboard/client/SupportWidgets";
import TicketsTable from "@/app/ui/dashboard/client/TicketsTable";
import StatCard from "@/app/ui/dashboard/StatCard";

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: "easeOut" as const,
    },
  },
};

const slideFromLeft = {
  hidden: {
    opacity: 0,
    x: -22,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.42,
      ease: "easeOut" as const,
    },
  },
};

const slideFromRight = {
  hidden: {
    opacity: 0,
    x: 22,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.42,
      ease: "easeOut" as const,
    },
  },
};

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl p-6 lg:p-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.4,
        }}
        variants={slideFromLeft}
        className="mb-6"
      >
        <h2 className="text-xl font-bold text-on-surface lg:text-2xl">
          Tableau de bord
        </h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Bienvenue, voici un aperçu de vos demandes de support Sage.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.2,
        }}
        variants={staggerContainer}
        className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3"
      >
        <motion.div
          variants={fadeUp}
          whileHover={{
            y: -4,
            scale: 1.01,
          }}
          transition={{
            duration: 0.2,
          }}
        >
          <StatCard
            icon={ClipboardList}
            iconColorClass="text-primary"
            bgColorClass="bg-primary/10"
            tag="Priorité Haute"
            label="Tickets Actifs"
            value="12"
            trend={{
              icon: TrendingDown,
              value: "-2",
              colorClass: "text-green-600",
            }}
            helper="vs. semaine dernière"
          />
        </motion.div>

        <motion.div
          variants={fadeUp}
          whileHover={{
            y: -4,
            scale: 1.01,
          }}
          transition={{
            duration: 0.2,
          }}
        >
          <StatCard
            icon={Hourglass}
            iconColorClass="text-tertiary"
            bgColorClass="bg-tertiary/10"
            tag="En attente"
            label="Solutions en attente"
            value="05"
            helper="Moyenne réponse : 4h"
          />
        </motion.div>

        <motion.div
          variants={fadeUp}
          whileHover={{
            y: -4,
            scale: 1.01,
          }}
          transition={{
            duration: 0.2,
          }}
        >
          <StatCard
            icon={CircleCheckBig}
            iconColorClass="text-on-surface"
            bgColorClass="bg-tertiary-container/30"
            tag="Succès"
            label="Résolus ce mois-ci"
            value="48"
            trend={{
              icon: ThumbsUp,
              value: "98%",
              colorClass: "text-green-600",
            }}
            helper="Taux de satisfaction"
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.4,
            }}
            variants={slideFromLeft}
            className="mb-4 flex items-center justify-between"
          >
            <h4 className="text-lg font-bold text-on-surface">
              Tickets Récents
            </h4>
            <motion.a
              whileHover={{
                x: 3,
              }}
              className="flex items-center gap-1 text-sm font-bold text-primary hover:underline"
              href="client/tickets"
            >
               Voir tout
              <ChevronRight size={16} />
            </motion.a>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            variants={fadeUp}
          >
            <TicketsTable />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            variants={fadeUp}
          >
            <ContractsOverview />
          </motion.div>
        </section>

        <aside className="space-y-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.25,
            }}
            variants={slideFromRight}
          >
            <KnowledgeBaseWidget />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.25,
            }}
            variants={slideFromRight}
          >
            <DirectSupportWidget />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.25,
            }}
            variants={slideFromRight}
          >
            <MaintenanceNotice />
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
