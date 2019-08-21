(function () {
    function ready () {
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
                    });
            });
        }
        
        fetch('/api/machines')
            .then(function(response) {
                return response.json();
            })
            .then(function(json) {
                app.machines = json.map(m => { return {id: m.id, host : m.host, status: {}}});
                update();
                setInterval(update, 5000);
            });
    }

    document.addEventListener("DOMContentLoaded", ready);
})();