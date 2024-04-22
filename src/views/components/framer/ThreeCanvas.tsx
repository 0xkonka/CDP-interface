import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene, Camera, and Renderer setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080b0b'); // Set a non-black background
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(600, 400);
    mountRef.current.appendChild(renderer.domElement);

    // Loader for our .glb asset
    const loader = new GLTFLoader();

    let object3D: THREE.Object3D;

    loader.load('/framers/model.glb', (gltf) => {
      object3D = gltf.scene;
      const scale = 0.5;
      object3D.scale.set(scale, scale, scale);
      scene.add(object3D);
    }, undefined, (error) => {
      console.error('An error happened:', error);
    });

    camera.position.z = 5;

    // Lights (optional, but usually necessary)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Animation Loop
    const animate = function () {
      requestAnimationFrame(animate);
      if(object3D){
        object3D.rotation.x += 0.01; // Rotate the temporary cube
        object3D.rotation.y += 0.01;
      }
      
      renderer.render(scene, camera);
    };

    // Start Animation Loop
    animate();

    
    // Mouse event listener
    const onMouseMove = (event: MouseEvent) => {
        // Implement mouse move rotation logic here
        // Using object3D.rotation
    };
  
    window.addEventListener('mousemove', onMouseMove, false);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-end' }} />;
};

export default ThreeCanvas;
