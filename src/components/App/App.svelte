<script>
	import { onMount } from 'svelte';
	import Header from '../Header';
	import { isOffline } from '../../shared/store';
	import {
		Canvas,
		Scene,
		PerspectiveCamera,
		DirectionalLight,
		PCFSoftShadowMap,
		AmbientLight,
		BoxBufferGeometry,
		PlaneBufferGeometry,
		Mesh,
		MeshStandardMaterial,
		WebGLRenderer,
		OrbitControls,
		DoubleSide,
		MathUtils,
	} from "svelthree";
	import Moveable from "svelte-moveable";

	let frames = [];

	let cubeGeometry = new BoxBufferGeometry(1, 1, 1);
	let cubeMaterial = new MeshStandardMaterial();

	let floorGeometry = new PlaneBufferGeometry(4, 4, 1);
	let floorMaterial = new MeshStandardMaterial();

	onMount(() => {
		let targets = [].slice.call(document.getElementsByTagName('Canvas'));

		for(let i = 0; i < targets.length; i++) {
			frames.push({
				target: targets[i],
				translate: [0,0],
				size: document.getElementsByClassName('editor')[0].getBoundingClientRect()
			})
		}

		console.log({ frames })
	})

	window.addEventListener('online', () => isOffline.set(false));
	window.addEventListener('offline', () => isOffline.set(true));

	$: console.log(frames);
</script>

<style src="./App.scss"></style>

<Header />
{#if $isOffline}
	<div class="offline-banner">
		<p>You'r are offline.</p>
	</div>
{/if}

<div class="editor">
	<Canvas class="target" let:sti w={500} h={500}>
		<Scene {sti} let:scene id="scene1" props={{ background: 0xedf2f7 }}>
			<PerspectiveCamera {scene} id="cam1" pos={[0, 0, 3]} lookAt={[0, 0, 0]} />
			<AmbientLight {scene} intensity={1.25} />
			<DirectionalLight 
				{scene}
				pos={[1, 2, 1]}
				intensity={0.8}
				shadowMapSize={512 * 8}
				castShadow
			/>

			<Mesh
			{scene}
			geometry={cubeGeometry}
			material={cubeMaterial}
			mat={{ roughness: 0.5, metalness: 0.5, color: 0xff3e00 }}
			pos={[0, 0, 0]}
			rot={[0, 0, 0]}
			castShadow
			receiveShadow />

			<Mesh
				{scene}
				geometry={floorGeometry}
				material={floorMaterial}
				mat={{ roughness: 0.5, metalness: 0.5, side: DoubleSide, color: 0xf7fafc }}
				pos={[0, -0.501, 0]}
				rot={[MathUtils.degToRad(-90), 0, 0]}
				scale={[1, 1, 1]}
				receiveShadow />

			<OrbitControls {scene} enableDamping />

		</Scene>

		<WebGLRenderer
			{sti}
			sceneId="scene1"
			camId="cam1"
			config={{ antialias: true, alpha: true }}
			enableShadowMap
			shadowMapType={PCFSoftShadowMap} />

	</Canvas>
	<Canvas class="target" let:sti w={500} h={500}>
		<Scene {sti} let:scene id="scene2" props={{ background: 0xedf2f7 }}>
			<PerspectiveCamera {scene} id="cam2" pos={[0, 0, 3]} lookAt={[0, 0, 0]} />
			<AmbientLight {scene} intensity={1.25} />
			<DirectionalLight 
				{scene}
				pos={[1, 2, 1]}
				intensity={0.8}
				shadowMapSize={512 * 8}
				castShadow
			/>

			<Mesh
				{scene}
				geometry={cubeGeometry}
				material={cubeMaterial}
				mat={{ roughness: 0.5, metalness: 0.5, color: 0xff3e00 }}
				pos={[0, 0, 0]}
				rot={[0, 0, 0]}
				castShadow
				receiveShadow 
			/>

			<Mesh
				{scene}
				geometry={floorGeometry}
				material={floorMaterial}
				mat={{ roughness: 0.5, metalness: 0.5, side: DoubleSide, color: 0xf7fafc }}
				pos={[0, -0.501, 0]}
				rot={[MathUtils.degToRad(-90), 0, 0]}
				scale={[1, 1, 1]}
				receiveShadow 
			/>

			<OrbitControls {scene} enableDamping />

		</Scene>

		<WebGLRenderer
			{sti}
			sceneId="scene2"
			camId="cam2"
			config={{ antialias: true, alpha: true }}
			enableShadowMap
			shadowMapType={PCFSoftShadowMap} />

	</Canvas>
</div>

{#each frames as frame}
	<Moveable
		target={frame.target}
		resizable={true}
		snappable={true}
		keepRatio={false}
		throttleResize={0}
		renderDirections={["nw","n","ne","w","e","sw","s","se"]}
		bounds={{
			top: 0,
			left: 0,
			rigth: window.innerWidth,
			bottom: window.innerHeight
		}}
		edge={false}
		zoom={1}
		origin={true}
		padding={{"left":0,"top":0,"right":0,"bottom":0}}
		on:resizeStart={({ detail: { setOrigin, dragStart } }) => {
        setOrigin(["%", "%"]);
        dragStart && dragStart.set(frame.translate);
    }}
    on:resize={({ detail: { target, width, height, drag } }) => {
				const beforeTranslate = drag.beforeTranslate;
				target.style.width = `${width}px`;
				target.style.height = `${height}px`;
				target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
    }}
    on:resizeEnd={({ detail: { lastEvent } }) => {
        if (lastEvent) {
            frame.translate = lastEvent.drag.beforeTranslate;
        }
    }}
	/>
{/each}
