import React from 'react';
import { View, Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Screens
import MainScreen from './src/screens/MainScreen/MainScreen.js';

//Components
import Header from './src/components/Header/Header.js';
import Menu from './src/components/Menu/Menu.js';

//Styles
import { commonStyle } from './src/stylesheet/indexStyle.js';



const MainBgGradient = () => (
  <Image
  source={require('./src/assets/images/main-bg-gradient.png')}
  style={commonStyle.MainBgGradient}
  ></Image>
);

const Stack = createNativeStackNavigator();



function App() {

  return (
    <View style={commonStyle.body}>
      <Header/>
      <Menu/>
      <NavigationContainer>
        <Stack.Navigator
        initialRouteName="main"
        screenOptions={{headerShown: false}}
        >
          <Stack.Screen name="main" component={MainScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <MainBgGradient />
    </View>
  );

}



export default App;