import React from 'react';
import { render } from '@testing-library/react';
import CustomButton from '../../components/CustomButton';

describe('CustomButton', () => {
  test('renders with correct label', () => {
    const { getByText } = render(<CustomButton label="Click me" />);
    expect(getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<CustomButton label="Click me" onClick={handleClick} />);
    
    getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies additional props correctly', () => {
    const { getByTestId } = render(<CustomButton label="Submit" type="submit" disabled data-testid="submit-btn" />);
    
    const button = getByTestId('submit-btn');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toBeDisabled();
  });
});