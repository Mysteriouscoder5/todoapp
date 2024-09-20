import React from 'react';
import {fireEvent, waitFor} from '@testing-library/react-native';
import TodoUpdateModal from '../components/TodoUpdateModal';
import {Todo} from '../components/TodoList';
import {renderWithProviders} from '../utils/renderWithProviders';

describe('TodoUpdateModal Component', () => {
  const mockTodo: Todo = {
    id: '5919886b-c983-4cba-b3b3-ed3a217e293b',
    name: 'gym',
    status: 'incomplete',
  };

  const mockSetIsOpen = jest.fn();
  const mockEditTodo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the modal with correct initial state', () => {
    const {getByTestId, getByText} = renderWithProviders(
      <TodoUpdateModal
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        editTodo={mockEditTodo}
        todo={mockTodo}
      />,
    );
    expect(getByTestId('todo-input')).toBeTruthy();
    expect(getByText('EDIT')).toBeTruthy();
  });

  it('should close the modal when the close button is pressed', async () => {
    const {getByTestId} = renderWithProviders(
      <TodoUpdateModal
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        editTodo={mockEditTodo}
        todo={mockTodo}
      />,
    );

    const closeButton = getByTestId('close-button');
    fireEvent.press(closeButton);

    await waitFor(() => {
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    });
  });

  it('should edit the todo when the EDIT button is pressed', async () => {
    const {getByPlaceholderText, getByText} = renderWithProviders(
      <TodoUpdateModal
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        editTodo={mockEditTodo}
        todo={mockTodo}
      />,
    );

    const input = getByPlaceholderText('Enter a todo ...');
    const editButton = getByText('EDIT');

    fireEvent.changeText(input, 'Updated Gym Task');
    fireEvent.press(editButton);

    await waitFor(() => {
      expect(mockEditTodo).toHaveBeenCalledWith(
        mockTodo.id,
        'Updated Gym Task',
      );
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    });
  });

  it('should not edit the todo if input is empty', async () => {
    const {getByTestId, getByText} = renderWithProviders(
      <TodoUpdateModal
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        editTodo={mockEditTodo}
        todo={mockTodo}
      />,
    );

    const input = getByTestId('todo-input');
    const editButton = getByText('EDIT');

    fireEvent.changeText(input, '');
    fireEvent.press(editButton);

    await waitFor(() => {
      expect(mockEditTodo).not.toHaveBeenCalled();
      expect(mockSetIsOpen).not.toHaveBeenCalledWith(false);
    });
  });

  it('should clear the input value after pressing EDIT', async () => {
    const {getByTestId, getByText} = renderWithProviders(
      <TodoUpdateModal
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        editTodo={mockEditTodo}
        todo={mockTodo}
      />,
    );

    const input = getByTestId('todo-input');
    const editButton = getByText('EDIT');

    fireEvent.changeText(input, 'Updated Gym Task');
    fireEvent.press(editButton);

    await waitFor(() => {
      expect(mockEditTodo).toHaveBeenCalledWith(
        mockTodo.id,
        'Updated Gym Task',
      );
      expect(input.props.value).toBe('');
    });
  });
});
