var transformerCompany = angular.module('transformerCompany', []);

transformerCompany.controller('transformerCtrl', ['$scope', 'transformerService', function ($scope, transformerService) {

    $scope.specs = TECH_SPEC;
    $scope.range = SPEC_RANGE;

    var autobotWins = 0;
    var decepticonWins = 0;
    var numberOfBattles = 0;

    $scope.init = function () {
        $scope.autobots = [];
        $scope.decepticons = [];
        $scope.isBattleComplete = false;
    };

    $scope.addAutobot = function (autobot) {
        let a = angular.copy(autobot);
        $scope.autobots.push(a);
    };

    $scope.addDecepticon = function (decepticon) {
        let d = angular.copy(decepticon);
        $scope.decepticons.push(d);
    };

    $scope.startBattle = function () {
        // var data = {};
        // data.autobots = $scope.autobots;
        // data.decepticon = $scope.decepticons;

        // let response = transformerService.starBattle(data);
        let autobots = $scope.autobots;
        let decepticons = $scope.decepticons;

        if(autobots.length==0 || decepticons.length==0){
            alert(NO_TEAM_MESSAGE);
        }
        else {
            let n = 0;
            if(autobots.length>decepticons.length){
                n = autobots.length;
            }
            else{
                n = decepticons.length;
            }
            $scope.sortTeamByRank(autobots, decepticons);
            $scope.applySpecialRules(autobots, decepticons)
            for(let i=0;i<n;i++) {
                let a = autobots[i];
                let d = decepticons[i];
                if(!a.name || !d.name) {
                    // Empty objects
                }
                else {
                    if(a.COURAGE >= d.COURAGE + 4 && a.STRENGTH >= d.STRENGTH + 3) {
                        $scope.autobotWin(i);
                    }
                    if(d.COURAGE >= a.COURAGE + 4 && d.STRENGTH >= a.STRENGTH + 3) {
                        $scope.decepticontWin(i);
                    }
                    if(a.SKILL >= d.SKILL + 3) {
                        $scope.autobotWin(i);
                    }
                    if(d.SKILL >= a.SKILL + 3) {
                        $scope.decepticontWin(i);
                    }
                    let aOverall = a.STRENGTH + a.INTELLIGENCE + a.SPEED + a.ENDURANCE + a.FIREPOWER;
                    let dOverall = d.STRENGTH + d.INTELLIGENCE + d.SPEED + d.ENDURANCE + d.FIREPOWER;
                    if(aOverall>dOverall) {
                        $scope.autobotWin(i);
                    }
                    else if(dOverall>aOverall) {
                        $scope.decepticontWin(i);
                    }
                    else {
                        numberOfBattles++;
                        autobots[i] = {};
                        decepticons[i] = {};
                    }
                }
            }
            $scope.numberOfBattles = numberOfBattles;
            if(autobotWins>decepticonWins) {
                $scope.winningTeam = AUTOBOTS;
                $scope.losingTeam = DECEPTICONS;
                $scope.survivors = $scope.getSurvivors(DECEPTICONS);
            }
            else if(decepticonWins>autobotWins) {
                $scope.winningTeam = DECEPTICONS;
                $scope.losingTeam = AUTOBOTS;
                $scope.survivors = $scope.getSurvivors(AUTOBOTS);
            }
            else {
                $scope.winningTeam = "TIE";
                $scope.losingTeam = "TIE";
                $scope.survivors = "NONE";
            }
            $scope.isBattleComplete = true;
        }
    }

    $scope.sortTeamByRank = function(autobots, decepticons) {
        autobots.sort((a,b) => (a.RANK > b.RANK) ? 1 : ((b.RANK > a.RANK) ? -1 : 0));
        decepticons.sort((a,b) => (a.RANK > b.RANK) ? 1 : ((b.RANK > a.RANK) ? -1 : 0));
    }

    $scope.applySpecialRules = function(autobots, decepticons) {
        let i = autobots.map(function(a) { return a.name; }).indexOf(OPTIMUS_PRIME);
        let j = decepticons.map(function(d) { return d.name; }).indexOf(PREDAKING);

        if(i>=0) {
            let temp = decepticons[i].name;

            if(temp == PREDAKING){
                alert(NO_WINNER_FOUND_MESSAGE);
                return;
            }
            else{
                decepticons[i] = {};
                numberOfBattles++;
                autobotWins++;
            }
        }
        if(j>=0) {
            let temp = autobots[j].name;

            if(temp == OPTIMUS_PRIME){
                alert(NO_WINNER_FOUND_MESSAGE);
                return;
            }
            else{
                autobots[i] = {};
                numberOfBattles++;
                decepticonWins++;
            }
        }
    }

    $scope.autobotWin = function (i) {
        numberOfBattles++;
        autobotWins++;
        $scope.decepticons[i] = {};
    }

    $scope.decepticontWin = function (i) {
        numberOfBattles++;
        decepticonWins++;
        $scope.autobots[i] = {};
    }

    $scope.getSurvivors = function (team) {
        let losers = [];
        let survivors = '';
        if(team == AUTOBOTS) {
            losers = $scope.autobots;
        }
        else {
            losers = $scope.decepticons;
        }
        for (let i=0;i<losers.length;i++) {
            if (losers[i].name) {
                survivors = survivors + ' ' + losers[i].name;
            }
        }
        return survivors;
    }

    $scope.init();

}]);