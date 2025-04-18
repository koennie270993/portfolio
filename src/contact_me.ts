import { jQueryReady } from './lib/jquery-ready';

jQueryReady(($) => {
    // Only apply AJAX form handling if not in static mode
    if ($('#contactForm').attr('data-static') !== 'true') {
        // Setup HTML5 validation
        const contactForm = document.getElementById('contactForm') as HTMLFormElement;
        if (contactForm) {
            // Add required attribute to form fields
            $("input#name, input#email, input#phone, textarea#message").attr('required', 'required');
            
            // Add email validation pattern
            $("input#email").attr('pattern', '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$');
            
            // Add phone validation pattern
            $("input#phone").attr('pattern', '\\d{10,}');
            
            // Handle form submission with AJAX
            contactForm.addEventListener('submit', function(event) {
                event.preventDefault(); // prevent default submit behaviour
                
                // Form is valid (HTML5 validation passed)
                // get values from FORM
                const name = $("input#name").val() as string;
                const email = $("input#email").val() as string;
                const phone = $("input#phone").val() as string;
                const message = $("textarea#message").val() as string;
                let firstName = name; // For Success/Failure Message
                // Check for white space in name for Success/Fail message
                if (firstName && firstName.indexOf(' ') >= 0) {
                    firstName = name.split(' ').slice(0, -1).join(' ');
                }
                $.ajax({
                    url: "././mail/contact_me.php",
                    type: "POST",
                    data: {
                        name: name,
                        phone: phone,
                        email: email,
                        message: message
                    },
                    cache: false,
                    success: function() {
                        // Success message
                        $('#success').html("<div class='alert alert-success'>");
                        $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                            .append("</button>");
                        $('#success > .alert-success')
                            .append("<strong>Your message has been sent. </strong>");
                        $('#success > .alert-success')
                            .append('</div>');

                        //clear all fields
                        $('#contactForm').trigger("reset");
                    },
                    error: function() {
                        // Fail message
                        $('#success').html("<div class='alert alert-danger'>");
                        $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                            .append("</button>");
                        $('#success > .alert-danger').append("<strong>Sorry, it seems that my mail server is not responding. Please try again later!");
                        $('#success > .alert-danger').append('</div>');
                        //clear all fields
                        $('#contactForm').trigger("reset");
                    },
                });
            });
        }
    }

    $("a[data-toggle=\"tab\"]").on('click', function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
    
    /*When clicking on Full hide fail/success boxes */
    $('#name').on('focus', function() {
        $('#success').html('');
    });
}); 