/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

// Class helper functions
// classie.has( elem, 'my-class' ) -> true/false
// classie.add( elem, 'my-class' )
// classie.remove( elem, 'my-class' )
// classie.toggle( elem, 'my-class' )

// Export classie as a module for TypeScript
export const classie = (function() {
  'use strict';

  function classReg( className: string ) {
    return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
  }

  // classList support for class management
  // altho to be fair, the api sucks because it won't accept multiple classes at once
  let hasClass, addClass, removeClass;

  if ( 'classList' in document.documentElement ) {
    hasClass = function( elem: Element, c: string ) {
      return elem.classList.contains( c );
    };
    addClass = function( elem: Element, c: string ) {
      elem.classList.add( c );
    };
    removeClass = function( elem: Element, c: string ) {
      elem.classList.remove( c );
    };
  }
  else {
    hasClass = function( elem: Element, c: string ) {
      return classReg( c ).test( elem.className );
    };
    addClass = function( elem: Element, c: string ) {
      if ( !hasClass( elem, c ) ) {
        elem.className = elem.className + ' ' + c;
      }
    };
    removeClass = function( elem: Element, c: string ) {
      elem.className = elem.className.replace( classReg( c ), ' ' );
    };
  }

  function toggleClass( elem: Element, c: string ) {
    var fn = hasClass( elem, c ) ? removeClass : addClass;
    fn( elem, c );
  }

  return {
    // full names
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    // short names
    has: hasClass,
    add: addClass,
    remove: removeClass,
    toggle: toggleClass
  };

})();

// Make classie available globally
(window as any).classie = classie;
