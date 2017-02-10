angular.module('mg-Services')
.factory('loaderService', function () {

    return {
        ShowLoader: function (message) {
            $.blockUI({
                message: '<h5>' + message + '</h5>',
                css: {
                    border: 'none',
                    padding: '10px',
                    fontsize: '12px',
                    backgroundColor: '#000',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    'border-radius': '10px',
                    opacity: .5,
                    color: '#fff'
                }
            });

        },
        ShowLoaderOnElement: function (element, message) {
            $(element).block({
                message: '<h5>' + message + '</h5>',
                css: {
                    border: 'none',
                    padding: '10px',
                    fontsize: '12px',
                    backgroundColor: '#000',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    'border-radius': '10px',
                    opacity: .5,
                    color: '#fff'
                }
            });
        },

        ShowLoaderOnBlock: function (element) {
            $(element).block({
                message: '<img src="/app/Images/ajax-loader-element.gif" />',
                css: {
                    border: 'none',
                    padding: '10px',
                    fontsize: '12px',
                    backgroundColor: 'none',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    'border-radius': '10px',
                    opacity: .5,
                    color: 'white'
                }
            });
        },

        HideLoader: function (element) {
            $.unblockUI();
            if (element != null && element !== undefined)
                $(element).unblock();
        }
    };

});