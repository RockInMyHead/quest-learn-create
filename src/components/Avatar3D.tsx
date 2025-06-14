
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface Avatar3DProps {
  isSpeaking: boolean;
  isLoading: boolean;
}

function HeadShape({ headRef }: { headRef: React.RefObject<THREE.Mesh> }) {
  // Немного более вытянутая и сглаженная голова
  return (
    <mesh ref={headRef} position={[0, 0.2, 0]}>
      <sphereGeometry args={[1, 36, 28]} />
      <meshStandardMaterial
        color="#ffe0b2"
        roughness={0.14}
        metalness={0.08}
      />
    </mesh>
  );
}

function Hair() {
  // Центральная прядь и пара боковых для стильности
  return (
    <group position={[0, 1, 0]}>
      <mesh position={[0, 0.15, 0.76]} rotation={[Math.PI / 2.4, 0, 0]}>
        <sphereGeometry args={[0.58, 16, 8, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
        <meshStandardMaterial color="#3a2921" roughness={0.2} metalness={0.4} />
      </mesh>
      <mesh position={[-0.53, 0.08, 0.7]} rotation={[Math.PI / 2.3, 0, 0.25]}>
        <sphereGeometry args={[0.23, 16, 8]} />
        <meshStandardMaterial color="#3a2921" roughness={0.22} />
      </mesh>
      <mesh position={[0.53, 0.08, 0.7]} rotation={[Math.PI / 2.3, 0, -0.25]}>
        <sphereGeometry args={[0.23, 16, 8]} />
        <meshStandardMaterial color="#3a2921" roughness={0.22} />
      </mesh>
    </group>
  );
}

function Eyes({
  leftEyeRef, rightEyeRef,
}: {
  leftEyeRef: React.RefObject<THREE.Mesh>;
  rightEyeRef: React.RefObject<THREE.Mesh>;
}) {
  // Глаза с бликами и ресницами для профессионального вида
  return (
    <>
      {/* Глаза */}
      <mesh ref={leftEyeRef} position={[-0.31, 0.33, 0.82]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#231f20" roughness={0.1} />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.31, 0.33, 0.82]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#231f20" roughness={0.1} />
      </mesh>
      {/* Блики */}
      <mesh position={[-0.27, 0.40, 1.02]}>
        <sphereGeometry args={[0.038, 8, 8]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.3}/>
      </mesh>
      <mesh position={[0.35, 0.40, 1.02]}>
        <sphereGeometry args={[0.031, 8, 8]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.25}/>
      </mesh>
      {/* Ресницы (дуги) */}
      <mesh position={[-0.31, 0.44, 0.83]} rotation={[0, 0, Math.PI / 5]}>
        <torusGeometry args={[0.14, 0.015, 6, 12, Math.PI / 1.1]} />
        <meshStandardMaterial color="#36281b" />
      </mesh>
      <mesh position={[0.31, 0.44, 0.83]} rotation={[0, 0, -Math.PI / 5]}>
        <torusGeometry args={[0.14, 0.015, 6, 12, Math.PI / 1.1]} />
        <meshStandardMaterial color="#36281b" />
      </mesh>
    </>
  );
}

function Mouth({ mouthRef, isSpeaking }: {
  mouthRef: React.RefObject<THREE.Mesh>;
  isSpeaking: boolean;
}) {
  // Мягкая анимация рта + ободок-улыбка
  return (
    <>
      <mesh ref={mouthRef} position={[0, -0.28, 0.86]}>
        <sphereGeometry args={[0.18, 12, 10, 0, Math.PI]} />
        <meshStandardMaterial color="#e57373" roughness={0.3} metalness={0.15} />
      </mesh>
      <mesh position={[0, -0.32, 0.89]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.14, 0.016, 8, 20, Math.PI * 1.15]} />
        <meshStandardMaterial color="#ad3232" />
      </mesh>
    </>
  );
}

function Nose() {
  // Более аккуратный нос
  return (
    <mesh position={[0, 0.12, 0.98]} rotation={[0.45, 0, 0]}>
      <coneGeometry args={[0.055, 0.18, 18]} />
      <meshStandardMaterial color="#f3c393" />
    </mesh>
  );
}

function ProfessionalBowtie() {
  // Галстук-бабочка или стильный галстук
  return (
    <group position={[0, -1.22, 0.01]}>
      <mesh position={[-0.12, 0, 0]}>
        <boxGeometry args={[0.13, 0.19, 0.02]} />
        <meshStandardMaterial color="#6ad5e5" metalness={0.25} roughness={0.3}/>
      </mesh>
      <mesh position={[0.12, 0, 0]}>
        <boxGeometry args={[0.13, 0.19, 0.02]} />
        <meshStandardMaterial color="#6ad5e5" metalness={0.25} roughness={0.3}/>
      </mesh>
      <mesh>
        <boxGeometry args={[0.09, 0.13, 0.03]} />
        <meshStandardMaterial color="#124a77" metalness={0.4} roughness={0.2}/>
      </mesh>
    </group>
  );
}

function Body() {
  // Плавное тело + светлый воротник
  return (
    <group>
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[0.8, 1, 2, 28]} />
        <meshStandardMaterial color="#3387c2" metalness={0.25} roughness={0.25}/>
      </mesh>
      <mesh position={[0, -1.04, 0.21]} >
        <cylinderGeometry args={[0.32, 0.38, 0.23, 24]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
    </group>
  );
}

function Arms({
  isSpeaking,
  leftArmRef,
  rightArmRef,
}: {
  isSpeaking: boolean;
  leftArmRef: React.RefObject<THREE.Group>;
  rightArmRef: React.RefObject<THREE.Group>;
}) {
  return (
    <>
      {/* Левая рука */}
      <group ref={leftArmRef} position={[-1.14, -1.55, 0]}>
        <mesh>
          <cylinderGeometry args={[0.14, 0.13, 1.23, 12]} />
          <meshStandardMaterial color="#ffe0b2" />
        </mesh>
        {/* Кисть */}
        <mesh position={[0, -0.75, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#ffe0b2" />
        </mesh>
      </group>
      {/* Правая рука */}
      <group ref={rightArmRef} position={[1.14, -1.55, 0]}>
        <mesh>
          <cylinderGeometry args={[0.14, 0.13, 1.23, 12]} />
          <meshStandardMaterial color="#ffe0b2" />
        </mesh>
        {/* Кисть */}
        <mesh position={[0, -0.75, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#ffe0b2" />
        </mesh>
      </group>
    </>
  );
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
      headRef.current.scale.y = 1 + Math.sin(time * 2) * 0.014;
      if (isLoading) {
        headRef.current.rotation.z = Math.sin(time * 3) * 0.08;
      } else {
        headRef.current.rotation.z = 0;
      }
    }
    if (leftEyeRef.current && rightEyeRef.current) {
      const blinkCycle = Math.abs(Math.sin(time * 0.65)) > 0.97 ? 0.28 : 1;
      leftEyeRef.current.scale.y = blinkCycle;
      rightEyeRef.current.scale.y = blinkCycle;
    }
    if (isSpeaking && mouthRef.current) {
      const speakCycle = Math.abs(Math.sin(time * 15)) * 0.26 + 0.73;
      mouthRef.current.scale.y = speakCycle;
      mouthRef.current.scale.x = 1.11 - speakCycle * 0.13;
    } else if (mouthRef.current) {
      mouthRef.current.scale.y = 1;
      mouthRef.current.scale.x = 1;
    }
    if (isSpeaking && leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.z = Math.sin(time * 3.8) * 0.25;
      rightArmRef.current.rotation.z = -Math.sin(time * 3.8 + 1) * 0.25;
      leftArmRef.current.position.y = Math.sin(time * 5.5) * 0.10;
      rightArmRef.current.position.y = Math.sin(time * 5.5 + 0.65) * 0.09;
    } else if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.z = 0;
      rightArmRef.current.rotation.z = 0;
      leftArmRef.current.position.y = 0;
      rightArmRef.current.position.y = 0;
    }
  });

  return (
    <group>
      <HeadShape headRef={headRef} />
      <Hair />
      <Eyes leftEyeRef={leftEyeRef} rightEyeRef={rightEyeRef} />
      <Nose />
      <Mouth mouthRef={mouthRef} isSpeaking={isSpeaking} />
      <Body />
      <ProfessionalBowtie />
      <Arms isSpeaking={isSpeaking} leftArmRef={leftArmRef} rightArmRef={rightArmRef} />
    </group>
  );
}

const Avatar3D: React.FC<Avatar3DProps> = ({ isSpeaking, isLoading }) => {
  return (
    <div className="w-64 h-64 mx-auto rounded-xl overflow-hidden shadow-lg bg-gradient-to-b from-[#b0e0ff] via-[#e3f4fb] to-[#f8fafc] ring-2 ring-blue-200/80 transition-all duration-200">
      <Canvas camera={{ position: [0, 0.15, 6], fov: 53 }}>
        <ambientLight intensity={0.57} />
        <directionalLight position={[3, 5, 7]} intensity={0.74} />
        <pointLight position={[-5, -3, 5]} intensity={0.5} />
        <AvatarHead isSpeaking={isSpeaking} isLoading={isLoading} />
        {/* Мягкая тень под аватаром */}
        <mesh position={[0, -2.91, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.65, 32]} />
          <meshStandardMaterial color="#b9eafa" transparent opacity={0.24}/>
        </mesh>
        {/* Светлый фон */}
        <mesh position={[0, 0, -3]}>
          <planeGeometry args={[13, 13]} />
          <meshStandardMaterial color="#eafbfd" />
        </mesh>
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
      <div className="text-center mt-2">
        <div className={`text-sm font-semibold transition-colors duration-200 ${
          isSpeaking 
            ? 'text-blue-700' 
            : isLoading 
            ? 'text-orange-500' 
            : 'text-gray-500'
        }`}>
          {isSpeaking ? 'Говорит...' : isLoading ? 'Думает...' : 'AI Преподаватель'}
        </div>
        {(isSpeaking || isLoading) && (
          <div className="flex justify-center space-x-1 mt-1">
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce animation-delay-100"></div>
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce animation-delay-200"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Avatar3D;
