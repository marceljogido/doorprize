import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const TROPHY_COUNT = 20;
const TROPHY_SIZE = 0.3;
const FALL_SPEED = 0.03;

const TrophyRain: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const trophiesRef = useRef<THREE.Sprite[]>([]);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 7; // dari 5 menjadi 7 atau lebih
    sceneRef.current = scene;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    rendererRef.current = renderer;
    const mount = mountRef.current; // simpan ke variabel lokal
    if (mount) {
      mount.appendChild(renderer.domElement);
    }

    // Load trophy texture
    const loader = new THREE.TextureLoader();
    loader.load('/piala.svg', (texture: THREE.Texture) => {
      const trophies: THREE.Sprite[] = [];
      for (let i = 0; i < TROPHY_COUNT; i++) {
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(TROPHY_SIZE, TROPHY_SIZE, 1);
        sprite.position.x = (Math.random() - 0.5) * 8;
        sprite.position.y = Math.random() * 6 + 2;
        sprite.position.z = (Math.random() - 0.5) * 2;
        scene.add(sprite);
        trophies.push(sprite);
      }
      trophiesRef.current = trophies;
      animate();
    });

    function animate() {
      animationRef.current = requestAnimationFrame(animate);
      // Update positions
      trophiesRef.current.forEach((sprite) => {
        sprite.position.y -= FALL_SPEED;
        if (sprite.position.y < -3.5) {
          sprite.position.y = Math.random() * 6 + 2;
          sprite.position.x = (Math.random() - 0.5) * (window.innerWidth / window.innerHeight) * 10;
        }
      });
      renderer.render(scene, camera);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (mount && rendererRef.current.domElement) mount.removeChild(rendererRef.current.domElement);
      }
      // Clean up sprites
      trophiesRef.current = [];
    };
  }, []);

  return (
    <div ref={mountRef} style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none' }} />
  );
};

export default TrophyRain; 