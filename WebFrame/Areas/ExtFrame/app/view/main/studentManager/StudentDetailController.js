Ext.define('ExtFrame.view.main.studentManager.StudentDetailController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.studentDetailController',
    onAddClick: function () {
        var detailView = this.getView();
        var record = detailView.getViewModel().getData().rec;
        if (record) {
            alert(record);
            detailView.close();
        } else {
            Ext.MessageBox.alert('提示', '请先填写完整！');
        }
        
    },
    onSaveClick: function () {
        var detailView = this.getView();
        var record = detailView.getViewModel().getData().rec;
        if (record) {
            alert(record);
            detailView.close();
        } else {
            Ext.MessageBox.alert('提示', '请先填写完整！');
        }
    }
});