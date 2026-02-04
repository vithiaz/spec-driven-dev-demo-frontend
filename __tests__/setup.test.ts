/**
 * Sample test to verify Jest setup works
 */

describe('Jest Setup', () => {
  it('should run tests correctly', () => {
    expect(true).toBe(true);
  });

  it('should have access to jest-dom matchers', () => {
    const element = document.createElement('div');
    element.textContent = 'Hello World';
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Hello World');

    document.body.removeChild(element);
  });
});
