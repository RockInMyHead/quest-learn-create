import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface Avatar3DProps {
  isSpeaking: boolean;
  isLoading: boolean;
}

function AvatarHead({ isSpeaking, isLoading }: { isSpeaking: boolean; isLoading: boolean }) {
  const headRef = useRef<THREE.Mesh>(null!);
  const leftEyeRef = useRef<THREE.Mesh>(null!);
  const rightEyeRef = useRef<THREE.Mesh>(null!);
  const mouthRef = useRef<THREE.Mesh>(null!);
  const leftArmRef = useRef<THREE.Group>(null!);
  const rightArmRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.scale.y = 1 + Math.sin(time * 2) * 0.02;
      if (isLoading) {
        headRef.current.rotation.z = Math.sin(time * 3) * 0.1;
      } else {
        headRef.current.rotation.z = 0;
      }
    }
    if (leftEyeRef.current && rightEyeRef.current) {
      const blinkCycle = Math.sin(time * 0.5) > 0.95 ? 0.1 : 1;
      leftEyeRef.current.scale.y = blinkCycle;
      rightEyeRef.current.scale.y = blinkCycle;
    }
    if (isSpeaking && mouthRef.current) {
      const speakCycle = Math.sin(time * 15) * 0.3 + 0.7;
      mouthRef.current.scale.y = speakCycle;
      mouthRef.current.scale.x = 1.2 - speakCycle * 0.2;
    } else if (mouthRef.current) {
      mouthRef.current.scale.y = 1;
      mouthRef.current.scale.x = 1;
    }
    if (isSpeaking && leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.z = Math.sin(time * 4) * 0.3;
      rightArmRef.current.rotation.z = -Math.sin(time * 4 + 1) * 0.3;
      leftArmRef.current.position.y = Math.sin(time * 6) * 0.1;
      rightArmRef.current.position.y = Math.sin(time * 6 + 0.5) * 0.1;
    } else if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.z = 0;
      rightArmRef.current.rotation.z = 0;
      leftArmRef.current.position.y = 0;
      rightArmRef.current.position.y = 0;
    }
  });

  return (
    <group>
      <mesh ref={headRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      <mesh ref={leftEyeRef} position={[-0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh ref={mouthRef} position={[0, -0.3, 0.8]}>
        <sphereGeometry args={[0.2, 16, 8]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>
      <mesh position={[0, 0, 0.9]}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[0.8, 1, 2, 16]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>
      <group ref={leftArmRef} position={[-1.2, -1.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.15, 1.5, 8]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
        <mesh position={[0, -0.9, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[1.2, -1.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.15, 1.5, 8]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
        <mesh position={[0, -0.9, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
      </group>
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[1.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </group>
  );
}

const Avatar3D: React.FC<Avatar3DProps> = ({ isSpeaking, isLoading }) => {
  return (
    <div className="w-64 h-64 mx-auto rounded-lg overflow-hidden bg-gradient-to-b from-blue-100 to-blue-200">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, 5]} intensity={0.4} />
        <AvatarHead isSpeaking={isSpeaking} isLoading={isLoading} />
        <mesh position={[0, 0, -5]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#e3f2fd" />
        </mesh>
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
      <div className="text-center mt-2">
        <div className={`text-sm font-medium transition-colors duration-200 ${
          isSpeaking 
            ? 'text-green-600' 
            : isLoading 
            ? 'text-orange-500' 
            : 'text-gray-500'
        }`}>
          {isSpeaking ? 'Говорит...' : isLoading ? 'Думает...' : 'AI Преподаватель'}
        </div>
        {(isSpeaking || isLoading) && (
          <div className="flex justify-center space-x-1 mt-1">
            <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-current rounded-full animate-bounce animation-delay-100"></div>
            <div className="w-1 h-1 bg-current rounded-full animate-bounce animation-delay-200"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Avatar3D;
