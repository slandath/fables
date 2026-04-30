<script setup lang="ts">
const toast = useToast();

const providers = [
  {
    label: "GitHub",
    icon: "i-simple-icons-github",
    onClick: () => {
      toast.add({ title: "GitHub", description: "Login with GitHub" });
    },
  },
];

function onSubmit(payload: unknown) {
  console.log("Submitted", payload);
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        title="Login"
        description="Login using your GitHub account"
        icon="i-lucide-user"
        :providers="providers"
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
</template>
