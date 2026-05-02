
/**
 * Declaration for global CSS files (e.g., globals.css)
 * This allows simple side-effect imports like: import './globals.css';
 */
declare module '*.css' {
    // We allow an empty object here because global CSS imports are side-effect only.
    // The imported value itself is not used.
    const content: { [className: string]: string };
    export default content;
}