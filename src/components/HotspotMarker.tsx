import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Hotspot } from '../types/Hotspot';
import * as THREE from 'three';

interface HotspotMarkerProps {
  hotspot: Hotspot;
}

export const HotspotMarker: React.FC<HotspotMarkerProps> = ({ hotspot }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = hotspot.position[1] + Math.sin(clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={hotspot.position}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          color={hovered ? "#60A5FA" : "#3B82F6"} 
          emissive={hovered ? "#1E40AF" : "#1D4ED8"}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {hovered && (
        <Html
          position={[0, 0.3, 0]}
          center
          style={{
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <div className="bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-600 max-w-48">
            <div className="font-semibold text-sm">{hotspot.label}</div>
            <div className="text-xs text-gray-300 mt-1">{hotspot.description}</div>
          </div>
        </Html>
      )}
    </group>
  );
};