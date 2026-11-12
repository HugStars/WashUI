<template>
    <DocPage title="组件总览" description="按用途分组的 UI 组件。布局组件单独放在“布局”分类中。">
        <section v-for="group in componentGroups" :key="group.title">
            <h2 class="doc_h2">{{ group.title }}</h2>
            <div class="doc_component_grid">
                <RouterLink v-for="item in group.items" :key="item.name" :to="item.path"
                    class="doc_component_link doc_card_link">
                    <AppCard :title="item.label" compact>
                        <template #extra>
                            <code class="doc_component_name">{{ item.component }}</code>
                        </template>
                        <p class="wa_hint">{{ item.summary }}</p>
                        <span class="doc_component_go">查看文档 →</span>
                    </AppCard>
                </RouterLink>
            </div>
        </section>
    </DocPage>
</template>

<script setup>
import { DocPage } from '../components/index.js'
import { componentGroups } from '../site.js'
</script>
