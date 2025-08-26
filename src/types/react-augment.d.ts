import 'react';

declare module 'react' {
  // Augment ForwardRefExoticComponent to be compatible with React 19's stricter JSX types
  interface ForwardRefExoticComponent<P> {
    (props: P): React.ReactElement | null;
  }
  
  // Augment FC to be compatible with React 19's stricter JSX types
  interface FunctionComponent<P = {}> {
    (props: P): React.ReactElement | null;
  }
}