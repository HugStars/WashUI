---
layout: page
---

<VPTeamPage>
    <VPTeamPageTitle>
        <template #title>
            关于
        </template>
        <template #lead>
            基于 Vite 和 Vue3 的 前端自定义 UI 框架
        </template>
    </VPTeamPageTitle>
    <VPTeamMembers :members="members" />
</VPTeamPage>
  
<script setup>
import { VPTeamPage, VPTeamPageTitle, VPTeamMembers } from 'vitepress/theme'

const members = [ { avatar: "./assets/avatar.png", name: 'HugStars', title: 'Creator', links: [ { icon: 'github', link: 'https://github.com/HugStars' }, ] } ]
</script>
