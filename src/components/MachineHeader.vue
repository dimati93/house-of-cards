<template>
  <div class="machine-header">    
    <v-icon v-if="status === 'online'" color="green" title="Online">mdi-server-network</v-icon>
    <v-icon v-else-if="status === 'offline'" color="red" title="Offline">mdi-server-network-off</v-icon>
    <v-progress-circular v-else indeterminate color="primary" :size="20" width="2"></v-progress-circular>
    <span> {{ machine.name }} </span>
    <v-btn rounded color="primary" class="float-right" title="Wake"
      v-if="status === 'offline'" 
      v-on:click="sendWakeCall" 
      :disabled="wakeTimeout > 0">
      <template v-if="wakeTimeout > 0">
        <v-progress-circular  :value="wakeTimeout" :size="20" width="2"></v-progress-circular>
        <span> wating for wake up</span>
      </template>      
      <v-icon v-else>mdi-power-standby</v-icon>
    </v-btn>
  </div>
</template>

<style scoped>
.machine-header {
  flex-grow: 1;
}

.machine-header i.v-icon{
  vertical-align: initial;
}
</style>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    props: {
        machine: Object,
        status: String,
    },
    data() {
        return {
          wakeTimeout: 0,
        };
    },
    methods: {
      sendWakeCall() {
        const data = this;
        data.wakeTimeout = 100;

        const desc = () => {
          data.wakeTimeout -= 1;
          if (data.wakeTimeout > 0) {
            setTimeout(desc, 1000);
          } else {
            data.wakeTimeout = 0;
          }
        };

        setTimeout(desc, 1000);

        fetch('api/machines/' + data.machine.id + '/wake', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }

          return response.text;
        });
      },
    },
});
</script>
