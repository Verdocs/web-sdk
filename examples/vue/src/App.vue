<script setup lang="ts">
import { VerdocsSign } from "@verdocs/web-sdk-vue";

// Replace these with your actual values for testing
const ENVELOPE_ID = "<ENVELOPE_ID>";
const ROLE_ID = "<ROLE_ID>";
const INVITE_CODE = "<INVITE_CODE>";

function onEnvelopeUpdated(event: CustomEvent) {
    console.log("Envelope updated state:", event.detail);
}

function onSdkError(event: CustomEvent) {
    console.log("SDK error", event.detail);
}
</script>

<template>
    <VerdocsSign
        :envelope-id="ENVELOPE_ID"
        :role-id="ROLE_ID"
        :invite-code="INVITE_CODE"
        @envelope-updated="onEnvelopeUpdated"
        @sdk-error="onSdkError"
    />
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
