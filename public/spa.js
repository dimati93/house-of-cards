(function () {
    function ready () {
        Vue.use(VueMaterial.default);
        Vue.component('machine-header', {
            props: {
                title: String, 
                machineOnline: Boolean
            },
            data: function () {
                return {};
            },
            template: '<span class="machine-header"><md-icon v-bind:class="{ \'machine-power-icon--on\': machineOnline, \'machine-power-icon--off\': !machineOnline }">power_settings_new</md-icon> {{ title }}</span>'
        });


        var app = new Vue({
            el: '#app',
            data: {
            machines: []
            }
        });
        

        function update() {
            app.machines.forEach((m, i) => {
                fetch('/api/machines/' + m.id + "/status" )
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(json) {
                        app.machines[i].status = json; 
                    })
                    .then(function () {
                        setTimeout(update, 5000);
                    });
            });
        }
        
        fetch('/api/machines')
            .then(function(response) {
                return response.json();
            })
            .then(function(json) {
                app.machines = json.map(m => { return {id: m.id, name : m.name, status: {}}});
                update();
            });
    }

    document.addEventListener("DOMContentLoaded", ready);
})();