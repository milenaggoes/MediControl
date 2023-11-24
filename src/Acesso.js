import React, { useState } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const api = axios.create({
  baseURL: 'https://abcd-e8b67-default-rtdb.asia-southeast1.firebasedatabase.app',
});

const FuncionarioItem = (props) => {
  return (
    <View style={styles.containerItem}>
        
      <View style={{ gap: 10, width: 180, shadowColor: 'black'}}>
        <Text style={{ fontSize: 15, fontWeight: '500' }}>{props.item.nome}</Text>
        <Text style={{ fontSize: 15 }}>{props.item.cargo}</Text>
        <Text style={{ fontSize: 15 }}>{props.item.identificacao}</Text>
      </View>

      <View style={{ alignItems: 'center', justifyContent: 'space-between', gap:15 }}>
        <TouchableOpacity
          onPress={() => {
            props.onEditar(props.item);
          }}>
          <AntDesign name="edit" size={25} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.onApagar(props.item);
          }}>
          <MaterialIcons name="delete-outline" size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Funcionario = () => {
  const [id, setId] = useState(null);
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [identificacao, setiIdentificacao] = useState('');
  const [lista, setLista] = useState([]);

  const apagar = (obj) => {
    api
      .delete('/funcionarios/' + obj.id + '.json')
      .then(() => {
        lerFuncionarios();
      })
      .catch(() => {
        alert('Erro ao apagar acesso');
      });
  };

  const editar = (obj) => {
    setNome(obj.nome);
    setCargo(obj.cargo);
    setiIdentificacao(obj.identificacao);
    setId(obj.id);
  };

  const limparCampos = () => {
    setNome('');
    setCargo('');
    setiIdentificacao('');
    setId(null);
  };

  const lerFuncionarios = () => {
    api
      .get('/funcionarios.json')
      .then((resposta) => {
        const listaNova = [];
        for (const chaveFuncionario in resposta.data) {
          const obj = resposta.data[chaveFuncionario];
          obj.id = chaveFuncionario;
          listaNova.push(obj);
        }
        setLista(listaNova);
      })
      .catch(() => {
        alert('Deu erro');
      });
  };

  const salvarFuncionario = () => {
    if (id) {
      api
        .put('/funcionarios/' + id + '.json', { nome, cargo, identificacao })
        .then(() => {
          limparCampos();
          lerFuncionarios();
        })
        .catch(() => {
          alert('Erro ao atualizar dados do funcionario');
        });
    } else {
      api
        .post('/funcionarios.json', { nome, cargo, identificacao })
        .then(() => {
          limparCampos();
          lerFuncionarios();
        })
        .catch(() => {
          alert('Erro ao gravar dados de funcionario');
        });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, justifyContent: 'space-evenly', paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 15, textAlign: 'center'}}>
          Cadastre um funcionário para que ele tenha acesso aos medicamentos
        </Text>

        <TextInput
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
          style={styles.campoCadastro}
        />
        <TextInput
          placeholder="Cargo"
          value={cargo}
          onChangeText={setCargo}
          style={styles.campoCadastro}
        />
        <TextInput
          placeholder="N° Identificação"
          value={identificacao}
          onChangeText={setiIdentificacao}
          style={styles.campoCadastro}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity
            style={styles.botaoCadastro}
            onPress={salvarFuncionario}>
            <Text style={{ fontSize: 15, color: '#fff', fontWeight: '600' }}>
              Adicionar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoCadastro}
            onPress={lerFuncionarios}>
            <Text style={{ fontSize: 15, color: '#fff', fontWeight: '600' }}>
              Ver Acessos
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1, backgroundColor: '#F2F2F2' }}>
        <FlatList
          data={lista}
          renderItem={(prp) => (
            <FuncionarioItem {...prp} onApagar={apagar} onEditar={editar} />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    campoCadastro:{
        backgroundColor: '#DCDCDC',
        borderRadius: 8,
        paddingVertical: 7,
        paddingLeft: 25,
    },
    botaoCadastro:{
        width: 160,
        paddingVertical: 10,
        backgroundColor: '#79ADE6',
        borderRadius: 8,
        alignItems: 'center',
    },
    containerItem:{
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 5,
        margin: 15,
        padding: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 10
      }
})

export { Funcionario };
