/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {v4} from 'uuid';
import {PencilSquareIcon, TrashIcon} from 'react-native-heroicons/solid';
import {Box, Button, Checkbox, Input, Text, View} from 'native-base';
import TodoUpdateModal from './TodoUpdateModal';
export type Todo = {
  id: string;
  name: string;
  status: 'complete' | 'incomplete';
};
type Props = {};
type State = {
  todoArray: Todo[];
  todoInputValue: string;
  isOpenModal: boolean;
};
export default class TodoList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      todoArray: [
        {
          id: '5919886b-c983-4cba-b3b3-ed3a217e293b',
          name: 'gym',
          status: 'incomplete',
        },
      ],
      todoInputValue: '',
      isOpenModal: false,
    };
  }

  setIsOpenModal = (openState: boolean): void => {
    this.setState({isOpenModal: openState});
  };

  addTodo = (todo: Todo): void => {
    const {todoArray} = this.state;
    this.setState({
      todoArray: [...todoArray, todo],
    });
  };

  changeTodoStatus = (id: string, status: 'complete' | 'incomplete'): void => {
    const {todoArray} = this.state;
    const newTodoArray = todoArray.map(todo =>
      todo.id === id ? {...todo, status} : todo,
    );
    this.setState({todoArray: newTodoArray});
  };

  editTodo = (id: string, name: string): void => {
    const {todoArray} = this.state;
    const newTodoArray = todoArray.map(todo =>
      todo.id === id ? {...todo, name} : todo,
    );
    this.setState({todoArray: newTodoArray});
  };

  deleteTodo = (id: string): void => {
    const {todoArray} = this.state;
    const newTodoArray = todoArray.filter(todo => todo.id !== id);
    this.setState({todoArray: newTodoArray});
  };

  handleChangeText = (text: string): void => {
    this.setState({todoInputValue: text});
  };

  handleClearText = (): void => {
    this.setState({todoInputValue: ''});
  };

  render() {
    const {todoArray, todoInputValue, isOpenModal} = this.state;
    return (
      <FlatList
        data={todoArray}
        renderItem={({item}) => (
          <Box bgColor={'white'} padding={'3'} shadow={'5'} borderRadius={'lg'}>
            <View
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}>
              <View flexDirection={'row'} alignItems={'center'}>
                <Checkbox
                  testID={item.name}
                  value={item.id}
                  isChecked={item.status === 'complete'}
                  onChange={() => {
                    const status =
                      item.status === 'complete' ? 'incomplete' : 'complete';
                    this.changeTodoStatus(item.id, status);
                  }}>
                  <Text
                    fontSize={'lg'}
                    textTransform={'capitalize'}
                    fontWeight={'semibold'}
                    color={
                      item.status === 'incomplete'
                        ? 'primary.800'
                        : 'success.800'
                    }>
                    {item.name}
                  </Text>
                </Checkbox>
              </View>
              <View flexDirection={'row'} alignItems={'center'}>
                <Button
                  testID={`edit-button-${item.name}`}
                  variant={'unstyled'}
                  onPress={() => this.setIsOpenModal(true)}>
                  <PencilSquareIcon fill={'black'} size={24} />
                </Button>
                <Button
                  testID={`delete-button-${item.name}`}
                  variant={'unstyled'}
                  padding={'0'}
                  onPress={() => this.deleteTodo(item.id)}>
                  <TrashIcon fill={'black'} size={24} />
                </Button>
              </View>
            </View>
            <TodoUpdateModal
              setIsOpen={this.setIsOpenModal}
              isOpen={isOpenModal}
              editTodo={this.editTodo}
              todo={item}
            />
          </Box>
        )}
        contentContainerStyle={styles.contentContainerStyle}
        ListHeaderComponent={
          <View style={{gap: 10}}>
            <View style={styles.todoInputContainer}>
              <Input
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
                onPress={this.handleClearText}
                variant={'ghost'}
                borderRadius={'lg'}>
                <Text fontSize={'md'}>Clear</Text>
              </Button>
            </View>
            <Button
              bgColor={'primary.800'}
              padding={'3'}
              borderRadius={'lg'}
              onPress={() => {
                if (!todoInputValue.trim()) {
                  return;
                }
                const todo: Todo = {
                  id: v4(),
                  name: todoInputValue,
                  status: 'incomplete',
                };
                this.addTodo(todo);
                this.handleClearText();
              }}>
              <Text fontWeight={'bold'} color={'white'} fontSize={'lg'}>
                ADD
              </Text>
            </Button>
          </View>
        }
        ListHeaderComponentStyle={styles.ListHeaderComponentStyle}
      />
    );
  }
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: 10,
    rowGap: 10,
    minHeight: '100%',
  },
  todoInput: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    flex: 1,
  },
  todoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ListHeaderComponentStyle: {
    marginBottom: 20,
  },
  clearButton: {
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'black',
  },
  addButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todoItem: {
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: 'white',
  },
  todoItemText: {
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
  },
});
