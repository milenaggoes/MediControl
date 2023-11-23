import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Picker
} from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const api = axios.create({
  baseURL: 'https://medicontrol-2b05c-default-rtdb.firebaseio.com',
});

const MedicamentoItem = (props) => {
  return (
    <View style={styles.containerItem}>
        
      <View style={{ gap: 10, width: 180,shadowColor: 'black'}}>
        <Text style={{ fontSize: 15, fontWeight: '500' }}>{props.item.nome}</Text>
        <Text style={{ fontSize: 15 }}>{props.item.descricao}</Text>
        <Text style={{ fontSize: 15 }}>{props.item.quantidade}</Text>
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

const Medicamento = () => {
  const [id, setId] = useState(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [lista, setLista] = useState([]);

  const lerMedicamentos = () => {
    api
      .get('/medicamentos.json')
      .then((resposta) => {
        const listaNova = [];
        for (const chaveMedicamento in resposta.data) {
          const obj = resposta.data[chaveMedicamento];
          obj.id = chaveMedicamento;
          listaNova.push(obj);
        }
        setLista(listaNova);
      })
      .catch(() => {
        alert('Erro ao exibir produtos em estoque');
      });
  };

  const apagar = (obj) => {
    api
      .delete('/medicamentos/' + obj.id + '.json')
      .then(() => {
        lerMedicamentos();
      })
      .catch(() => {
        alert('Erro ao apagar medicamento do estoque');
      });
  };

  const editar = (obj) => {
    setNome(obj.nome);
    setDescricao(obj.descricao);
    setQuantidade(obj.quantidade),
    setId(obj.id);
  };

  const limparCampos = () => {
    setNome('');
    setDescricao('');
    setQuantidade('');
    setId(null);
  };

  const salvarMedicamento = () => {
    
    if (id) {
      api.put('/medicamentos/'+ id +'.json', { nome, descricao,quantidade })
        .then(() => {
          limparCampos();
          lerMedicamentos();
        })
        .catch(() => {
          alert('Erro ao atualizar dados do medicamento');
        });
    } else {
      api.post('/medicamentos.json',{nome, descricao, quantidade })
        .then(() => {
          limparCampos();
          lerMedicamentos();
          alert('Medicamento gravado com sucesso!');
        })
        .catch(() => {
          alert('Erro ao gravar dados de medicamento');
        });
    }
  };

  useEffect(() => {
    lerMedicamentos();
  }, []);

  return (

    <View style={{ flex: 1, backgroundColor: '#fff' }}>     
      <View style={{flex: 4,justifyContent: 'space-evenly', padding: 10 }}>
        <Text style={{ fontSize: 15, textAlign: 'center', marginTop: 20 }}>
          Cadastre um medicamento no estoque
        </Text>
        <View style={{flexDirection: 'row', gap:7}}>
        <TextInput
          placeholder="Nome "
          value={nome}
          onChangeText={setNome}
          style={[styles.campoCadastro, { width: 233 }]}

        />
        
        <TextInput
          placeholder="Quantidade"
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType='numeric'
          style={[styles.campoCadastro, { width: 100, textAlign: 'center',paddingLeft: 0 }]}
        />
  	    </View>
        <TextInput
          placeholder="Descricao"
          value={descricao}
          onChangeText={setDescricao}
          style={styles.campoCadastro}
        />


        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity
            style={styles.botaoCadastro}
            onPress={salvarMedicamento}>
            <Text style={{ fontSize: 15, color: '#fff', fontWeight: '600' }}>
              Adicionar ao estoque
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    
      <View style={{flex: 6, backgroundColor: '#F2F2F2' }}>
        <FlatList nestedScrollEnabled={true} 
          data={lista}
          renderItem={(prp) => (
            <MedicamentoItem {...prp} onApagar={apagar} onEditar={editar} />
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

export { Medicamento };
