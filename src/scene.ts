import * as THREE from "three";

export class Scene {
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;

    constructor(canvas: HTMLCanvasElement, private sizes: { width: number; height: number }) {
        console.log(sizes);

        // renderer
        this.renderer = new THREE.WebGLRenderer({ canvas });

        // Create the scene
        this.scene = new THREE.Scene();

        // Create the camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.sizes.width / this.sizes.height,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        this.scene.add(this.camera);

        // Update on window resize
        window.addEventListener("resize", () => {
            // Update sizes
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;

            // Update camera
            this.camera.aspect = sizes.width / sizes.height;
            this.camera.updateProjectionMatrix();
        });

        // Lighting
        const lightAmbient = new THREE.AmbientLight(0x9eaeff, 0.5);
        this.scene.add(lightAmbient);

        const lightDirectional = new THREE.DirectionalLight(0xffffff, 0.8);
        this.scene.add(lightDirectional);

        // Move the light source towards us
        lightDirectional.position.set(5, 5, 5);
    }

    public render() {
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.render(this.scene, this.camera);
    }

    public addGroupToScene(group: THREE.Group) {
        this.scene.add(group);
    }
}
