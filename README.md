# React Inspector

Easily detect React components source code from Chrome!

![CleanShot 2022-09-02 at 18 08 23](https://user-images.githubusercontent.com/24843808/188106077-ff409aeb-0145-4977-9be2-16d04809cc78.gif)

The Inspector launch with Ctrl+Shift+X (Command+Shift+X on Mac).  
You can detect and open the React component source code easily.

## Requirements

- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- Works only with development builds.
- Source code must be stored on local disk

## How it works

The React Inspector accesses the `__REACT_DEVTOOLS_GLOBAL_HOOK__` set globally by the React Devtools and finds the [React Fiber](https://reactjs.org/docs/faq-internals.html#what-is-react-fiber) in the HTML element that the inspector hovered over.
The React Fiber contains information about the source code that will be added during development, so we use that information to open the VSCode.

Reference
- https://github.com/facebook/react/tree/main/packages/react-devtools#faq
- https://babeljs.io/docs/en/babel-plugin-transform-react-jsx-source
- https://github.com/facebook/react/blob/f0efa1164b7ca8523b081223954d05c88e92053b/packages/react-reconciler/src/ReactInternalTypes.js#L193
