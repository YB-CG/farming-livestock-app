import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../contexts/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PersonalInfoScreen from '../screens/PersonalInfoScreen';
import FarmInfoScreen from '../screens/FarmInfoScreen';
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LivestockListScreen from '../screens/LivestockListScreen';
import LivestockProfileScreen from '../screens/LivestockProfileScreen';
import AddLivestockScreen from '../screens/AddLivestockScreen';
import InventoryScreen from '../screens/InventoryScreen';
import TasksScreen from '../screens/TasksScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import UpdateTaskScreen from '../screens/UpdateTaskScreen';
import AddInventoryScreen from '../screens/AddInventoryScreen';
import InventoryDetailScreen from '../screens/InventoryDetailScreen';
import UpdateInventoryScreen from '../screens/UpdateInventoryScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { state } = useContext(AuthContext);

  if (state.isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {state.userToken == null ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            {/* <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
            <Stack.Screen name="FarmInfo" component={FarmInfoScreen} /> */}
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainStack = createStackNavigator();

const MainNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name='Settings' component={SettingsScreen} />
      <MainStack.Screen name='Livestock' component={LivestockListScreen} />
      <MainStack.Screen name='LivestockProfile' component={LivestockProfileScreen} />
      <MainStack.Screen name='AddLivestock' component={AddLivestockScreen} />
      <MainStack.Screen name='Inventory' component={InventoryScreen} />
      <MainStack.Screen name='Tasks' component={TasksScreen} />
      <MainStack.Screen name='AddTask' component={AddTaskScreen} />
      <MainStack.Screen name='Profile' component={ProfileScreen} />
      <MainStack.Screen name='EditProfile' component={EditProfileScreen} />
      <MainStack.Screen name='ChangePassword' component={ChangePasswordScreen} />
      <MainStack.Screen name='TaskDetail' component={TaskDetailScreen} />
      <MainStack.Screen name='UpdateTask' component={UpdateTaskScreen} />
      <MainStack.Screen name='AddInventory' component={AddInventoryScreen} />
      <MainStack.Screen name='InventoryDetail' component={InventoryDetailScreen} />
      <MainStack.Screen name='UpdateInventory' component={UpdateInventoryScreen} />


      
      {/* <MainStack.Screen name="PersonalInfo" component={PersonalInfoScreen} /> */}
      {/* <MainStack.Screen name="FarmInfo" component={FarmInfoScreen} /> */}
    </MainStack.Navigator>
  );
};

export default AppNavigator;