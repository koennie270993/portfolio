// Add TypeScript declarations for libraries without types

// jqBootstrapValidation
interface JQuery<TElement = HTMLElement> {
  jqBootstrapValidation(options?: any): JQuery<TElement>;
  tab(action?: string): JQuery<TElement>;
}

// For bootstrap scrollspy
interface JQuery<TElement = HTMLElement> {
  scrollspy(options?: any): JQuery<TElement>;
  data(key: string): any;
}

// For custom window methods if any
interface Window {
  $: JQueryStatic;
  jQuery: JQueryStatic;
}

// For custom elements or attributes
interface HTMLElement {
  // Add any custom element properties here
}

// Declare any modules without types
declare module 'classie';
declare module 'jquery.easing';

// Additional jQuery easing declarations
// This avoids conflicts with the built-in easing type
interface JQueryCustomEasing {
  [key: string]: Function;
} 