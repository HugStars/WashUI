<template>
    <DocPage title="组件总览" description="按用途分组的 UI 组件。布局组件单独放在“布局”分类中。">
        <section v-for="group in componentGroups" :key="group.title" class="doc_entry_group">
            <h2 class="doc_h2">{{ group.title }}</h2>
            <div class="doc_entry_grid">
                <DocEntryCard v-for="item in group.items" :key="item.name" :title="item.label"
                    :name="item.component" :summary="item.summary" :path="item.path" />
            </div>
        </section>
    </DocPage>
</template>

<script setup>
import { DocEntryCard, DocPage } from '../components/index.js'
import { componentGroups } from '../site.js'
</script>
