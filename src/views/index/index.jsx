import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { useEffect } from 'react';
function IndexPage() {
  let scene = null;
  let renderer = null;
  let camera = null;
  let controls = null;
  const createSence = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfe3dd);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, -5);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    // controls.target.set(1, 0, 0); // 围绕中心轴旋转
    controls.enableDamping = true;
    renderer.render(scene, camera);
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  };

  const loadGlb = (path) => {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/examples/js/libs/draco/');
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      path,
      (gltf) => {
        scene.add(gltf.scene);
        animate();
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
    );
  };
  /**
   * 选择glb模型
   * @param { Event } e
   */
  const onChangeFile = (e) => {
    const glb = window.URL.createObjectURL(e.target.files[0]);
    loadGlb(glb);
  };
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  useEffect(() => {
    setTimeout(() => {
      createSence();
    }, 1000);
  });

  return (
    <div>
      <input type="file" name="file" id="file" onChange={onChangeFile.bind(this)} />
    </div>
  );
}

export default IndexPage;
