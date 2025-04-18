import { jQueryReady } from './lib/jquery-ready';

jQueryReady(($) => {
    // Handle form submission results from query parameters
    function getParameterByName(name: string, url: string = window.location.href): string | null {
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

    // Basic form validation using HTML5 validation
    const contactForm = document.getElementById('contactForm') as HTMLFormElement;
    if (contactForm) {
        // Add required attribute to form fields
        $("input[name='name'], input[name='email'], input[name='phone'], textarea[name='message']").attr('required', 'required');
        
        // Add email validation pattern
        $("input[name='email']").attr('pattern', '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$');
        
        // Add phone validation pattern (simple pattern, adjust as needed)
        $("input[name='phone']").attr('pattern', '\\d{10,}');
        
        // Custom validation messages
        $("input[name='name']").attr('data-validation-required-message', 'Please enter your name.');
        $("input[name='email']").attr('data-validation-required-message', 'Please enter your email address.');
        $("input[name='phone']").attr('data-validation-required-message', 'Please enter your phone number.');
        $("textarea[name='message']").attr('data-validation-required-message', 'Please enter a message.');
    }

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });

    /*When clicking on Full hide fail/success boxes */
    $('#name').focus(function() {
        $('#success').html('');
    });
});
