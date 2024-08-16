<template>
    <VPTeamPage>
        <VPTeamPageTitle>
            <template #title>
                关于
            </template>
            <template #lead>
                The development of VitePress is guided by an international
                team, some of whom have chosen to be featured below.
            </template>
        </VPTeamPageTitle>
        <VPTeamMembers :members="members" />
    </VPTeamPage>
</template>
  
<script setup>
import { VPTeamPage, VPTeamPageTitle, VPTeamMembers } from 'vitepress/theme'

const members = [
    {
        avatar: 'https://www.github.com/yyx990803.png',
        name: 'HugStars',
        title: 'Creator',
        links: [
            { icon: 'github', link: 'https://github.com/HugStars' },
            { icon: 'mail', link: 'https://github.com/HugStars' },
        ]
    },
]
</script>