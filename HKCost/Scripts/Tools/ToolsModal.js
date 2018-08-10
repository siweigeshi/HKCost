var ToolsModal = function ($uibModal, tempUrl, size, funcSuccess) {
    if (size != 'lg' && size != 'sm') {
        size = '';
    }
    return $uibModal.open({
        templateUrl: tempUrl,
        controller: function ($scope, $uibModalInstance) {
            $scope.ok = function ($uibModalInstance) {
                debugger;
                funcSuccess($uibModalInstance);
                //$uibModalInstance.close('closed');
            }
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            }
        },
        size: size
    });
}