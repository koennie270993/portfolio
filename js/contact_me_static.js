$(function() {
    // Handle form submission results from query parameters
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    // Check for message response in URL
    var message = getParameterByName('message');
    if (message === 'success') {
        $('#success').html("<div class='alert alert-success'>");
        $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
        $('#success > .alert-success')
            .append("<strong>Your message has been sent. </strong>");
        $('#success > .alert-success')
            .append('</div>');
    } else if (message === 'error' || message === 'validation') {
        var errorText = getParameterByName('error') || 'Sorry, it seems that my mail server is not responding. Please try again later!';
        $('#success').html("<div class='alert alert-danger'>");
        $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
        $('#success > .alert-danger').append("<strong>" + errorText + "</strong>");
        $('#success > .alert-danger').append('</div>');
    }

    // Basic form validation without preventing submission
    $("input,textarea").jqBootstrapValidation({
        preventSubmit: false, // Allow form to submit normally
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});
