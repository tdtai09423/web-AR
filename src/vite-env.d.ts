/// <reference types="vite/client" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-assets': any;
      'a-entity': any;
      'a-video': any;
      'a-camera': any;
    }
  }

  interface Element {
    hasLoaded?: boolean;
  }
}

export {};
