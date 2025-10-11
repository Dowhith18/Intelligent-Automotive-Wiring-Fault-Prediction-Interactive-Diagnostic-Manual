# Development Guidelines

## Code Quality Standards

### JavaScript Coding Patterns
- **Cross-Browser Compatibility**: All JavaScript functions include fallback mechanisms for different browser implementations
  ```javascript
  var myElement = e.srcElement || e.target; // IE vs standards-compliant browsers
  ```
- **Defensive Programming**: Extensive null/undefined checks before accessing object properties
  ```javascript
  if (!myElement) return true;
  if (myElement.id) document.currentId = myElement.id;
  ```
- **Error Handling**: Try-catch blocks used for potentially failing operations, especially frame access
  ```javascript
  try {
    return frame.contentDocument ? frame.contentDocument : frame.contentWindow.document;
  } catch (e) {
    return null;
  }
  ```

### Naming Conventions
- **Function Names**: camelCase with descriptive verbs (toggleOpenClose, expandToNode, showInInputBox)
- **Variable Names**: camelCase with meaningful descriptors (myElement, frameWin, contentDoc)
- **Constants**: UPPER_CASE with underscores (SELECTED, BACKUP_ID, INDEX_ARRAY)
- **Private Functions**: Prefixed with underscore (_searchFrameWin, _showTabToolbar, _filterContent)

### Documentation Standards
- **File Headers**: Dependencies clearly stated at top of files
  ```javascript
  /*
   * Dependencies: Requires utils.js
   */
  ```
- **Function Comments**: Multi-line comments for complex functions explaining purpose
  ```javascript
  /**
   * Scrolls the page to show the specified element
   */
  ```

## Architectural Patterns

### Frame Management Architecture
- **Centralized Frame Caching**: Global frame cache (top.frameCache) for performance optimization
- **Recursive Frame Search**: Hierarchical search through nested framesets
- **Cross-Frame Communication**: Functions designed to work across different frame contexts

### DOM Manipulation Patterns
- **Element Traversal**: Consistent patterns for navigating DOM hierarchy
  ```javascript
  while (myElement && "LI" != myElement.tagName.toUpperCase()) {
    myElement = myElement.parentNode;
  }
  ```
- **Class Name State Management**: CSS classes used to represent element states (open/closed/hidden/disabled)
- **Dynamic Content Filtering**: Profile-based content visibility using bitwise operations

### Event Handling Standards
- **Event Object Normalization**: Standardized event handling across browsers
  ```javascript
  e = e ? e : event ? event : null;
  var elem = e.srcElement ? e.srcElement : e.target ? e.target : e.currentTarget;
  ```
- **Event Bubbling Control**: Explicit event propagation management
  ```javascript
  if (!e.cancelBubble) e.cancelBubble = true;
  if (e.stopPropagation) e.stopPropagation();
  ```

## Implementation Patterns

### Navigation Tree Management
- **State-Based CSS Classes**: Elements use descriptive class names reflecting their state
  - open/closed for expandable nodes
  - hidden/disabled for filtered content
  - item/folder for different node types
- **Image State Synchronization**: Tree icons automatically updated to match node states
- **Recursive Node Operations**: Functions like expandAll/collapseAll operate recursively on tree structures

### Search and Filtering
- **Array-Based Indexing**: Pre-built arrays for efficient searching (INDEX_ARRAY)
- **Profile-Based Filtering**: Hexadecimal profile codes with bitwise matching
- **Incremental Search**: Real-time search with partial string matching

### Content Management
- **Modular JavaScript**: Functionality separated into logical modules (tree.js, profile.js, tab.js, utils.js)
- **Utility Function Library**: Common operations centralized in utils.js
- **Frame-Aware Operations**: All functions designed to work within frameset architecture

## Best Practices

### Performance Optimization
- **Frame Caching**: Frames cached on first access to avoid repeated searches
- **Lazy Loading**: Content loaded only when needed (iframe src assignment)
- **Efficient DOM Queries**: Minimal DOM traversal with targeted element selection

### Maintainability
- **Consistent Error Handling**: Standardized null checks and graceful degradation
- **Modular Design**: Clear separation of concerns across JavaScript files
- **Backward Compatibility**: Support for legacy browsers and HTML 4.01 standards

### User Experience
- **Keyboard Navigation**: Arrow key support for tree navigation
- **Visual Feedback**: Immediate visual response to user interactions
- **Accessibility**: Focus management and screen reader considerations