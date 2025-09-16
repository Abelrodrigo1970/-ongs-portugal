'use client';

import { useState } from 'react';
import { 
  Building, 
  GraduationCap, 
  Map, 
  Users,
  Plus 
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import SimpleNGOAdmin from './SimpleNGOAdmin';
import SimpleODSAdmin from './SimpleODSAdmin';
import SimpleAreasAdmin from './SimpleAreasAdmin';
import SimpleColaboracaoAdmin from './SimpleColaboracaoAdmin';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('ngos');

  const tabs = [
    {
      id: 'ngos',
      name: 'ONGs',
      icon: Building,
      description: 'Gerir organizações não-governamentais'
    },
    {
      id: 'ods',
      name: 'ODS',
      icon: GraduationCap,
      description: 'Gerir Objetivos de Desenvolvimento Sustentável'
    },
    {
      id: 'areas',
      name: 'Áreas de Atuação',
      icon: Map,
      description: 'Gerir áreas de atuação das ONGs'
    },
    {
      id: 'colaboracao',
      name: 'Tipos de Colaboração',
      icon: Users,
      description: 'Gerir tipos de colaboração'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'ngos' && <SimpleNGOAdmin />}
        {activeTab === 'ods' && <SimpleODSAdmin />}
        {activeTab === 'areas' && <SimpleAreasAdmin />}
        {activeTab === 'colaboracao' && <SimpleColaboracaoAdmin />}
      </div>
    </div>
  );
};

export default AdminDashboard;

