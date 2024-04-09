<template>
  <!-- Filters -->
  <div class="flex items-center justify-between gap-3 px-4 py-3">
    <UInput
      v-model="search"
      icon="i-heroicons-magnifying-glass-20-solid"
      placeholder="Search..."
    />

    <USelectMenu
      v-model="selectedStatus"
      :options="statusEnumeration"
      multiple
      placeholder="Current Status"
      class="w-40"
    />
  </div>

  <!-- Table -->
  <UTable :rows="filteredRows" :columns="columns">
    <template #url-data="{ row }">
      <ULink
        :to="row.url"
        active-class="text-primary"
        inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
      >
        {{ row.url }}
      </ULink>
    </template>

    <template #active-data="{ row }">
      <UBadge v-if="row.active" color="primary">Active</UBadge>
      <UBadge v-else color="red">Inactive</UBadge>
    </template>

    <template #duration-data="{ row }">
      {{ formattedDuration(row.duration) }}
    </template>

    <template #progress-data="{ row }">
      <UProgress :value="row.duration" :max="5760" />
    </template>

    <template #score-data="{ row }">
      {{ Math.min(row.duration / 24 / 60, 4).toFixed(2) }}
    </template>
  </UTable>
</template>

<script setup>
import { ref } from "vue";

// Table
const { data } = await useFetch("/api/get-status");
const rows = JSON.parse(data.value);

const columns = ref([
  {
    key: "sid",
    label: "Student ID",
  },
  {
    key: "url",
    label: "Shop URL",
  },
  {
    key: "active",
    label: "Current Status",
  },
  {
    key: "duration",
    label: "Active Duration",
  },
  {
    key: "progress",
    label: "Progress",
  },
  {
    key: "score",
    label: "Score",
  },
]);

const formattedDuration = (totalMinutes) => {
  let days = Math.floor(totalMinutes / 24 / 60);
  let hours = Math.floor((totalMinutes - days * 24 * 60) / 60);
  let minutes = totalMinutes - days * 24 * 60 - hours * 60;
  return `${days} days ${hours} hours ${minutes} minutes`;
};

// Filters
const statusEnumeration = [
  {
    key: "active",
    label: "Active",
    value: true,
  },
  {
    key: "inactive",
    label: "Inactive",
    value: false,
  },
];

const search = ref("");
const selectedStatus = ref([]);

const filteredRows = computed(() => {
  let selectedRows;
  if (selectedStatus.value?.length == 0 || selectedStatus.value?.length == 2) {
    selectedRows = rows;
  } else if (selectedStatus.value[0].value) {
    selectedRows = rows.filter((row) => row.active);
  } else {
    selectedRows = rows.filter((row) => !row.active);
  }

  let searchedRows = selectedRows.filter((row) =>
    JSON.stringify([row.sid, row.url]).includes(search.value)
  );

  return searchedRows;
});
</script>
