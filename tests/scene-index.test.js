import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Scene from '../src/scene/index.js';

// Mock the SVG component
jest.mock('../src/scene/scene.svg', () => {
  return function MockSvg({ width, height }) {
    return (
      <div data-testid="mock-svg" data-width={width} data-height={height}>
        <svg>
          <text fontFamily="Roboto-Thin">Thin Text</text>
          <text fontFamily="Roboto-Light">Light Text</text>
          <text fontFamily="Roboto-Regular">Regular Text</text>
          <text fontFamily="Roboto-Black">Black Text</text>
          <tspan fontFamily="Roboto-Thin">Thin Span</tspan>
        </svg>
        <button id="contactsbutton">Contacts</button>
        <button id="githubbutton">GitHub</button>
      </div>
    );
  };
});

// Mock the transitions module
jest.mock('../src/scene/transitions', () => ({
  transitions: jest.fn(() => new Map([
    ['element1', { 100: { opacity: 0 }, 200: { opacity: 1 } }]
  ])),
  duration: 5000
}));

// Mock the transition utilities
jest.mock('../src/scene/transition-utilities', () => ({
  getTransitionElements: jest.fn(() => ['element1', 'element2'])
}));

// Mock the tick function
jest.mock('../src/scene/tickFunction', () => jest.fn());

// Mock the MP4 import
jest.mock('../src/images/albinotonnina.com.mp4', () => 'mock-video.mp4');

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();

