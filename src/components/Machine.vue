<template>
  <v-card :elevation="6">
    <v-card-title>
      <machine-header :status="online" :machine="machine"></machine-header>
    </v-card-title>
    <gpu-status v-if="nvidiaStats" :nvidia-stats="nvidiaStats"></gpu-status>
    <v-overlay absolute :value="error">
      <v-card flat>{{error}}</v-card>
    </v-overlay>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import MachineHeader from './MachineHeader.vue';
import GpuStatus from './GpuStatus.vue';

export default Vue.extend({
  components: {
    MachineHeader,
    GpuStatus,
  },
  props: {
    machine: Object,
  },
  data() {
    return {
      timer: 0,
      retries: 0,
      online: '',
      nvidiaStats: null,
      error: '',
    };
  },
  created() {
    this.fetchUpdate();
  },
  methods: {
    fetchUpdate() {
      const data = this;

      fetch('api/machines/' + this.machine.id + '/gpu')
        .then((response) => {
          if (!response.ok) { throw response; }

          return response.json();
        })
        .then((json) => {
          if (
            data.online === 'online' &&
            json.online === 'offline' &&
            data.retries < 3
          ) {
            data.retries++;
            return;
          }

          data.online = json.online;
          data.nvidiaStats = json.nvidiaStats;
          data.retries = 0;
          data.error = '';
        })
        .catch((error) => {
          data.retries++;
          if (data.retries < 3) { return; }

          if (typeof error.text === 'function') {
            error.text().then((errorMessage: string) => {
              data.error = errorMessage;
            });
          } else {
            data.error = error.replace(/^TypeError\: /, '');
          }
        })
        .then(() => {
          setTimeout(() => data.fetchUpdate(), 5000);
        });
    },
  },
});
</script>