import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { useState } from 'react';
import './scss/index.scss';
function IndexPage() {
  let [scene, renderer, camera, controls] = [null, null, null, null];

  const [processBar, setProcessBar] = useState({
    width: 0,
    isShow: false,
  });
  const [controlsObject, setControls] = useState(null);
  const createSence = () => {
    if (document.getElementsByTagName('canvas')[0]) {
      document.body.removeChild(document.getElementsByTagName('canvas')[0]);
    }

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfe3dd);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 1000);
    camera.position.set(0, 0, -10);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    setControls(controls);
    renderer.render(scene, camera);
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  };

  const loadGlb = (path) => {
    setProcessBar({
      isShow: true,
    });
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/examples/js/libs/draco/');
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      path,
      (gltf) => {
        console.log(gltf);

        scene.add(gltf.scene);
        animate();
      },
      (xhr) => {
        let width = (xhr.loaded / xhr.total) * 100;
        setProcessBar({
          width,
          isShow: true,
        });
        if (width >= 100) {
          setTimeout(() => {
            setProcessBar({
              width,
              isShow: false,
            });
          }, 600);
        }
      },
    );
  };
  /**
   * 选择glb模型
   * @param { Event } e
   */
  const onChangeFile = (e) => {
    createSence();
    const glb = window.URL.createObjectURL(e.target.files[0]);
    loadGlb(glb);
  };
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  const onRePosition = () => {
    if (controlsObject) {
      controlsObject.reset();
    }
  };

  return (
    <div>
      {processBar.isShow ? (
        <div className="process">
          <span className="bar" style={{ width: processBar.width + '%' }}></span>
        </div>
      ) : null}
      <div className="opeartion">
        <label className="btn open" htmlFor="file">
          打开模型
        </label>
        <input
          type="file"
          hidden
          name="file"
          id="file"
          accept=".glb,.gltf"
          onChange={onChangeFile.bind(this)}
        />
        <div className="btn position" onClick={onRePosition}>复位</div>
      </div>
    </div>
  );
}
export default IndexPage;