beforeEach(() => {
  mockIntersectionObserver.mockImplementation((callback, options) => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    root: options?.root || null,
    rootMargin: options?.rootMargin || '0px',
    thresholds: options?.threshold || [0]
  }));
  window.IntersectionObserver = mockIntersectionObserver;
  
  // Mock window.open
  window.open = jest.fn();
  
  // Mock setTimeout
  jest.spyOn(global, 'setTimeout').mockImplementation((fn, delay) => {
    if (typeof fn === 'function') {
      fn();
      return 1;
    }
    return 0;
  });
  
  // Mock window properties
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 800
  });
  
  // Mock document.querySelectorAll for scene placeholders
  const mockPlaceholders = [
    { observe: jest.fn() },
    { observe: jest.fn() }
  ];
  
  const originalQuerySelectorAll = document.querySelectorAll;
  document.querySelectorAll = jest.fn((selector) => {
    if (selector === '[data-scene-placeholder]') {
      return mockPlaceholders;
    }
    if (selector === 'text, tspan') {
      return [
        {
          getAttribute: jest.fn((attr) => {
            if (attr === 'font-family') return 'Roboto-Thin';
          }),
          setAttribute: jest.fn(),
          removeAttribute: jest.fn()
        },
        {
          getAttribute: jest.fn((attr) => {
            if (attr === 'font-family') return 'Roboto-Light';
          }),
          setAttribute: jest.fn(),
          removeAttribute: jest.fn()
        }
      ];
    }
    return originalQuerySelectorAll.call(document, selector) || [];
  });
  
  // Mock document.querySelector for buttons
  const originalQuerySelector = document.querySelector;
  document.querySelector = jest.fn((selector) => {
    const mockElement = {
      addEventListener: jest.fn()
    };
    
    if (selector === '#contactsbutton' || selector === '#githubbutton') {
      return mockElement;
    }
    return originalQuerySelector.call(document, selector);
  });
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe('Scene Component', () => {
  const defaultProps = {
    width: 1200,
    height: 800,
    isPortrait: false
  };

  describe('rendering', () => {
    it('should render the SVG component with correct props', () => {
      render(<Scene {...defaultProps} />);
      
      const svg = screen.getByTestId('mock-svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('data-width', '1200');
      expect(svg).toHaveAttribute('data-height', '800');
    });

    it('should render with portrait orientation', () => {
      render(<Scene {...defaultProps} isPortrait={true} />);
      
      const svg = screen.getByTestId('mock-svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('font replacement effect', () => {
    it('should replace font families with font weights', async () => {
      const mockTextElements = [
        {
          getAttribute: jest.fn((attr) => {
            if (attr === 'font-family') return 'Roboto-Thin';
          }),
          setAttribute: jest.fn(),
          removeAttribute: jest.fn()
        },
        {
          getAttribute: jest.fn((attr) => {
            if (attr === 'font-family') return 'Roboto-Light';
          }),
          setAttribute: jest.fn(),
          removeAttribute: jest.fn()
        },
        {
          getAttribute: jest.fn((attr) => {
            if (attr === 'font-family') return 'Roboto-Regular';
          }),
          setAttribute: jest.fn(),
          removeAttribute: jest.fn()
        },
        {
          getAttribute: jest.fn((attr) => {
            if (attr === 'font-family') return 'Roboto-Black';
          }),
          setAttribute: jest.fn(),
          removeAttribute: jest.fn()
        }
      ];

      document.querySelectorAll = jest.fn((selector) => {
        if (selector === 'text, tspan') {
          return mockTextElements;
        }
        if (selector === '[data-scene-placeholder]') {
          return [];
        }
        return [];
      });

      render(<Scene {...defaultProps} />);

      // Check that each font was replaced correctly
      expect(mockTextElements[0].setAttribute).toHaveBeenCalledWith('font-weight', '100');
      expect(mockTextElements[0].removeAttribute).toHaveBeenCalledWith('font-family');
      
      expect(mockTextElements[1].setAttribute).toHaveBeenCalledWith('font-weight', '300');
      expect(mockTextElements[1].removeAttribute).toHaveBeenCalledWith('font-family');
      
      expect(mockTextElements[2].setAttribute).toHaveBeenCalledWith('font-weight', '400');
      expect(mockTextElements[2].removeAttribute).toHaveBeenCalledWith('font-family');
      
      expect(mockTextElements[3].setAttribute).toHaveBeenCalledWith('font-weight', '900');
      expect(mockTextElements[3].removeAttribute).toHaveBeenCalledWith('font-family');
    });

    it('should handle elements without font-family attribute', async () => {
      const mockTextElement = {
        getAttribute: jest.fn(() => null),
        setAttribute: jest.fn(),
        removeAttribute: jest.fn()
      };

      document.querySelectorAll = jest.fn((selector) => {
        if (selector === 'text, tspan') {
          return [mockTextElement];
        }
        if (selector === '[data-scene-placeholder]') {
          return [];
        }
        return [];
      });

      render(<Scene {...defaultProps} />);

      // Should not call setAttribute or removeAttribute when no font-family
      expect(mockTextElement.setAttribute).not.toHaveBeenCalled();
      expect(mockTextElement.removeAttribute).not.toHaveBeenCalled();
    });
  });

  describe('intersection observer effect', () => {
    it('should create intersection observer with correct options', () => {
      const sceneTransitions = require('../src/scene/transitions');
      
      render(<Scene {...defaultProps} />);

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          threshold: expect.any(Array)
        }
      );

      // Check that transitions were called with isPortrait
      expect(sceneTransitions.transitions).toHaveBeenCalledWith(false);
    });

    it('should observe scene placeholder elements', () => {
      const mockPlaceholders = [
        document.createElement('div'),
        document.createElement('div')
      ];
      
      document.querySelectorAll = jest.fn((selector) => {
        if (selector === '[data-scene-placeholder]') {
          return mockPlaceholders;
        }
        return [];
      });

      render(<Scene {...defaultProps} />);

      expect(document.querySelectorAll).toHaveBeenCalledWith('[data-scene-placeholder]');
      expect(mockObserve).toHaveBeenCalledTimes(2);
    });

    it('should disconnect observer on unmount', () => {
      const { unmount } = render(<Scene {...defaultProps} />);
      
      unmount();
      
      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should handle portrait orientation', () => {
      const sceneTransitions = require('../src/scene/transitions');
      
      render(<Scene {...defaultProps} isPortrait={true} />);

      expect(sceneTransitions.transitions).toHaveBeenCalledWith(true);
    });
  });

  describe('createThreshold function', () => {
    it('should create correct threshold array', () => {
      // We need to test this indirectly through the intersection observer creation
      render(<Scene {...defaultProps} />);

      const callArgs = mockIntersectionObserver.mock.calls[0];
      const options = callArgs[1];
      const thresholds = options.threshold;

      expect(Array.isArray(thresholds)).toBe(true);
      expect(thresholds.length).toBeGreaterThan(0);
      expect(thresholds[0]).toBe(0);
      expect(thresholds[thresholds.length - 1]).toBeLessThanOrEqual(1);
    });
  });

  describe('button event handlers', () => {
    it('should add click event listener to contacts button', () => {
      const mockContactsButton = {
        addEventListener: jest.fn()
      };

      document.querySelector = jest.fn((selector) => {
        if (selector === '#contactsbutton') {
          return mockContactsButton;
        }
        if (selector === '#githubbutton') {
          return { addEventListener: jest.fn() };
        }
        return null;
      });

      render(<Scene {...defaultProps} />);

      expect(mockContactsButton.addEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      );
    });

    it('should add click event listener to github button', () => {
      const mockGithubButton = {
        addEventListener: jest.fn()
      };

      document.querySelector = jest.fn((selector) => {
        if (selector === '#githubbutton') {
          return mockGithubButton;
        }
        if (selector === '#contactsbutton') {
          return { addEventListener: jest.fn() };
        }
        return null;
      });

      render(<Scene {...defaultProps} />);

      expect(mockGithubButton.addEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      );
    });

    it('should open LinkedIn URL when contacts button is clicked', () => {
      const mockContactsButton = {
        addEventListener: jest.fn()
      };

      document.querySelector = jest.fn((selector) => {
        if (selector === '#contactsbutton') {
          return mockContactsButton;
        }
        if (selector === '#githubbutton') {
          return { addEventListener: jest.fn() };
        }
        return null;
      });

      render(<Scene {...defaultProps} />);

      // Get the click handler that was registered
      const clickHandler = mockContactsButton.addEventListener.mock.calls[0][1];
      
      // Simulate click
      clickHandler();

      expect(window.open).toHaveBeenCalledWith('https://www.linkedin.com/in/albinotonnina/');
    });

    it('should open GitHub URL when github button is clicked', () => {
      const mockGithubButton = {
        addEventListener: jest.fn()
      };

      document.querySelector = jest.fn((selector) => {
        if (selector === '#githubbutton') {
          return mockGithubButton;
        }
        if (selector === '#contactsbutton') {
          return { addEventListener: jest.fn() };
        }
        return null;
      });

      render(<Scene {...defaultProps} />);

      // Get the click handler that was registered
      const clickHandler = mockGithubButton.addEventListener.mock.calls[0][1];
      
      // Simulate click
      clickHandler();

      expect(window.open).toHaveBeenCalledWith('https://github.com/albinotonnina/albinotonnina.com/');
    });
  });

  describe('edge cases', () => {
    it('should handle missing buttons gracefully', () => {
      document.querySelector = jest.fn(() => null);
      document.querySelectorAll = jest.fn((selector) => {
        if (selector === '[data-scene-placeholder]') {
          return [];
        }
        if (selector === 'text, tspan') {
          return [];
        }
        return [];
      });

      expect(() => {
        render(<Scene {...defaultProps} />);
      }).not.toThrow();
    });

    it('should handle missing scene placeholders', () => {
      document.querySelectorAll = jest.fn((selector) => {
        if (selector === '[data-scene-placeholder]') {
          return [];
        }
        return [];
      });

      expect(() => {
        render(<Scene {...defaultProps} />);
      }).not.toThrow();
    });

    it('should handle missing text elements', () => {
      document.querySelectorAll = jest.fn(() => []);

      expect(() => {
        render(<Scene {...defaultProps} />);
      }).not.toThrow();
    });

    it('should work with different window sizes', () => {
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1200
      });

      expect(() => {
        render(<Scene {...defaultProps} />);
      }).not.toThrow();
    });
  });

  describe('integration', () => {
    it('should call all effects when component mounts', () => {
      const { getTransitionElements } = require('../src/scene/transition-utilities');
      const onTick = require('../src/scene/tickFunction');
      
      render(<Scene {...defaultProps} />);

      // Check that transition utilities were called
      expect(getTransitionElements).toHaveBeenCalled();
      
      // Check that intersection observer was created
      expect(mockIntersectionObserver).toHaveBeenCalled();
      
      // Check that setTimeout was called for font replacement
      expect(setTimeout).toHaveBeenCalled();
    });

    it('should re-run effects when props change', () => {
      const { rerender } = render(<Scene {...defaultProps} />);
      
      const initialCalls = mockIntersectionObserver.mock.calls.length;
      
      rerender(<Scene {...defaultProps} isPortrait={true} />);
      
      // Should create a new observer when props change
      expect(mockIntersectionObserver.mock.calls.length).toBeGreaterThan(initialCalls);
    });
  });
});
