declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-assets': any;
      'a-video': any;
      'a-entity': any;
      'a-camera': any;
    }
  }

  interface Element {
    hasLoaded?: boolean;
  }
}

export {};