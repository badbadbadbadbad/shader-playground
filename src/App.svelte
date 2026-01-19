<script lang="ts">
    import { onMount } from "svelte";
    import WebsiteController from "./controller/WebsiteController.ts";
    import githubIcon from "./assets/icon/github-mark-white.svg";
    import sunIcon from "./assets/icon/sun.svg";
    import moonIcon from "./assets/icon/moon.svg";

    let leftCanvasHost!: HTMLDivElement;
    let rightCanvasHost!: HTMLDivElement;
    let fileInput!: HTMLInputElement;

    const controller = new WebsiteController();

    let isLight = false;

    function applyTheme() {
        document.documentElement.dataset.theme = isLight ? "light" : "dark";
    }

    function toggleTheme() {
        isLight = !isLight;
        applyTheme();
    }

    onMount(() => {
        controller.init({ leftCanvasHost, rightCanvasHost, fileInput });
        applyTheme();
    });
</script>

<header id="header">
    <div id="header-icons">
        <a
                id="logo-link"
                href="https://github.com/badbadbadbadbad/shader-playground"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                title="GitHub"
        >
            <img class="header-icon" src={githubIcon} alt="GitHub" />
        </a>

        <button
                id="theme-toggle"
                type="button"
                on:click={toggleTheme}
                aria-label="Toggle light/dark mode"
                title="Toggle light/dark mode"
        >
            <img class="header-icon" src={isLight ? moonIcon : sunIcon} alt="Theme" />
        </button>
    </div>

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