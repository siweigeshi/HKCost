var MyUpload = {
    uploader: undefined,//plupload对象
    opt: {
        url: '/Areas/AdminLTE/plugins/PlUpload/UploadFile.ashx', //服务器端的上传页面地址(需要更具项目具体路径进行修改)
        flash_swf_url: '/Areas/AdminLTE/plugins/PlUpload/Moxie.swf', //swf文件，当需要使用swf方式进行上传时需要配置该参数(需要更具项目具体路径进行修改)
        silverlight_xap_url: '/Areas/AdminLTE/plugins/PlUpload/Moxie.xap', //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数(需要更具项目具体路径进行修改)
        fileNum: 5, //允许上传的文件个数
        shunk_size: '512kb', //分片上传文件时，每片文件被切割成的大小，如"200kb"
        unique_names: true, //当值为true时会为每个上传的文件生成一个唯一的文件名
        isDrop: true,//是否支持文件拖拽
        filters: {
            mime_types: [{ title: "所有文件", extensions: "*" }], //定上传文件的类型
            max_file_size: '512mb', //限定上传文件的大小.值可以为一个数字，单位为b,也可以是一个字符串，由数字和单位组成，如'200kb,200mb'
            prevent_duplicates: true //不允许选取重复文件
        },
        multipart_params: {//扩展参数
            path: 'Upload', //上传服务器路径
            createDateDir: true //是否创建日期文件夹
        }
    },
    uploadedFilesInfo: new Array(0),
    //*btn:初始化上传按钮实体
    //*options:上传控件配置（json对象）
    // **fileNum:允许上传的文件个数,默认值5
    // **shunk_size:分片上传文件时，每片文件被切割成的大小，默认值512kb
    // **unique_names:当值为true时会为每个上传的文件生成一个唯一的文件名，默认值true
    // **mime_types:定上传文件的类型，默认值[{ title: "所有文件", extensions: "*" }]
    // **max_file_size:限定上传文件的大小.值可以为一个数字，单位为b,也可以是一个字符串，由数字和单位组成，如'200kb,200mb'，默认值512mb
    // **prevent_duplicates:不允许选取重复文件，默认值true
    // **path:上传服务器路径，默认值Upload
    // **createDateDir:是否创建日期文件夹，默认值true
    // **isDrop:是否支持文件拖拽，默认值true
    //*uploadedFileCallBack:文件上传成功时回调函数
    //*removeFileCallBack:文件移除成功时回调函数
    //*dialogCloseCallBack:上传控件关闭时回调函数
    Uploader: function (btn, options, uploadedFileCallBack, removeFileCallBack,dialogCloseCallBack) {
        var fileNum = options.fileNum != undefined ? options.fileNum : MyUpload.opt.fileNum;
        MyUpload.uploadedFilesInfo = new Array(0);
        $(btn).attr('data-toggle', 'modal');
        $(btn).attr('data-target', '#myModal');
        var myModal = $('<div/>', {
            'class': 'modal fade',
            'id': 'myModal',
            'tabindex': '-1',
            'role': 'dialog',
            'aria-labelledby': 'myModalLabel',
            'aria-hidden': 'true'
        });
        var modal_dialog = $('<div/>', {
            'class': 'modal-dialog',
            'style': 'width:650px;'
        });
        var modal_content = $('<div/>', {
            'class': 'modal-content',
        });
        //头部
        var modal_header = $('<div/>', {
            'class': 'modal-header',
        }).html('<h4 class="modal-title" id="myModalLabel">文件上传</h4>');
        //内容body
        var isDrop = options.isDrop != undefined ? options.isDrop : MyUpload.opt.isDrop;
        var htmlIsDrop = isDrop ? '<div class="alert alert-info" id="drop_element">可将要上传的文件拖拽至此进行上传</div>' : '';
        var modal_body = $('<div/>', {
            'class': 'modal-body'
        }).html(htmlIsDrop + '<div class="alert alert-warning" id="warningID" style="display:none"></div><section class="content" style="height:100%;"> <div class="div-uploadCon" id="file-list"></div> </section>');
        //尾部
        var modal_footer = $('<div/>', {
            'class': 'modal-footer',
        }).html('<button type="button" class="btn btn-primary btn-md" id="browse">选择文件<span class="glyphicon glyphicon-picture" style="padding-left: 10px;"></span></button><button type="button" class="btn btn-success btn-md" id="start_upload"> 开始上传<span class="glyphicon glyphicon-cloud-upload" style="padding-left: 10px;"></span></button><button type="button" class="btn btn-danger btn-md" id="close"> 关闭<span class="glyphicon glyphicon-remove-circle" style="padding-left: 10px;"></span></button>');
        modal_content.append(modal_header).append(modal_body).append(modal_footer);
        modal_dialog.append(modal_content);
        myModal.append(modal_dialog);
        $('body').append(myModal);

        MyUpload.uploader = new plupload.Uploader({
            browse_button: 'browse', //触发文件选择对话框的按钮，为那个元素id
            url: MyUpload.opt.url, //服务器端的上传页面地址
            flash_swf_url: MyUpload.opt.flash_swf_url, //swf文件，当需要使用swf方式进行上传时需要配置该参数
            silverlight_xap_url: MyUpload.opt.silverlight_xap_url, //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
            drop_element: isDrop ? 'drop_element' : '',
            chunk_size: options.shunk_size != undefined ? options.shunk_size : MyUpload.opt.shunk_size, //分片上传文件时，每片文件被切割成的大小，如"200kb"
            unique_names: options.unique_names != undefined ? options.unique_names : MyUpload.opt.unique_names,//当值为true时会为每个上传的文件生成一个唯一的文件名
            filters: {
                mime_types: options.mime_types != undefined ? options.mime_types : MyUpload.opt.filters.mime_types,//定上传文件的类型
                max_file_size: options.max_file_size != undefined ? options.max_file_size : MyUpload.opt.filters.max_file_size,//限定上传文件的大小.值可以为一个数字，单位为b,也可以是一个字符串，由数字和单位组成，如'200kb,200mb'
                prevent_duplicates: options.prevent_duplicates != undefined ? options.prevent_duplicates : MyUpload.opt.filters.prevent_duplicates //不允许选取重复文件
            },
            runtimes: !!window.ActiveXObject || "ActiveXObject" in window ? 'silverlight' : 'html5',//ie浏览器采用silverlight方式上传，其余浏览器用html5方式上传
            multipart_params: {  //扩展参数
                path: options.path != undefined ? options.path : MyUpload.opt.multipart_params.path,
                createDateDir: options.createDateDir != undefined ? options.createDateDir : MyUpload.opt.multipart_params.createDateDir
            }
        });
        MyUpload.uploader.init();
        //绑定各种事件，并在事件监听函数中做你想做的事
        MyUpload.uploader.bind('FilesAdded', function (uploader, files) {
            //每个事件监听函数都会传入一些很有用的参数，
            //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
            if (files.length > fileNum - $('#file-list .div-img').length) {
                for (var i = 0, len = files.length; i < len; i++) {
                    uploader.removeFile(files[i]);
                }

                //提示信息
                $("#warningID").append('<strong>警告！</strong>', '此处最多上传' + fileNum + '个附件，已超出数量限制！');
                $("#warningID").show();
                setTimeout(function () {
                    $("#warningID").empty();
                    $("#warningID").hide();
                }, 3000);
                return;
            }
            for (var i = 0, len = files.length; i < len; i++) {
                var file_name = files[i].name; //文件名
                var file_id = files[i].id;//文件id
                var name = '';
                if (file_name.split('.').length > 1)
                    name = file_name.split('.')[file_name.split('.').length - 1];
                var html = '<div id="file-' + files[i].id + '"  class="div-img" style="width: 100px; height: 120px;position: relative; display: inline-block;margin-right: 10px;">' +
				 '<span style="position:absolute;top:5px;left:5px;color:#fff;font-size:12px;">.' + name + '</span><em class="glyphicon glyphicon-remove-circle" style="color:rgba(255,255,255,0.4); position:absolute;top:-8px;left:-8px; font-size:16px;color:orangered;z-index:11;cursor: pointer" onclick="MyUpload.RemoveFile(\'' + file_id + '\',0,' + removeFileCallBack + ')"></em>' +
					'<img  width="100" height="120" onerror="javascript:this.src=\'/Areas/AdminLTE/plugins/PlUpload/icoImg/other.png\';" />' +
					  '<div class="progressBar" style="width: 100%; height: 16px; line-height: 16px; background-color:rgba(0,0,0,0.3); position: absolute; top: 90%; left: 0px; margin-top: -10px; text-align: center;">' +
						   '<div class="pro BarClass" style="position: absolute; top: 0px; left: 0px; width: 0%; height: 16px;  background-color: green;"></div>' +
						   '<span style="position: relative; z-index: 9; color: #fff; font-size: 12px;" id="span_percent">0%</span></div></div>'
                // var html = '<li id="file-' + files[i].id + '"><span>0%</span><p class="file-name">' + file_name + '</p><p class="progress"></p><a href="javascript:void(0)" class="remove" onClick="RemoveFile(\'' + file_id + '\')">移除</a></li>';
                $(html).appendTo('#file-list');

                $('#file-' + files[i].id + ' >img').attr('src', '/Areas/AdminLTE/plugins/PlUpload/icoImg/' + name + '.png');

                //添加文件时如果开启控件断点续传功能，对比服务器已上传临时文件信息
                //if (true) {
                // 发起ajax请求获取已上传临时文件进度信息
                //    json = { path: 'Upload' + '/' + files[i].name };
                //    var data = Tools.Method.GetGetData(JSON.stringify(json), false);
                //    var tempSize = 0;
                //    Tools.Method.GetAjaxEncap(Tools.Method.getRootPath() + '/Areas/AdminLTE/plugins/PlUpload/GetTempFileInfo.ashx', 'GET', data, false, function (jsonData) {
                //        tempSize = jsonData
                //    });
                //    files[i].loaded = tempSize;
                //    files[i].percent = files[i].loaded / files[i].size * 100;
                //     $('#file-' + files[i].id + ' .BarClass').css('width', parseInt(files[i].percent) + '%');//控制进度条
                //    $('#file-' + files[i].id + ' span').text('上传中' + parseInt(files[i].percent) + '%');//显示上传进度
                //}
            }
        });
        MyUpload.uploader.bind('UploadProgress', function (uploader, file) {
            //每个事件监听函数都会传入一些很有用的参数，
            //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
            $('#file-' + file.id + ' .BarClass').css('width', file.percent + '%');//控制进度条
            $('#file-' + file.id + ' #span_percent').text(file.percent + '%');//显示上传进度
        });
        MyUpload.uploader.bind('FileUploaded', function (uploader, file, responseObject) {
            //每个事件监听函数都会传入一些很有用的参数，
            //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
            var fileNameUnit = file.name.split('.');
            var fileExtendName = fileNameUnit[fileNameUnit.length - 1];
            var memoryName;
            if (true)
                memoryName = file.name;
            else {
                if (true)
                    memoryName = file.id + '.' + fileExtendName;
                else
                    memoryName = file.name;
            }
            var path = responseObject.response;
            var fileInfo = { id: file.id, Name: file.name, MemoryName: memoryName, ExtendName: fileExtendName, Size: file.size, Path: path };
            MyUpload.uploadedFilesInfo.push(fileInfo);
            $("#file-" + fileInfo.id + " em").removeAttr("onclick");
            $("#file-" + fileInfo.id + " em").attr("onclick", "MyUpload.RemoveFile(\'" + fileInfo.id + "\',1," + removeFileCallBack + ")");
            uploadedFileCallBack(fileInfo);
        });
        //最后给"开始上传"按钮注册事件
        $("#start_upload").click(function () {
            MyUpload.uploader.start(); //调用实例对象的start()方法开始上传文件，当然你也可以在其他地方调用该方法
        });
        //上传控件关闭按钮
        $("#close").click(function () {
            if (MyUpload.uploader.state != 1) {
                layer.open({
                    closeBtn: 0,
                    content: "正在上传文件中，关闭后造成上传失败！确认要关闭么？",
                    btn: ['是', '否'],
                    yes: function (index) {
                        MyUpload.uploader.stop();
                        $('#myModal').modal('hide');
                        layer.close(index);
                    },
                    btn2: function (index) {
                        layer.close(index);
                    }
                });
            } else {
                $('#myModal').modal('hide');
            }
        });
        //模态框关闭事件
        $('#myModal').on('hide.bs.modal', function () {
            $("#file-list").empty();
            var callBackFiles = new Array();
            $.each(MyUpload.uploadedFilesInfo, function (index, fileInfo) {
                callBackFiles.push(fileInfo);
            });
            MyUpload.uploadedFilesInfo = new Array(0);
            MyUpload.uploader.files = new Array(0);
            dialogCloseCallBack(callBackFiles);

        });
        //禁用点击模态框外部、Esc键关闭
        $('#myModal').modal({ backdrop: 'static', keyboard: false, show: false });

    },
    //*btn:初始化上传按钮实体
    //*options:上传控件配置（json对象）
    // **shunk_size:分片上传文件时，每片文件被切割成的大小，默认值512kb
    // **unique_names:当值为true时会为每个上传的文件生成一个唯一的文件名，默认值true
    // **mime_types:定上传文件的类型，默认值[{ title: "所有文件", extensions: "*" }]
    // **max_file_size:限定上传文件的大小.值可以为一个数字，单位为b,也可以是一个字符串，由数字和单位组成，如'200kb,200mb'，默认值512mb
    // **prevent_duplicates:不允许选取重复文件，默认值true
    // **path:上传服务器路径，默认值Upload
    // **createDateDir:是否创建日期文件夹，默认值true
    //*uploadedFileCallBack:文件上传成功时回调函数
    OneFileUploader: function (btn, options, uploadedFileCallBack) {
        var fileNum = 1;

        var myModal = $('<div/>', {
            'class': 'modal fade',
            'id': 'myModal',
            'tabindex': '-1',
            'role': 'dialog',
            'aria-labelledby': 'myModalLabel',
            'aria-hidden': 'true'
        });
        var modal_dialog = $('<div/>', {
            'class': 'modal-dialog',
            'style': 'width:650px;'
        });
        var modal_content = $('<div/>', {
            'class': 'modal-content',
        });
        //头部
        var modal_header = $('<div/>', {
            'class': 'modal-header',
        }).html('<h4 class="modal-title" id="myModalLabel"></h4>');
        //内容body
        var modal_body = $('<div/>', {
            'class': 'modal-body'
        }).html('<section class="content" style="height:100%;"> <div class="div-uploadCon" id="file-list"></div> </section>');
        //尾部
        var modal_footer = $('<div/>', {
            'class': 'modal-footer',
        }).html('<button type="button" class="btn btn-success btn-md" id="start_upload"> 开始上传<span class="glyphicon glyphicon-cloud-upload" style="padding-left: 10px;"></span></button><button type="button" class="btn btn-danger btn-md" id="close"> 关闭<span class="glyphicon glyphicon-remove-circle" style="padding-left: 10px;"></span></button>');
        modal_content.append(modal_header).append(modal_body).append(modal_footer);
        modal_dialog.append(modal_content);
        myModal.append(modal_dialog);
        $('body').append(myModal);
        MyUpload.uploader = new plupload.Uploader({
            browse_button: $(btn).attr('id'), //触发文件选择对话框的按钮，为那个元素id
            url: MyUpload.opt.url, //服务器端的上传页面地址
            flash_swf_url: MyUpload.opt.flash_swf_url, //swf文件，当需要使用swf方式进行上传时需要配置该参数
            silverlight_xap_url: MyUpload.opt.silverlight_xap_url, //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
            chunk_size: options.shunk_size != undefined ? options.shunk_size : MyUpload.opt.shunk_size, //分片上传文件时，每片文件被切割成的大小，如"200kb"
            unique_names: options.unique_names != undefined ? options.unique_names : MyUpload.opt.unique_names,//当值为true时会为每个上传的文件生成一个唯一的文件名
            filters: {
                mime_types: options.mime_types != undefined ? options.mime_types : MyUpload.opt.filters.mime_types,//定上传文件的类型
                max_file_size: options.max_file_size != undefined ? options.max_file_size : MyUpload.opt.filters.max_file_size,//限定上传文件的大小.值可以为一个数字，单位为b,也可以是一个字符串，由数字和单位组成，如'200kb,200mb'
                prevent_duplicates: options.prevent_duplicates != undefined ? options.prevent_duplicates : MyUpload.opt.filters.prevent_duplicates //不允许选取重复文件
            },
            runtimes: !!window.ActiveXObject || "ActiveXObject" in window ? 'silverlight' : 'html5',//ie浏览器采用silverlight方式上传，其余浏览器用html5方式上传
            multipart_params: {  //扩展参数
                path: options.path != undefined ? options.path : MyUpload.opt.multipart_params.path,
                createDateDir: options.createDateDir != undefined ? options.createDateDir : MyUpload.opt.multipart_params.createDateDir
            }
        });
        MyUpload.uploader.init();
        //绑定各种事件，并在事件监听函数中做你想做的事
        MyUpload.uploader.bind('FilesAdded', function (uploader, files) {
            //每个事件监听函数都会传入一些很有用的参数，
            //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
            if (files.length > fileNum - $('#file-list .div-img').length) {
                for (var i = 0, len = files.length; i < len; i++) {
                    uploader.removeFile(files[i]);
                }
                return;
            }
            for (var i = 0, len = files.length; i < len; i++) {
                var file_name = files[i].name; //文件名
                var file_id = files[i].id;//文件id
                $('#myModalLabel').text(file_name);
                var html = '<div class="progress" id="file-' + file_id + '">' +
                '<div class="progress-bar progress-bar-striped active BarClass" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width:0%">' +
                  '<span class="sr-only" id="span_percent">0% Complete</span>' +
                '</div>'+
              '</div>';
                $(html).appendTo('#file-list');

                //添加文件时如果开启控件断点续传功能，对比服务器已上传临时文件信息
                //if (true) {
                // 发起ajax请求获取已上传临时文件进度信息
                //    json = { path: 'Upload' + '/' + files[i].name };
                //    var data = Tools.Method.GetGetData(JSON.stringify(json), false);
                //    var tempSize = 0;
                //    Tools.Method.GetAjaxEncap(Tools.Method.getRootPath() + '/Areas/AdminLTE/plugins/PlUpload/GetTempFileInfo.ashx', 'GET', data, false, function (jsonData) {
                //        tempSize = jsonData
                //    });
                //    files[i].loaded = tempSize;
                //    files[i].percent = files[i].loaded / files[i].size * 100;
                //     $('#file-' + files[i].id + ' .BarClass').css('width', parseInt(files[i].percent) + '%');//控制进度条
                //    $('#file-' + files[i].id + ' span').text('上传中' + parseInt(files[i].percent) + '%');//显示上传进度
                //}
            }
            $('#myModal').modal('show');
        });
        MyUpload.uploader.bind('UploadProgress', function (uploader, file) {
            //每个事件监听函数都会传入一些很有用的参数，
            //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
            $('#file-' + file.id + ' .BarClass').css('width', file.percent + '%');//控制进度条
            $('#file-' + file.id + ' #span_percent').text(file.percent + '%');//显示上传进度
        });
        MyUpload.uploader.bind('FileUploaded', function (uploader, file, responseObject) {
            //每个事件监听函数都会传入一些很有用的参数，
            //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
            var fileNameUnit = file.name.split('.');
            var fileExtendName = fileNameUnit[fileNameUnit.length - 1];
            var memoryName;
            if (true)
                memoryName = file.name;
            else {
                if (true)
                    memoryName = file.id + '.' + fileExtendName;
                else
                    memoryName = file.name;
            }
            var path = responseObject.response;
            var fileInfo = { id: file.id, Name: file.name, MemoryName: memoryName, ExtendName: fileExtendName, Size: file.size, Path: path };
            $('#myModal').modal('hide');
            uploadedFileCallBack(fileInfo);
        });
        //最后给"开始上传"按钮注册事件
        $("#start_upload").click(function () {
            MyUpload.uploader.start(); //调用实例对象的start()方法开始上传文件，当然你也可以在其他地方调用该方法
        });
        //上传控件关闭按钮
        $("#close").click(function () {
            if (MyUpload.uploader.state != 1) {
                layer.open({
                    closeBtn: 0,
                    content: "正在上传文件中，关闭后造成上传失败！确认要关闭么？",
                    btn: ['是', '否'],
                    yes: function (index) {
                        MyUpload.uploader.stop();
                        $('#myModal').modal('hide');
                        layer.close(index);
                    },
                    btn2: function (index) {
                        layer.close(index);
                    }
                });
            } else {
                $('#myModal').modal('hide');
            }
        });
        //模态框关闭事件
        $('#myModal').on('hide.bs.modal', function () {
            //$("#file-list").empty();
            MyUpload.uploader.files = new Array(0);
        });
        //禁用点击模态框外部、Esc键关闭
        $('#myModal').modal({ backdrop: 'static', keyboard: false, show: false });
    },
    //移除上传的文件 fileid 文件的id，type是否删除服务器文件0：不删除；1：删除
    RemoveFile: function (fileid, type, removeFileCallBack) {
        var uploader = MyUpload.uploader;
        layer.open({
            closeBtn: 0,
            content: "确定删除吗",
            btn: ['是', '否'],
            yes: function (index) {
                $('#file-' + fileid).remove();
                var file = uploader.getFile(fileid);
                uploader.removeFile(file);
                if (type == 1) {
                    var Paths = new Array();
                    for (var i = 0; i < MyUpload.uploadedFilesInfo.length; i++) {
                        if (MyUpload.uploadedFilesInfo[i].id == fileid) {
                            Paths.push(MyUpload.uploadedFilesInfo[i].Path.replace('\\', '\\\\'));
                            MyUpload.uploadedFilesInfo.splice(i, 1);
                        }
                    }
                    $.ajax({
                        type: 'POST',
                        //dataType: "json",
                        //contentType: "text/json",
                        url: '/Areas/AdminLTE/plugins/PlUpload/DeleteFile.ashx',
                        data: { PostData: JSON.stringify(Paths) },
                        cache: false,
                        async: true,
                        success: function (msg) {
                            removeFileCallBack(fileid);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert(errorThrown);
                        }
                    });
                }
                layer.close(index);
            },
            btn2: function (index) {
                layer.close(index);
            }
        });
    }
};