/**
 * Created by Chen.
 * Date: 2016/10/25
 * Time: 22:48
 */
'use strict';
angular.module('uploads', []).directive('uploads', function () {
    return {
        restrict: 'AE',
        template: '<div class="row fileupload-buttonbar" style="padding-left:15px;">' +
        '<div class="thumbnail col-sm-6" style="width: 95%;">' +
        '<img id="upload_show" style="height:180px;margin-top:10px;margin-bottom:8px;" data-holder-rendered="true">' +
        '<div class="progress progress-striped active" role="progressbar" aria-valuemin="10" aria-valuemax="100" aria-valuenow="0">' +
        '<div id="upload_progress" class="progress-bar progress-bar-success" style="width:0%;"></div>' +
        '</div>' +
        '<div class="caption" align="center">' +
        '<span id="upload_upload" class="btn btn-primary fileinput-button">' +
        '<span>上传</span>' +
        '<input type="file" id="upload_image" name="picture" multiple>' +
        '</span>' +
        '<a id="upload_cancle" href="javascript:void(0)" class="btn btn-warning" role="button" style="display:none">删除</a>' +
        '</div>' +
        '</div>' +
        '</div>',
        require: '^ngModel',
        link: function (scope, element, attrs, ngModel) {
            scope.$watch(attrs.ngModel, function () {
                var PARENT = $(element),
                    src = ngModel.$viewValue;
                _renderUp();
                _activateClick();

                function getSrc(parent) {
                    var PARENTIMG = parent.find('#upload_show').attr('src'); // 存放按钮的容器  $('#div')

                    if (PARENTIMG == '/img/imgc.png')
                        return '';
                    else
                        return PARENTIMG;
                }

                function _renderUp() {
                    PARENT.find('#upload_show').attr('src', src ? src : '/img/imgc.png');
                }

                function _activateClick() {
                    var _this = this,
                        _btn = PARENT.find("#upload_image"),
                        upload_progress = PARENT.find("#upload_progress"),
                        upload_show = PARENT.find("#upload_show"),
                        upload_upload = PARENT.find("#upload_upload"),
                        upload_cancle = PARENT.find("#upload_cancle");

                    // 激活点击事件。
                    _btn.fileupload({
                        url: '/ImageUpload/ImageUpload.action',
                        sequentialUploads: true
                    }).bind('fileuploadprogress', function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        upload_progress.css('width', progress + '%');
                        upload_progress.html(progress + '%');
                    }).bind('fileuploaddone', function (e, data) {
                        var json = data.result;
                        if (json["return"] == "true") {
                            upload_show.attr("src", json.url ? json.url : '/img/imgc.png');
                            upload_upload.css({
                                display: "none"
                            });
                            upload_cancle.css({
                                display: ""
                            });
                            ngModel.$setViewValue(getSrc($(element)));
                        } else {
                            upload_upload.css({
                                display: ""
                            });
                            upload_progress.css('width', '0%');
                            upload_progress.html('');
                            upload_cancle.css({
                                display: "none"
                            });
                        }

                    });
                    upload_cancle.unbind().click(function () {
                        upload_show.attr("src", '/img/imgc.png');
                        upload_upload.css({
                            display: ""
                        });
                        upload_progress.css('width', '0%');
                        upload_progress.html('');
                        upload_cancle.css({
                            display: "none"
                        });
                        ngModel.$setViewValue('');
                    });

                }
            });
        }
    };
});