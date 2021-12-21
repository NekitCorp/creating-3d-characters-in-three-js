import { gsap } from "gsap";
import * as THREE from "three";
import { Scene } from "./scene";
import { degreesToRadians, random } from "./utils";

type IFigureParams = {
    x: number;
    y: number;
    z: number;
    ry: number;
    angle: number;
    armRotation: number;
};

export class Figure {
    public params: IFigureParams;

    private group = new THREE.Group();
    private head = new THREE.Group();
    private body = new THREE.Group();
    private arms: THREE.Group[] = [];

    private headHue: number;
    private bodyHue: number;
    private headLightness: number;
    private headMaterial: THREE.MeshLambertMaterial;
    private bodyMaterial: THREE.MeshLambertMaterial;

    constructor(params: Partial<IFigureParams>, private scene: Scene) {
        this.params = {
            x: 0,
            y: 0,
            z: 0,
            ry: 0,
            angle: 0,
            armRotation: 0,
            ...params,
        };

        // Add group to scene
        scene.addGroupToScene(this.group);

        // Position according to params
        this.group.position.x = this.params.x;
        this.group.position.y = this.params.y;
        this.group.position.z = this.params.z;

        // Material
        this.headHue = random(0, 360);
        this.bodyHue = random(0, 360);
        this.headLightness = random(40, 65);
        this.headMaterial = new THREE.MeshLambertMaterial({
            color: `hsl(${this.headHue}, 30%, ${this.headLightness}%)`,
        });
        this.bodyMaterial = new THREE.MeshLambertMaterial({
            color: `hsl(${this.bodyHue}, 85%, 50%)`,
        });

        this.arms = [];
    }

    public init() {
        this.createBody();
        this.createHead();
        this.createArms();

        this.startAnimation();
    }

    private startAnimation() {
        gsap.set(this.params, {
            y: -1.5,
        });

        gsap.to(this.params, {
            ry: degreesToRadians(360),
            repeat: -1,
            duration: 20,
        });

        gsap.to(this.params, {
            y: 0,
            armRotation: degreesToRadians(90),
            repeat: -1,
            yoyo: true,
            duration: 0.5,
        });

        gsap.ticker.add(() => {
            this.bounce();
            this.scene.render();
        });
    }

    private bounce() {
        this.group.rotation.y = this.params.ry;
        this.group.position.y = this.params.y;
        this.arms.forEach((arm, index) => {
            const m = index % 2 === 0 ? 1 : -1;
            arm.rotation.z = this.params.armRotation * m;
        });
    }

    private createBody() {
        this.body = new THREE.Group();
        const geometry = new THREE.BoxGeometry(1, 1.5, 1);
        const bodyMain = new THREE.Mesh(geometry, this.bodyMaterial);

        this.body.add(bodyMain);
        this.group.add(this.body);

        this.createLegs();
    }

    private createHead() {
        // Create a new group for the head
        this.head = new THREE.Group();

        // Create the main cube of the head and add to the group
        const geometry = new THREE.BoxGeometry(1.4, 1.4, 1.4);
        const headMain = new THREE.Mesh(geometry, this.headMaterial);
        this.head.add(headMain);

        // Add the head group to the figure
        this.group.add(this.head);

        // Position the head group
        this.head.position.y = 1.65;

        // Add the eyes
        this.createEyes();
    }

    private createArms() {
        const height = 0.85;

        for (let i = 0; i < 2; i++) {
            const armGroup = new THREE.Group();
            const geometry = new THREE.BoxGeometry(0.25, height, 0.25);
            const arm = new THREE.Mesh(geometry, this.headMaterial);
            const m = i % 2 === 0 ? 1 : -1;

            // Add arm to group
            armGroup.add(arm);

            // Add group to figure
            this.body.add(armGroup);

            // Translate the arm by half the height
            arm.position.y = height * -0.5;

            // Position the arm relative to the figure
            armGroup.position.x = m * 0.8;
            armGroup.position.y = 0.6;

            // Rotate the arm
            armGroup.rotation.z = degreesToRadians(30 * m);

            // Push to the array
            this.arms.push(armGroup);
        }
    }

    private createEyes() {
        const eyes = new THREE.Group();
        const geometry = new THREE.SphereGeometry(0.15, 12, 8);
        const material = new THREE.MeshLambertMaterial({ color: 0x44445c });

        for (let i = 0; i < 2; i++) {
            const eye = new THREE.Mesh(geometry, material);
            const m = i % 2 === 0 ? 1 : -1;

            eyes.add(eye);
            eye.position.x = 0.36 * m;
        }

        this.head.add(eyes);

        eyes.position.y = -0.1;
        eyes.position.z = 0.7;
    }

    private createLegs() {
        const legs = new THREE.Group();
        const geometry = new THREE.BoxGeometry(0.25, 0.4, 0.25);

        for (let i = 0; i < 2; i++) {
            const leg = new THREE.Mesh(geometry, this.headMaterial);
            const m = i % 2 === 0 ? 1 : -1;

            legs.add(leg);
            leg.position.x = m * 0.22;
        }

        this.group.add(legs);
        legs.position.y = -1.15;

        this.body.add(legs);
    }
}
