import $ from "jquery";

export const ajax = function (url, data, datatype, onSuccess, onFailure) {
    $.ajax({
        type: 'get',
        url: url,
        data: data,
        dataType: datatype,
        success: function (data) {
            onSuccess(data);
        },
        error: function (request, status, error) {
            onFailure(request, status, error);
        }
    });
};

export const isMobile = function () {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
};

export const isIE = function () {
    const myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;
};
