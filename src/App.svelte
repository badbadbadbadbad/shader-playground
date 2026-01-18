<script lang="ts">
    import { onMount } from "svelte";
    import MainController from "./controller/MainController.ts";
    import githubIcon from "./assets/icon/github-mark-white.svg";

    let leftCanvasHost!: HTMLDivElement;
    let rightCanvasHost!: HTMLDivElement;
    let fileInput!: HTMLInputElement;

    const controller = new MainController();

    onMount(() => {
        controller.init({ leftCanvasHost, rightCanvasHost, fileInput });
    });
</script>

<header id="header">
    <a
            id="logo-link"
            href="https://github.com/badbadbadbadbad/shader-playground"
            target="_blank"
            rel="noreferrer"
    >
        <img id="logo-img" src={githubIcon} alt="GitHub" />
    </a>
    <div id="header-text">shader-playground</div>
</header>

<div id="scenes">
    <div class="half" id="left-half">
        <div id="left-canvas" bind:this={leftCanvasHost}>
            <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    style="display: none"
                    bind:this={fileInput}
            />
        </div>
    </div>

    <div class="half" id="right-half">
        <div id="right-canvas" bind:this={rightCanvasHost}></div>
    </div>
</div>