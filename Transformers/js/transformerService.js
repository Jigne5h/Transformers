transformerCompany.service("transformerService", function ($http) {

    this.starBattle = function(data) {
        $http({
            method: "POST",
            url: "/battle",
            headers: {
                'Accept': "application/json, text/plain, */*",
                'Content-Type': 'application/json'
            },
            data: data
        }).then(function mySuccess(response) {
            console.log("success", response);
        }, function myError(response) {
            console.log("error", response);
        });
    }
})