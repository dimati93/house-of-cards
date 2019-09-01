<template>
  <v-card :elevation="6">
    <v-card-title>
      <machine-header :status="online" :machine="machine" :loading="loading"></machine-header>
    </v-card-title>
    <v-list v-if="users">
      <v-simple-table>
        <thead>
          <tr>
            <th class="text-left">User</th>
            <th class="text-left">Interface</th>
            <th class="text-left">Time</th>
            <th class="text-left">IP</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.login">
          <td>{{ user.login }}</td>
          <td>{{ user.interface }}</td>
          <td>{{ user.time }}</td>
          <td>{{ user.ip }}</td>
        </tr>
        </tbody>
      </v-simple-table>
    </v-list>
    <v-overlay absolute :value="error">
      <v-card flat>{{error}}</v-card>
    </v-overlay>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import MachineHeader from './MachineHeader.vue';

export default Vue.extend({
  components: {
    MachineHeader
  },
  props: {
    machine: Object
  },
  data() {
    return {
      timer: 0,
      retries: 0,
      loading: false,
      online: '',
      users: null,
      error: '',
    };
  },
  created() {
    this.fetchUpdate();
  },
  methods: {
    fetchUpdate() {
      const data = this;
      data.loading = true;

      fetch('api/machines/' + this.machine.id + '/users')
        .then(response => {
          data.loading = false;
          if (!response.ok) {
            throw response;
          }

          return response.json();
        })
        .then(json => {
          if (
            data.online === 'online' &&
            json.online === 'offline' &&
            data.retries < 3
          ) {
            data.retries++;
            return;
          }

          data.online = json.online;
          data.users = json.users;
          data.retries = 0;
          data.error = '';
        })
        .catch(error => {
          data.retries++;
          if (data.retries < 3) {
            return;
          }

          if (typeof error.text === "function") {
            error.text().then((errorMessage: string) => {
              data.error = errorMessage;
            });
          } else {
            data.error = error.replace(/^TypeError\: /, "");
          }
        })
        .then(() => {
          setTimeout(() => data.fetchUpdate(), 5000);
        });
    }
  }
});
</script>