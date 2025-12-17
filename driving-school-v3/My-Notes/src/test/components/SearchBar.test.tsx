/**
 * Unit tests for SearchBar component.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { SearchBar } from '../../components/molecules/SearchBar';

// Mock the search store
const mockSetQuery = vi.fn();
const mockClearSearch = vi.fn();

vi.mock('../../store/searchStore', () => ({
  useSearchStore: vi.fn(() => ({
    query: '',
    setQuery: mockSetQuery,
    clearSearch: mockClearSearch,
  })),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
  };
});

// Wrapper with Router
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input', () => {
    render(<SearchBar />, { wrapper: Wrapper });
    expect(screen.getByPlaceholderText(/search notes/i)).toBeInTheDocument();
  });

  it('has accessible label', () => {
    render(<SearchBar />, { wrapper: Wrapper });
    expect(screen.getByLabelText(/search notes/i)).toBeInTheDocument();
  });

  it('calls setQuery when typing', async () => {
    const user = userEvent.setup();
    render(<SearchBar />, { wrapper: Wrapper });

    const input = screen.getByPlaceholderText(/search notes/i);
    await user.type(input, 'test query');

    // setQuery should be called for each character
    expect(mockSetQuery).toHaveBeenCalled();
  });

  it('navigates to search page when typing', async () => {
    const user = userEvent.setup();
    render(<SearchBar />, { wrapper: Wrapper });

    const input = screen.getByPlaceholderText(/search notes/i);
    await user.type(input, 'a');

    expect(mockNavigate).toHaveBeenCalledWith('/search');
  });

  it('focuses on / keyboard shortcut', () => {
    render(<SearchBar />, { wrapper: Wrapper });
    
    const input = screen.getByPlaceholderText(/search notes/i);
    fireEvent.keyDown(window, { key: '/' });

    expect(document.activeElement).toBe(input);
  });

  it('has search icon', () => {
    render(<SearchBar />, { wrapper: Wrapper });
    // The search icon is decorative, but we can check it's rendered
    expect(screen.getByPlaceholderText(/search notes/i).parentElement?.querySelector('svg')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<SearchBar className="custom-class" />, { wrapper: Wrapper });
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
