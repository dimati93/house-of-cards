<template>
  <v-container>
    <v-row no-gutters>
      <v-col v-for="(gpu, index) in nvidiaStats.gpu" v-bind:key="gpu.id" sm="12" md="12" lg="6">
        <v-card elevation="3" class="ma-2">
          <v-card-title>
            <v-icon color="light-green darken-1">mdi-expansion-card-variant</v-icon>
            <span class="pl-2">GPU {{ index }}</span>
          </v-card-title>

          <v-container>
            <v-row no-gutters>
              <v-col cols="auto" class="mr-auto">GPU</v-col>
              <v-col cols="auto">{{gpu.utilization.gpu}} %</v-col>
              <v-col sm="12">
                <v-progress-linear color="red darken-2" rounded :value="gpu.utilization.gpu"></v-progress-linear>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="auto" class="mr-auto">Memory</v-col>
              <v-col cols="auto">{{gpu.utilization.memory}} %</v-col>
              <v-col sm="12">
                <v-progress-linear color="green darken-2" rounded :value="gpu.utilization.memory"></v-progress-linear>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="auto" class="mr-auto">Power</v-col>
              <v-col cols="auto">{{gpu.power.draw}}/{{gpu.power.limit}} W</v-col>
              <v-col sm="12">
                <v-progress-linear
                  color="yellow darken-2"
                  rounded
                  :value="gpu.power.draw/gpu.power.limit*100"
                ></v-progress-linear>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-chip outlined class="mr-2">
              <v-icon color="red lighten-2">mdi-thermometer</v-icon>
              <span class="pl-2">{{gpu.temperature.gpu}} C°</span>
            </v-chip>
            <v-chip outlined class="mr-2">
              <v-icon color="blue lighten-2">mdi-fan</v-icon>
              <span class="pl-2">{{gpu.fanSpeed}}%</span>
            </v-chip>
            <v-chip outlined class="mr-2">
              <div v-if="gpu.display == 'Enabled'">
                <v-icon color="green">mdi-monitor</v-icon>
                <span class="pl-2">On</span>
              </div>
              <div v-else>
                <v-icon>mdi-monitor-off</v-icon>
                <span class="pl-2">Off</span>
              </div>
            </v-chip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    nvidiaStats: Object,
  },
});
</script>