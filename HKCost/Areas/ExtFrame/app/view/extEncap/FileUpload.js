/*PlUpload封装 
  在使用时需要传递自定义参数
*/
var uploader;
var uploadedFilesInfo;
Ext.define('ExtFrame.view.extEncap.FileUpload', {
    extend: 'Ext.window.Window',
    requires: ['ExtFrame.view.extEncap.FileUploadController'],
    controller: 'fileupload',
    closable: true,
    resizable: false,
    autoShow: true,
    modal: true,
    width: 400,
    height: 355,
    autoScroll: true,
    closeAction: 'destroy',
    title: '文件上传',
    //自定义上传参数*/
    PlUploadOpts: {
        uniqueNames: true, //当值为true时会为每个上传的文件生成一个唯一的文件名
        fileCount: 3,//允许上传文件个数
        path: 'Upload', //上传路径，从应用程序根目录写起，前后不带'/'。
        mimeType: [{ title: "所有文件", extensions: "*" }], //定上传文件的类型 例如：[{ title: "Image files", extensions: "jpg,gif,png" }]
        maxFileSize: '512mb', //限定上传文件的大小.值可以为一个数字，单位为b,也可以是一个字符串，由数字和单位组成，如'200kb,200mb'
        preventDuplicates: true, //不允许选取重复文件
        officeConvert: false, //是否在线转换，默认为false。目前仅支持word文档转html，excel文档转html
        picShow: true, //图片预览功能，默认为打开
        canContinue: false, //是否支持断点续传，默认为不支持
        createDateDir: false, //是否创建日期目录，默认为不创建
    },
    returnFun: null,//控件关闭后执行的回调函数（包括一个参数：上传成功的文件信息集合），默认为null不执行。例：function(data){}, //data:[{UploadFile1Info},{UploadFile2Info},...,{UploadFileNInfo}]
    returnControl: {
        Control: null,
        Property: null
    },
    items: [{
        xtype: 'panel',
        html: '<div id="PlUpload_div"><p id="PlUpload_buttons"><button id="browse">选择文件</button><button id="start_upload">开始上传</button></p><ul id="file-list"></ul></div>'
    }],
    listeners: {
        afterrender: function (me, eOpts) {
            uploadedFilesInfo = new Array(0);
            //实例化一个plupload上传对象
            uploader = new plupload.Uploader({
                browse_button: 'browse', //触发文件选择对话框的按钮，为那个元素id
                url: Tools.Method.getRootPath() + '/Areas/ExtFrame/resources/PlUpload/UploadFile.ashx', //服务器端的上传页面地址
                flash_swf_url: Tools.Method.getRootPath() + '/Areas/ExtFrame/resources/PlUpload/Moxie.swf', //swf文件，当需要使用swf方式进行上传时需要配置该参数
                silverlight_xap_url: Tools.Method.getRootPath() + '/Areas/ExtFrame/resources/PlUpload/Moxie.xap', //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
                chunk_size: '512kb', //分片上传文件时，每片文件被切割成的大小，如"200kb"
                unique_names: me.PlUploadOpts.uniqueNames && !me.PlUploadOpts.canContinue ? true : false, //当值为true时会为每个上传的文件生成一个唯一的文件名
                filters: {
                    mime_types: me.PlUploadOpts.mimeType, //定上传文件的类型
                    max_file_size: me.PlUploadOpts.maxFileSize, //限定上传文件的大小.值可以为一个数字，单位为b,也可以是一个字符串，由数字和单位组成，如'200kb,200mb'
                    prevent_duplicates: me.PlUploadOpts.preventDuplicates //不允许选取重复文件
                },
                multipart_params: {  //扩展参数
                    path: me.PlUploadOpts.path,
                    createDateDir: me.PlUploadOpts.createDateDir
                }
            });
            //在实例对象上调用init()方法进行初始化
            uploader.init();
            //绑定各种事件，并在事件监听函数中做你想做的事
            uploader.bind('FilesAdded', function (uploader, files) {
                //每个事件监听函数都会传入一些很有用的参数，
                //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
                if (files.length > me.PlUploadOpts.fileCount - $('#file-list li').length) {
                    for (var i = 0, len = files.length; i < len; i++) {
                        uploader.removeFile(files[i]);
                    }
                    Ext.MessageBox.alert('提示', '此处最多上传' + me.PlUploadOpts.fileCount + '个附件，已超出数量限制！');
                    return;
                }
                for (var i = 0, len = files.length; i < len; i++) {
                    var file_name = files[i].name; //文件名
                    var file_id = files[i].id;//文件id
                    //构造html来更新UI
                    var html = '<li id="file-' + files[i].id + '"><span>0%</span><p class="file-name">' + file_name + '</p><p class="progress"></p><a href="javascript:void(0)" class="remove" onClick="RemoveFile(\'' + file_id + '\')">移除</a></li>';
                    $(html).appendTo('#file-list');
                    if (me.PlUploadOpts.picShow) {
                        !function (i) {
                            previewImage(files[i], function (imgsrc) {
                                $('#file-' + files[i].id).append('<img src="' + imgsrc + '" />');
                            })
                        }(i);
                    }
                    //发起ajax请求获取已上传临时文件进度信息
                    var data = Tools.Method.GetGetData(Ext.encode({ path: me.PlUploadOpts.path + '/' + files[i].name }), false);
                    //添加文件时如果开启控件断点续传功能，对比服务器已上传临时文件信息
                    if (me.PlUploadOpts.canContinue) {
                        var tempSize = 0;
                        Tools.Method.ExtAjaxRequestEncap(Tools.Method.getRootPath() + '/Areas/ExtFrame/resources/PlUpload/GetTempFileInfo.ashx', 'GET', data, false, function (jsonData) {
                            tempSize = jsonData
                        });
                        files[i].loaded = tempSize;
                        files[i].percent = files[i].loaded / files[i].size * 100;
                        $('#file-' + files[i].id + ' .progress').css('width', files[i].percent + '%');//控制进度条
                        $('#file-' + files[i].id + ' span').text(parseInt(files[i].percent) + '%');//显示上传进度
                    }
                }
                //控制上传文件个数
                if ($('#file-list li').length == me.PlUploadOpts.fileCount) {
                    $('#browse').attr("disabled", "disabled");
                }
            });
            uploader.bind('UploadProgress', function (uploader, file) {
                //每个事件监听函数都会传入一些很有用的参数，
                //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
                $('#file-' + file.id + ' .progress').css('width', file.percent + '%');//控制进度条
                $('#file-' + file.id + ' span').text(file.percent + '%');//显示上传进度
            });
            uploader.bind('FileUploaded', function (uploader, file, responseObject) {
                //每个事件监听函数都会传入一些很有用的参数，
                //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
                $('#file-' + file.id + ' .remove').hide();
                var html = '<a href="javascript:void(0)" class="delete" onclick="DeleteFile(\'' + file.id + '\')" >删除</a>';//添加删除按钮
                $(html).appendTo('#file-' + file.id);
                var fileNameUnit = file.name.split('.');
                var fileExtendName = fileNameUnit[fileNameUnit.length - 1];
                var memoryName;
                if (me.PlUploadOpts.canContinue)
                    memoryName = file.name;
                else {
                    if (me.PlUploadOpts.uniqueNames)
                        memoryName = file.id + '.' + fileExtendName;
                    else
                        memoryName = file.name;
                }
                var path = responseObject.response;
                var fileInfo = { id: file.id, Name: file.name, MemoryName: memoryName, ExtendName: fileExtendName, Size: file.size, Path: path };
                uploadedFilesInfo.push(fileInfo);
                //Office文档在线转换html  注释掉上传时直接转换文档
                //if (me.PlUploadOpts.officeConvert) {
                //    var convertFile = { filepath: path, htmlpath: 'Upload\\OfficeConvert' };
                //    var data = Tools.Method.GetPostData(Ext.encode(convertFile));
                //    Tools.Method.ExtAjaxRequestEncap(Tools.Method.getRootPath() + '/Areas/ExtFrame/resources/PlUpload/OfficeConvert.ashx', 'POST', data, true, function (jsonData) {
                //        if (jsonData) {
                //            var online = '<a href="' + Tools.Method.getRootPath() + '/Upload/OfficeConvert/' + file.id + '.html" target="_blank">在线查看</a>'
                //            $(online).appendTo('#file-' + file.id);
                //        }
                //    });
                //}
            });
            //......

            //最后给"开始上传"按钮注册事件
            document.getElementById('start_upload').onclick = function () {
                uploader.start(); //调用实例对象的start()方法开始上传文件，当然你也可以在其他地方调用该方法
            }
        },
        beforeclose: function (me, eOpts) {
            if (me.returnControl) {
                if (me.returnControl.Property == 'value')
                    me.returnControl.Control.setValue(Ext.encode(uploadedFilesInfo));
            }
            if (me.returnFun) {
                me.returnFun(uploadedFilesInfo);
            }
        }
    }
});
//plupload中为我们提供了mOxie对象
//有关mOxie的介绍和说明请看：https://github.com/moxiecode/moxie/wiki/API
//如果你不想了解那么多的话，那就照抄本示例的代码来得到预览的图片吧
function previewImage(file, callback) {//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
    if (!file || !/image\//.test(file.type)) return; //确保文件是图片
    if (file.type == 'image/gif') {//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
        var fr = new mOxie.FileReader();
        fr.onload = function () {
            callback(fr.result);
            fr.destroy();
            fr = null;
        }
        fr.readAsDataURL(file.getSource());
    } else {
        var preloader = new mOxie.Image();
        preloader.onload = function () {
            preloader.downsize(300, 300);//先压缩一下要预览的图片,宽300，高300
            var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
            callback && callback(imgsrc); //callback传入的参数为预览图片的url
            preloader.destroy();
            preloader = null;
        };
        preloader.load(file.getSource());
    }
}