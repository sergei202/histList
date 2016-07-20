// This is the controller that our hit modal uses.  This is called using loadHit() above
angular.module('hitList').controller('HitCtrl', function($scope,$uibModal,$uibModalInstance,$http, hitItem) {		// Inject our dependencies and hitItem (the item we are editing)
	console.log('HitCtrl hitItem=', hitItem);
	$scope.hit = hitItem;

	$http.get('/contractors').then(function(res) {			// GET /contractors
		$scope.contractors = res.data;						// Assign the list to $scope.contractors
	});

	$scope.save = function() {
		$http.post('/hits', $scope.hit).then(function(response) {		// Post $scope.hit to our /hits POST route and then...
			console.log('post /hits: ', response.data);
			$uibModalInstance.close();
		});
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss();
	};

	$scope.delete = function() {
		var deleteModalInstance = $uibModal.open({					// We create a new modal to confirm if the user really wants to delete
			templateUrl: 'views/confirm.html',
			controller: function($scope,$uibModalInstance) {
				$scope.yes = function() {
					$uibModalInstance.close();						// We resolve the promise
				};
				$scope.no = function() {
					$uibModalInstance.dismiss();					// We reject the promise
				};
			}
		});
		deleteModalInstance.result.then(function() {				// We only delete if the result promise is resolved, meaning the user clicked yes
			$http.delete('/hits/' + $scope.hit._id).then(function() {
				$uibModalInstance.close();
			});
		});
	};
});
