import React from 'react';
import {fireEvent, waitFor} from '@testing-library/react-native';
import TodoList, {Todo} from '../components/TodoList';
import {renderWithProviders} from '../utils/renderWithProviders';
import {v4 as uuidv4} from 'uuid';

// Mock the uuid generation
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid'),
}));

describe('TodoList Component', () => {
  let instance: any;
  let screen: any;
  const mockTodoArray: Todo[] = [
    {id: uuidv4(), name: 'First Task', status: 'incomplete'},
    {
      id: '5919886b-c983-4cba-b3b3-ed3a217e293b',
      name: 'gym',
      status: 'incomplete',
    },
    {id: uuidv4(), name: 'Third Task', status: 'incomplete'},
  ];

  beforeEach(() => {
    screen = renderWithProviders(<TodoList />);
    instance = screen.UNSAFE_getByType(TodoList).instance;
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render the TodoList component correctly', () => {
    const {getByPlaceholderText, getByText} = renderWithProviders(<TodoList />);

    expect(getByPlaceholderText('Enter a todo ...')).toBeTruthy();
    expect(getByText('ADD')).toBeTruthy();
  });

  it('should not add the todo if input is empty', async () => {
    const {getByPlaceholderText, getByText} = renderWithProviders(<TodoList />);
    const addTodoSpy = jest.spyOn(instance, 'addTodo');
    const handleClearTextSpy = jest.spyOn(instance, 'handleClearText');

    const input = getByPlaceholderText('Enter a todo ...');
    const addButton = getByText('ADD');

    fireEvent.changeText(input, '');
    fireEvent.press(addButton);

    await waitFor(() => {
      expect(addTodoSpy).not.toHaveBeenCalled();
      expect(handleClearTextSpy).not.toHaveBeenCalled();
    });
  });

  it('should add a new todo item when the ADD button is pressed', async () => {
    const {getByPlaceholderText, getByText, queryByText} = renderWithProviders(
      <TodoList />,
    );

    const input = getByPlaceholderText('Enter a todo ...');
    const addButton = getByText('ADD');

    fireEvent.changeText(input, 'New Todo');
    fireEvent.press(addButton);

    expect(queryByText('New Todo')).toBeTruthy();
    expect(queryByText('Clear')).toBeTruthy();
  });

  it('should clear the input when Clear button is pressed', async () => {
    const {getByPlaceholderText, getByText} = renderWithProviders(<TodoList />);

    const input = getByPlaceholderText('Enter a todo ...');
    const clearButton = getByText('Clear');

    fireEvent.changeText(input, 'Clean the house');

    fireEvent.press(clearButton);

    await waitFor(() => {
      expect(input.props.value).toBe('');
    });
  });

  it('should clear the input field after adding a new todo', async () => {
    const {getByPlaceholderText, getByText} = renderWithProviders(<TodoList />);

    const input = getByPlaceholderText('Enter a todo ...');
    const addButton = getByText('ADD');

    fireEvent.changeText(input, 'New Todo');
    fireEvent.press(addButton);

    expect(input.props.value).toBe('');
  });

  it('should change the status of a todo item when checkbox is clicked', async () => {
    instance.setState({todoArray: mockTodoArray});

    const {getByTestId} = renderWithProviders(<TodoList />);

    const checkbox = getByTestId('gym');

    fireEvent.press(checkbox);

    await waitFor(() => {
      expect(checkbox.props.isChecked).toBe(true);
    });
  });

  it('should open and close the modal for editing todo', async () => {
    instance.setState({todoArray: mockTodoArray});

    const {getByText, getByTestId, queryByText} = renderWithProviders(
      <TodoList />,
    );

    const editButton = getByTestId('edit-button-gym');
    fireEvent.press(editButton);

    expect(getByText('Edit Todo')).toBeTruthy();

    const closeButton = getByTestId('close-button');
    fireEvent.press(closeButton);

    await waitFor(() => {
      expect(queryByText('Edit Todo')).toBeNull();
    });
  });

  it('should delete a todo item when the delete button is pressed', async () => {
    instance.setState({todoArray: mockTodoArray});

    const {queryByText, getByTestId} = renderWithProviders(<TodoList />);

    const deleteButton = getByTestId('delete-button-gym');

    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(queryByText('gym')).toBeNull();
    });
  });

  it('should update the name of the correct todo based on the provided id', () => {
    instance.setState({todoArray: mockTodoArray});
    instance.editTodo(
      '5919886b-c983-4cba-b3b3-ed3a217e293b',
      'Updated Second Task',
    );

    const updatedTodoArray: Todo[] = instance.state.todoArray;

    const updatedTodo = updatedTodoArray.find(
      todo => todo.id === '5919886b-c983-4cba-b3b3-ed3a217e293b',
    );

    expect(updatedTodo).toBeDefined();
    expect(updatedTodo?.name).toBe('Updated Second Task');

    expect(updatedTodoArray[0].name).toBe('First Task');
    expect(updatedTodoArray[2].name).toBe('Third Task');
  });

  it('should update the status of the correct todo based on the provided id', () => {
    instance.setState({todoArray: mockTodoArray});
    instance.changeTodoStatus(
      '5919886b-c983-4cba-b3b3-ed3a217e293b',
      'complete',
    );

    const updatedTodoArray: Todo[] = instance.state.todoArray;

    const updatedTodo = updatedTodoArray.find(
      todo => todo.id === '5919886b-c983-4cba-b3b3-ed3a217e293b',
    );

    expect(updatedTodo).toBeDefined();
    expect(updatedTodo?.status).toBe('complete');

    expect(updatedTodoArray[0].status).toBe('incomplete');
    expect(updatedTodoArray[2].status).toBe('incomplete');
  });
});
