import React from 'react';
import { Cuboid as Cube } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center space-x-3">
        <Cube className="w-8 h-8 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">3D Editor</h1>
        <span className="text-gray-400 text-sm">Import • View • Annotate</span>
      </div>
    </header>
  );
};