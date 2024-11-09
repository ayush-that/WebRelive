"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

import { Sidebar } from "@/components/ui/sidebar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import {
  Globe,
  Shield,
  Zap,
  Activity,
  DollarSign,
  Users,
  Clock,
  Loader2,
  Layout,
  Rocket,
  GitBranch,
  Cpu,
  Network,
  Search,
} from "lucide-react";

export default function Dashboard() {
  const sidebarItems = [
    { name: "Sites", icon: Layout },
    { name: "Deploy", icon: Rocket },
    { name: "Manage Websites", icon: GitBranch },
    { name: "Tokens", icon: Zap },
    { name: "AI Website", icon: Cpu },
    { name: "Decentralized CDN", icon: Network },
    { name: "Search Engine", icon: Search },
    { name: "Example Websites", icon: Globe },
    { name: "Smart Contracts", icon: Shield },
  ];

  const [activeTab, setActiveTab] = useState("Sites");

  return (
    <div className="min-h-screen bg-black text-gray-300">
      <div className="flex">
        <Sidebar
          items={sidebarItems}
          activeItem={activeTab}
          setActiveItem={setActiveTab}
        />
        <div className="flex-1 p-10 ml-64">
          <h1 className="text-4xl font-bold mb-8 text-white">
            Welcome to Your Dashboard
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-[#0a0a0a] border-[#18181b]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Total Websites
                </CardTitle>
                <Globe className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent></CardContent>
            </Card>
            <Card className="bg-[#0a0a0a] border-[#18181b]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Latest Deployment
                </CardTitle>
                <Clock className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent></CardContent>
            </Card>
            <Card className="bg-[#0a0a0a] border-[#18181b]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Total Deployments
                </CardTitle>
                <Activity className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
