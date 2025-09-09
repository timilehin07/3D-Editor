import React, { useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Hotspot } from '../types/Hotspot';
import { HotspotMarker } from './HotspotMarker';
import * as THREE from 'three';

interface ModelProps {
  url: string;
  hotspots: Hotspot[];
  onAddHotspot: (hotspot: Hotspot) => void;
  isPlacingHotspot: boolean;
}

const Model: React.FC<ModelProps> = ({ url, hotspots, onAddHotspot, isPlacingHotspot }) => {
  const { scene } = useGLTF(url);
  const { camera, raycaster, mouse, gl } = useThree();
  const modelRef = useRef<THREE.Group>(null);

  const handleClick = (event: any) => {
    if (!isPlacingHotspot || !modelRef.current) return;

    event.stopPropagation();
    
    const rect = gl.domElement.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);
    const intersects = raycaster.intersectObject(modelRef.current, true);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      const newHotspot: Hotspot = {
        id: `hotspot-${Date.now()}`,
        position: [point.x, point.y, point.z],
        label: `Hotspot ${hotspots.length + 1}`,
        description: 'Click to edit description'
      };
      
      onAddHotspot(newHotspot);
    }
  };

  return (
    <group 
      ref={modelRef} 
      onClick={handleClick}
    >
      <primitive object={scene.clone()} />
    </group>
  );
};

interface ThreeJSEditorProps {
  modelUrl: string | null;
  hotspots: Hotspot[];
  onAddHotspot: (hotspot: Hotspot) => void;
  isPlacingHotspot: boolean;
}

export const ThreeJSEditor: React.FC<ThreeJSEditorProps> = ({
  modelUrl,
  hotspots,
  onAddHotspot,
  isPlacingHotspot
}) => {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full h-full relative bg-gray-900">
      {error && (
        <div className="absolute top-4 left-4 right-4 z-10 bg-red-600 text-white p-3 rounded-lg">
          {error}
        </div>
      )}
      
      {isPlacingHotspot && (
        <div className="absolute top-4 left-4 z-10 bg-blue-600 text-white px-4 py-2 rounded-lg">
          Click on the model to place a hotspot
        </div>
      )}

      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ cursor: isPlacingHotspot ? 'crosshair' : 'default' }}
        onCreated={({ gl }) => {
          gl.setClearColor('#1f2937');
        }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <spotLight position={[-10, -10, -5]} angle={0.3} intensity={0.5} />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={20}
          makeDefault
        />

        {modelUrl && (
          <React.Suspense fallback={null}>
            <Model
              url={modelUrl}
              hotspots={hotspots}
              onAddHotspot={onAddHotspot}
              isPlacingHotspot={isPlacingHotspot}
            />
          </React.Suspense>
        )}

        {hotspots.map(hotspot => (
          <HotspotMarker
            key={hotspot.id}
            hotspot={hotspot}
          />
        ))}
      </Canvas>

      {!modelUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-gray-400">Upload a GLB file to get started</p>
          </div>
        </div>
      )}
    </div>
  );
};