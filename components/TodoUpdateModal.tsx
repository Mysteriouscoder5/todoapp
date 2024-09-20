import {Button, Input, Modal, Text} from 'native-base';
import React, {Component} from 'react';
import {Todo} from './TodoList';
type Props = {
  isOpen: boolean;
  setIsOpen: (openState: boolean) => void;
  editTodo: (id: string, name: string) => void;
  todo: Todo;
};
type State = {
  todoInputValue: string;
};
export default class TodoUpdateModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      todoInputValue: '',
    };
  }

  handleChangeText = (text: string): void => {
    this.setState({todoInputValue: text});
  };

  handleClearText = (): void => {
    this.setState({todoInputValue: ''});
  };

  render() {
    const {isOpen, setIsOpen, editTodo, todo} = this.props;
    const {todoInputValue} = this.state;
    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} avoidKeyboard>
        <Modal.Content>
          <Modal.CloseButton testID="close-button" />
          <Modal.Header>Edit Todo</Modal.Header>
          <Modal.Body>
            <Input
              testID="todo-input"
              borderRadius={'lg'}
              fontSize={'md'}
              placeholder="Enter a todo ..."
              flex={'1'}
              value={this.state.todoInputValue}
              onChangeText={text => {
                this.handleChangeText(text);
              }}
            />
            <Button
              mt={'3'}
              bgColor={'primary.800'}
              padding={'3'}
              borderRadius={'lg'}
              onPress={() => {
                if (!todoInputValue.trim()) {
                  return;
                }
                editTodo(todo.id, todoInputValue);
                this.handleClearText();
                setIsOpen(false);
              }}>
              <Text fontWeight={'bold'} color={'white'} fontSize={'lg'}>
                EDIT
              </Text>
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    );
  }
}
