import React, {ReactElement} from 'react';
import {render, RenderOptions} from '@testing-library/react-native';
import {NativeBaseProvider} from 'native-base';

// Extend the render options type to accept NativeBaseProvider
const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>, // RenderOptions from Testing Library
) => {
  const inset = {
    frame: {x: 0, y: 0, width: 0, height: 0},
    insets: {top: 0, left: 0, right: 0, bottom: 0},
  };
  return render(ui, {
    wrapper: ({children}) => (
      <NativeBaseProvider initialWindowMetrics={inset}>
        {children}
      </NativeBaseProvider>
    ),
    ...options,
  });
};

export * from '@testing-library/react-native'; // Re-export everything from testing library
export {renderWithProviders}; // Export the custom render function
