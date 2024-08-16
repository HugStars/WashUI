<template>
    <RouterView />
</template>

<script setup>

</script>


<style>
body {
    max-width: 1000px;
    margin: auto;
}

h1 {
    letter-spacing: -0.02em;
    line-height: 40px;
    font-size: 28px;
    position: relative;
    font-weight: 600;
    outline: none;
    overflow-wrap: break-word;
    margin: 0;
}

h1,
h2 {
    background-image: linear-gradient(0deg, #41cf7d 0%, #5092ff 50%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

h2 {
    margin: 30px 0 16px;
    border-top: 1px solid #e2e2e3;
    padding-top: 24px;
    letter-spacing: -0.02em;
    line-height: 32px;
    font-size: 24px;
    position: relative;
    font-weight: 600;
    outline: none;
}

p {
    line-height: 28px;
    margin: 16px 0;
}

code {
    border-radius: 4px;
    padding: 3px 6px;
    background-color: rgba(142, 150, 170, 0.14);
    transition: color 0.25s, background-color 0.5s;
    font-size: 0.875em;
    color: #2ea9df;
    font-family: ui-monospace, 'Menlo', 'Monaco', 'Consolas',
        'Liberation Mono', 'Courier New', monospace;
}

ul {
    list-style: disc;
    padding-left: 1.25rem;
    margin: 16px 0;
}

li {
    overflow-wrap: break-word;
}

li+li {
    margin-top: 8px;
}
</style>
