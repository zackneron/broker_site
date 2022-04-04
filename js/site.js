// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

$(function () { 
    $('[data-toggle="tooltip"]').tooltip();

    $('#js-benefitOne input[type="checkbox"]').click(function (e) {
        e.stopPropagation();
    });
    $('#js-benefitTwo input[type="checkbox"]').click(function (e) {
        e.stopPropagation();
    });

    $("#selectAll").click(function () {
        $("input[type=checkbox]").prop("checked", $(this).prop("checked"));
    });

    $("input[type=checkbox]").click(function () {
        if (!$(this).prop("checked")) {
            $("#selectAll").prop("checked", false);
            $(this).closest('.panel-statement').css("background", "white");
        } else {
            $(this).closest('.panel-statement').css("background", "rgba(245,184,25,0.05)");
        }
    });
});

//Scripts from EB Broker Portal

var sessionTimeoutNotificationTimer;
var modalTimer = null;

function startSessionTimeoutNotificationTimer() {
    var count = 60;
    if (modalTimer != null) {
        clearInterval(modalTimer);
    }
    sessionTimeoutNotificationTimer = setTimeout(function () {
        $('#idleLogoutModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        $("#counter").html(count);
        modalTimer = setInterval(function () {
            $("#counter").html(count == 0 ? 0 : --count);
            if (count > 0 & count <= 9) {
                $('#counter').css('color', '#d0021b');
            } else if (count == 0) {
                $('#logout-btn').click(function (e) {
                    e.preventDefault();
                    window.location.href = this.href;
                });
                $('#logout-btn').trigger('click');
            };
        }, 1000);
    }, 840000);
}

function resetSessionTimeoutNotification() {
    if (!window.isApp) {
        clearTimeout(sessionTimeoutNotificationTimer);
        startSessionTimeoutNotificationTimer();
    }
    $('#idleLogoutModal').modal('hide');
}


function refreshSession() {
    var refreshSessionUrlWithoutUriScheme = refreshSessionUrl.replace('http:', '');
    $.post(refreshSessionUrlWithoutUriScheme)
        .then(function () {
            resetSessionTimeoutNotification();
        });
}

function signOutUser() {
    var signoutUrlWitoutUriScheme = signoutUrl
        .replace('http:', '')
        .replace('https:', '');
    var loginUrlWithoutScheme = loginUrl
        .replace('http:', '')
        .replace('https:', '');

    $.post(signoutUrlWitoutUriScheme, function () {
        window.location = loginUrlWithoutScheme;
    });
}

(function () {

    if (!window.isApp) {
        startSessionTimeoutNotificationTimer();
    }

    var browser = {
        android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        blackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        operaMini: function () {
            return navigator.userAgent.match(/Opera mini/i);
        },
        windowsPhone: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        isMobile: function () {
            return browser.android() || browser.blackBerry() || browser.iOS() || browser.operaMini() || browser.windowsPhone();
        },
        isIE: function () {
            return navigator.userAgent.match(/msie/i);
        }
    }

    window.browser = browser;

    $(function () {
        initialisePopups();
    });

})();

var showPopover = function () {
    $(this).popover('show');
};

var hidePopover = function () {
    $(this).popover('hide');
};

function initialisePopups() {
    $('[data-toggle="popover"], [data-toggle="tooltip"]').popover({
        trigger: "manual",
        html: true,
        content: function () {
            return $((this).data('target-selector')).html();
        },
        title: function () {
            var title = $(this).data('title');
            if (browser.iOS()) {
                title = title + '<span class="close">&times;</span>';
            }
            return title;
        }
    }).focusin(showPopover)
        .focusout(hidePopover)
        .blur(hidePopover)
        .hover(showPopover, hidePopover)
        .on('shown.bs.popover', function (e) {
            var popover = $(this);
            $(this).parent().find('div.popover .close').on('click', function (e) {
                console.log(e);
                popover.popover('hide');
            });
        });
}

var submitButton = (function () {
    var self = this;

    self.initDisabled = function (buttonSel, elSel) {
        var btn = $(buttonSel);
        var ele = $(elSel);
        var btnO = { 'btn': btn, enabled: false };

        enableDisableButton();

        function enableDisableButton() {
            ele.each(function (i, el) {
                if ($(el).is(':checkbox')) {
                    if ($(el).is(':checked')) {
                        btnO.enabled = true;
                        return false;
                    }
                } else {
                    if ($(el).val() != '') {
                        btnO.enabled = true;
                        return false;
                    }

                    btnO.enabled = false;
                }

                btnO.enabled = false;
            });

            if (btnO.enabled) {
                btn.removeAttr('disabled');
                return;
            }

            btn.attr('disabled', 'disabled');
        }

        ele.on('keyup', function () {
            enableDisableButton();
        }).on('change', function () {
            enableDisableButton();
        });
    };

    self.initDisabledAllFieldsRequired = function (buttonSel, elSel) {
        var btn = $(buttonSel);
        var ele = $(elSel);
        var btnO = { 'btn': btn, enabled: false };

        enableDisableButtonAllFieldsRequired();

        function enableDisableButtonAllFieldsRequired() {
            btnO.enabled = false;
            var hasCheckboxes = false;
            var checkBoxesAreValid = false;
            var otherFieldsAreValid = true;

            ele.each(function (i, el) {
                if ($(el).is(':checkbox')) {
                    hasCheckboxes = true;

                    if ($(el).is(':checked')) {
                        checkBoxesAreValid = true;
                    }
                } else {
                    if ($(el).val() == '') {
                        otherFieldsAreValid = false;
                        return false;
                    }
                }

                return true;
            });

            btnO.enabled = (hasCheckboxes && checkBoxesAreValid && otherFieldsAreValid) || (!hasCheckboxes && otherFieldsAreValid);

            if (btnO.enabled) {
                btn.removeAttr('disabled');
                return;
            }

            btn.attr('disabled', 'disabled');
        }

        ele.on('keyup', function () {
            enableDisableButtonAllFieldsRequired();
        }).on('change', function () {
            enableDisableButtonAllFieldsRequired();
        });
    };

    return self;
}());

(function () {
    $(document).ready(function () {
        initRowHilightJquery();
        textareaMessageRemaining();
        starIconRating();
    });

}());

function initRowHilightJquery() {
    $(document).ready(function () {
        $('.rowHilight').on('click', function () {
            executeHilightClick($(this));
        });
    });
}

function executeHilightClick(el) {
    var url = el.attr('data-val-url');
    if (url != undefined) {
        document.location.href = url;
    }
}

function textareaMessageRemaining() {
    $('#feedback-comment').keyup(function () {
        if (this.value.length > 250) {
            return false;
        }

        $("#message-remaining").html((250 - this.value.length) + " Characters remaining");
    });
}

function starIconRating() {
    $('.rating-star-icon').on('click', function () {
        if ($(this).hasClass('selected') && !$(this).nextAll().hasClass('selected')) {
            $(this).removeClass('selected');
            $(this).prevAll().removeClass('selected');
        } else if ($(this).hasClass('selected') && $(this).nextAll().hasClass('selected')) {
            $(this).nextAll().removeClass('selected');
        } else {
            $(this).addClass('selected');
            $(this).prevAll().addClass('selected');
        }

        var rating = parseInt($('.rating-star-icon.selected').length);

        $('#feedback-rating').val(rating).trigger('change');
    });
}

function setUpFeedbackFormSubmission() {
    submitButton.initDisabledAllFieldsRequired('#feedback-form-submit', '.feedback-rating-check');

    $('#feedback-form').on('submit', function (event) {
        var $form = $(this),
            url = $form.attr('action');

        var data = { feedback: { Rating: $('#feedback-rating').val(), Comment: $('#feedback-comment').val() } };

        $.post(url, data)
            .done(function (data, textStatus, jqXhr) {
                $('#feedbackModal').modal('hide');
                $('.rating-star-icon').removeClass('selected');
                $('.feedback-rating-check').val('');
                $('#feedback-comment').trigger('keyup');
                $('#feedback-result-text').val('Thank you for your feedback! This will help us immensely to further improve your experience.');
                $('#feedback-result-modal').modal('show');
            }).fail(function (jqXhr, textStatus, errorThrown) {
                $('#feedbackModal').modal('hide');
                $('#feedback-result-text').val('Unfortunately a problem has occured while submitting your feedback. Error details: ' + textStatus + ', ' + errorThrown);
                $('#feedback-result-modal').modal('show');
            });

        event.preventDefault();
    });
}

function clearFeedbackForm() {
    $('.rating-star-icon').removeClass('selected');
    $('.feedback-rating-check').val('');
    $('#feedback-comment').trigger('keyup');
}

(function ($) {
    $.fn.stackTable = function () {
        return this.each(function () {
            var headers = [];

            $(this).find('th').each(function () {
                headers.push($(this).text().replace(/\r?\n|\r/, ""));
            });

            $(this).find('td').each(function (index) {
                var cnt = index % headers.length;

                if (!$(this).hasClass('no-data-th')) {
                    $(this).attr('data-th', headers[cnt]);
                }
            });

        });
    };
}(jQuery));


$(document).ready(function () {
    setUpFeedbackFormSubmission();
});