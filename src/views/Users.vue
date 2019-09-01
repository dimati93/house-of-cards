<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{error}}</div>
    <div v-if="machines">
      <machine-users v-for="machine in machines" :key="machine.id" :machine="machine"></machine-users>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import MachineUsers from '../components/MachineUsers.vue';

export default Vue.extend({
  components: {
    MachineUsers,
  },
  data() {
    return {
      loading: false,
      machines: null,
      error: null,
    };
  },
  watch: {
    $route: 'fetchData',
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.machines = null;
      this.error = null;
      this.loading = true;
      const data = this;

      fetch('/api/machines')
        .then((response) => {
          data.loading = false;
          if (!response.ok) {
            throw Error(response.statusText);
          }

          return response.json();
        })
        .then((json) => {
          data.machines = json.map((m: any) => {
            return { id: m.id, name: m.name, status: { online: '' } };
          });
        }).catch((error) => {
          data.error = error;
        });
    },
  },
});
</script>
