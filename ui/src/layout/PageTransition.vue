<template>
    <Transition enter-active-class="wa_page_enter_active" leave-active-class="wa_page_leave_active"
        enter-from-class="wa_page_enter_from" leave-to-class="wa_page_leave_to" mode="out-in">
        <slot />
    </Transition>
</template>

<style>
.wa_page_enter_active,
.wa_page_leave_active {
    transition:
        opacity var(--wa_duration_base) var(--wa_ease_out),
        transform var(--wa_duration_base) var(--wa_ease_out);
}

.wa_page_enter_from {
    opacity: 0;
    transform: translateY(8px);
}

.wa_page_leave_to {
    opacity: 0;
    transform: translateY(-8px);
}

@media (prefers-reduced-motion: reduce) {

    .wa_page_enter_active,
    .wa_page_leave_active {
        transition: none;
    }
}
</style>
