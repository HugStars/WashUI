<template>
    <Transition enter-active-class="wa_page_enter_active" leave-active-class="wa_page_leave_active"
        enter-from-class="wa_page_enter_from" leave-to-class="wa_page_leave_to" mode="out-in">
        <slot />
    </Transition>
</template>

<style>
.wa_page_enter_active,
.wa_page_leave_active {
    transition: opacity .22s ease, transform .22s ease;
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
