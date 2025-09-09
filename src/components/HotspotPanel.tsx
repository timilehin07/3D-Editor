import React, { useState } from 'react';
import { Plus, MapPin, Edit2, Trash2, X, Check } from 'lucide-react';
import { Hotspot } from '../types/Hotspot';

interface HotspotPanelProps {
  hotspots: Hotspot[];
  onAddHotspot: () => void;
  onUpdateHotspot: (id: string, updates: Partial<Hotspot>) => void;
  onDeleteHotspot: (id: string) => void;
  isPlacingHotspot: boolean;
  onCancelPlacing: () => void;
}

export const HotspotPanel: React.FC<HotspotPanelProps> = ({
  hotspots,
  onAddHotspot,
  onUpdateHotspot,
  onDeleteHotspot,
  isPlacingHotspot,
  onCancelPlacing
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ label: string; description: string }>({
    label: '',
    description: ''
  });

  const startEditing = (hotspot: Hotspot) => {
    setEditingId(hotspot.id);
    setEditValues({
      label: hotspot.label,
      description: hotspot.description
    });
  };

  const saveEdit = () => {
    if (editingId) {
      onUpdateHotspot(editingId, editValues);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Hotspots</h2>
        <span className="text-sm text-gray-400">
          {hotspots.length} {hotspots.length === 1 ? 'hotspot' : 'hotspots'}
        </span>
      </div>

      <div className="mb-4">
        {isPlacingHotspot ? (
          <button
            onClick={onCancelPlacing}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel Placing
          </button>
        ) : (
          <button
            onClick={onAddHotspot}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Hotspot
          </button>
        )}
      </div>

      <div className="space-y-3">
        {hotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            className="bg-gray-700 rounded-lg p-4 border border-gray-600"
          >
            {editingId === hotspot.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editValues.label}
                  onChange={(e) => setEditValues(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-400"
                  placeholder="Hotspot label"
                />
                <textarea
                  value={editValues.description}
                  onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-400 resize-none"
                  rows={3}
                  placeholder="Description"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={saveEdit}
                    className="flex-1 flex items-center justify-center px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 flex items-center justify-center px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors duration-200"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-blue-400 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-white">{hotspot.label}</h3>
                      <p className="text-sm text-gray-300 mt-1">{hotspot.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-3">
                  <button
                    onClick={() => startEditing(hotspot)}
                    className="flex items-center px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-500 transition-colors duration-200"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteHotspot(hotspot.id)}
                    className="flex items-center px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors duration-200"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {hotspots.length === 0 && !isPlacingHotspot && (
          <div className="text-center py-8 text-gray-400">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No hotspots added yet</p>
            <p className="text-sm mt-1">Click "Add Hotspot" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};