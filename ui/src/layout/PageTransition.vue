<template>
    <Transition enter-active-class="wa_page_enter_active" leave-active-class="wa_page_leave_active"
        enter-from-class="wa_page_enter_from" leave-to-class="wa_page_leave_to" mode="out-in">
        <slot />
    </Transition>
</template>
