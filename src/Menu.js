import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { Funcionario } from './Acesso';
import { Medicamento } from './Estoque';
import { MaterialCommunityIcons} from '@expo/vector-icons';
import { Fontisto} from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const Menu = () => {

  return (
    <View style={{ flex: 1 }}>
     
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Acesso"
            component={Funcionario}
            options={{
              headerShown: false,
              tabBarIcon: (props) => <MaterialCommunityIcons
              name="account-key" {...props} />,
            }}
          />
          <Tab.Screen
            name="Estoque"
            component={Medicamento}
            options={{
              headerShown: false,
              tabBarIcon: (props) => <Fontisto
              name="pills" {...props} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

export { Menu };
