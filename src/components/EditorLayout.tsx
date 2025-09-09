import React, { useState } from 'react';
import { FileUploader } from './FileUploader';
import { ThreeJSEditor } from './ThreeJSEditor';
import { HotspotPanel } from './HotspotPanel';
import { Hotspot } from '../types/Hotspot';

export const EditorLayout: React.FC = () => {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [isPlacingHotspot, setIsPlacingHotspot] = useState(false);

  const handleFileUpload = (url: string) => {
    setModelUrl(url);
    setHotspots([]); // Clear hotspots when new model is loaded
  };

  const addHotspot = (hotspot: Hotspot) => {
    setHotspots(prev => [...prev, hotspot]);
    setIsPlacingHotspot(false);
  };

  const updateHotspot = (id: string, updates: Partial<Hotspot>) => {
    setHotspots(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const deleteHotspot = (id: string) => {
    setHotspots(prev => prev.filter(h => h.id !== id));
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
      {/* Left Panel */}
      <div className="w-full lg:w-80 bg-gray-800 border-r border-gray-700 flex flex-col lg:max-h-full">
        <FileUploader onFileUpload={handleFileUpload} />
        <HotspotPanel
          hotspots={hotspots}
          onAddHotspot={() => setIsPlacingHotspot(true)}
          onUpdateHotspot={updateHotspot}
          onDeleteHotspot={deleteHotspot}
          isPlacingHotspot={isPlacingHotspot}
          onCancelPlacing={() => setIsPlacingHotspot(false)}
        />
      </div>
      
      {/* 3D Viewport */}
      <div className="flex-1 relative min-h-[60vh] lg:min-h-full">
        <ThreeJSEditor
          modelUrl={modelUrl}
          hotspots={hotspots}
          onAddHotspot={addHotspot}
          isPlacingHotspot={isPlacingHotspot}
        />
      </div>
    </div>
  );
};