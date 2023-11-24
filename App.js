import { useState } from "react";
import {
  TouchableOpacity,
  Text,
  TextInput,
  View,
  ImageBackground,
  StatusBar
} from "react-native";
import { Menu } from "./src/Menu";
import axios from "axios";

const APIKEY = "AIzaSyDAZ7eSOV1NFbz7142I0I0HbEDywVcpsko";

const apiLogin = axios.create({
  baseURL: "https://identitytoolkit.googleapis.com/v1",
});

export default function App() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("milena@gmail.com");
  const [password, setPassword] = useState("123456");

  const registrar = () => {
    apiLogin
      .post("/accounts:signUp?key=" + APIKEY, {
        email,
        password,
        returnSecureToken: true,
      })
      .then((resposta) => {
        setToken(resposta.data.idToken);
      })
      .catch((err) => alert("Digite um e-mail válido"));
  };

  const login = () => {
    apiLogin
      .post("/accounts:signInWithPassword?key=" + APIKEY, {
        email,
        password,
        returnSecureToken: true,
      })
      .then((resposta) => {
        setToken(resposta.data.idToken);
      })
      .catch((err) => alert("E-mail ou senha incorretos"));
  };

  return (
    <View style={{ flex: 1 }}>
     
      {token ? ( 
        <Menu />
      ) : (
        <View style={{ flex: 1 }}>

          <View style={{flex: 3}}>
            <ImageBackground source={require("./assets/banner.jpg")}
              style={{
                flex: 1,
                width: "100%",
                justifyContent: "center",
              }}/>
          </View>

          <View
            style={{
              flex: 7,
              paddingHorizontal: 15,
              gap: 40,
              paddingVertical: 20
            }}
          >
            <Text
              style={{
                fontSize: 30,
                color: "#000",
                fontWeight: "500",
                textAlign: "center",
              }}>
              MediControl
            </Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Faça Login ou Cadastre-se para continuar
            </Text>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={{
                backgroundColor: "#DCDCDC",
                borderRadius: 20,
                paddingVertical: 7,
                paddingLeft: 25,
              }}
            />
            <TextInput
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              style={{
                backgroundColor: "#DCDCDC",
                borderRadius: 20,
                paddingVertical: 7,
                paddingLeft: 28,
              }}
            />
            <TouchableOpacity
              style={{
                width: "100%",
                paddingVertical: 14,
                backgroundColor: "#79ADE6",
                borderRadius: 20,
                alignItems: "center",
                marginTop: 34,
              }}
              onPress={login}
            >
              <Text style={{ fontSize: 16, color: "#fff", fontWeight: 500 }}>
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                
                alignItems: "center",
                marginBottom: 24,
              }}
              onPress={registrar}
            >
              <Text style={{ fontSize: 15, color: "#000", textDecorationLine: 'underline'}}>
                Cadastre-se
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
