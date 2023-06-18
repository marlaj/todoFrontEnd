import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Platform, Button } from 'react-native';
import Task from './components/task';
import Comp from './components/comp';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_IP = '192.168.1.4:8000';

type RootStackParamList = {
  Home: { email: string };
};

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  route: HomeScreenRouteProp;
}

const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

const HomeScreen: React.FC<HomeScreenProps> = ({ route }) => {
  const [email, setEmail] = useState('');
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState<string[]>([]);
  const [compItems, setCompItems] = useState<string[]>([]);
  

  useEffect(() => {
    setEmail(route.params.email);
    console.log(email);
    handleTasks();
    handleComps();
  }, [email]);

  const handleTasks = () => {
    const userData = {
      email: email,
    };
  
    fetch(`http://${SERVER_IP}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Request failed');
        }
        return response.json();
      })
      .then((data) => {
        if (data.tasks) {
          setTaskItems(data.tasks);
          console.log('Tasks retrieved successfully:', data.tasks);
        }
      })
      .catch((error) => {
        //
      });
  };
  
  const handleComps = () => {
    const userData = {
      email: email,
    };
  
    fetch(`http://${SERVER_IP}/comps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Request failed');
        }
        return response.json();
      })
      .then((data) => {
        if (data.tasks) {
          setCompItems(data.tasks);
          console.log('Tasks retrieved successfully:', data.tasks);
        }
      })
      .catch((error) => {
        //
      });
  };

  const handleAddTask = () => {
    if (task.trim()) {
      setTaskItems([...taskItems, task]);
      setTask('');
  
      const userData = {
        email: email,
        task: task,
      };
  
      fetch(`http://${SERVER_IP}/addtasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the server response if needed
          console.log("added");
        })
        .catch((error) => {
          console.error('Adding task failed:', error);
        });
    }
  };
  

  const completeTask = (index: number, taskText: string) => {
    // Create a copy of the taskItems array
    const itemsCopy = [...taskItems];
    // Remove the task at the specified index
    itemsCopy.splice(index, 1);
    // Update the state with the modified taskItems and the completed task
    setTaskItems(itemsCopy);
    setCompItems([...compItems, taskText]);

    const compData = {
      email: email,
      taskText: taskText,
    };
    
    //sends a request to the server to change task status to completed
    
    // Send a request to the server to change the task status to completed
    fetch(`http://${SERVER_IP}/tasks/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(compData),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Request failed');
      }
      console.log('Task completed successfully');
    })
    .catch((error) => {
      console.error('Completing task failed', error);
    });
  };
  

  const deleteTask = (index: number, taskText: string) => {
    const compCopy = [...compItems];
    compCopy.splice(index, 1);
    setCompItems(compCopy);
    // Create a payload object containing the task information
    const taskData = {
      email: email,
      taskText: taskText,
    };
    // Send a request to the server to delete the task from the user
    fetch(`http://${SERVER_IP}/deleteTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Request failed');
        }
        console.log('Task deleted successfully');
      })
      .catch((error) => {
        console.error('Deleting task failed', error);
      });
  };

  
  const navigation = useNavigation();
  const LogOut = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('email');
    navigation.navigate('Login');
  };

  return (
    <View style={componentStyles.container}>
      <ScrollView contentContainerStyle={componentStyles.scrollViewContent}>
        
        <View style={componentStyles.taskWrapper}>
        <View style={componentStyles.LogOut}>
          <Button title="LogOut" onPress={LogOut} />
        </View>

          <Text style={componentStyles.sectionTitle}>Your Tasks</Text>

          <KeyboardAvoidingView behavior={keyboardBehavior} style={componentStyles.writeTaskWrapper}>
            <TextInput style={componentStyles.input} placeholder={'Add a task'} value={task} onChangeText={text => setTask(text)}/>
            <TouchableOpacity onPress={() => handleAddTask()}>
              <View style={componentStyles.addWrapper}>
                <Text style={componentStyles.addText}>+</Text> 
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>


          
          <View style={componentStyles.items}>
            {
                taskItems.map((item,index) => {
                    return(
                        <TouchableOpacity key={index}  onPress={() => completeTask(index,item)}>
                            <Task text={item} /> 
                        </TouchableOpacity>
                    )
                })
            }
          </View>
          <Text style={componentStyles.sectionTitle}>Completed</Text>
          <View style={componentStyles.items}>
            {
                compItems.map((item,index) => {
                    return(
                        <TouchableOpacity key={index} onPress={() => deleteTask(index,item)}>
                            <Comp text={item} /> 
                        </TouchableOpacity>
                    )
                })
            }
          </View>
        </View>
      </ScrollView>
    </View>
  );
  
};

const componentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C4E0E5',
  },
  taskWrapper: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  items: {
    marginTop: 30,
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  writeTaskWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  addText: {
    fontSize: 20
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  LogOut: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
  }
});

export default HomeScreen;