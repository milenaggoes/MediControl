import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const api = axios.create({
  baseURL: 'https://abcd-e8b67-default-rtdb.asia-southeast1.firebasedatabase.app',
});

const MedicamentoItem = (props) => {

  return (
    <View style={styles.containerItem}>
        
      <View style={{ gap: 25, height: 250, shadowColor: 'black', justifyContent: 'center', alignItems: 'center',paddingHorizontal: 5}}>
      <Image
          source={{ uri: props.item.url }}
          style={{ width: 90, height: 110 }}
        />
        <Text style={{ fontSize: 18, fontWeight: '500' }}>{props.item.nome}</Text>
        <Text style={{ fontSize: 15,textAlign: 'center' }}>{props.item.descricao}</Text>
        <Text style={{ fontSize: 15 }}>Unidades disponíveis: {props.item.quantidade}</Text>
      </View>

      <View style={{marginTop: 35, alignItems: 'center', gap:60, flexDirection: 'row'}}>
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
  const [url, setUrl] = useState('');
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
        alert('Erro ao exibir medicamentos em estoque');
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
    setUrl(obj.url);
    setNome(obj.nome);
    setDescricao(obj.descricao);
    setQuantidade(obj.quantidade),
    setId(obj.id);
  };

  const limparCampos = () => {
    setUrl('');
    setNome('');
    setDescricao('');
    setQuantidade('');
    setId(null);
  };

  const salvarMedicamento = () => {
    
    if (id) {
      api.put('/medicamentos/'+ id +'.json', { url, nome, descricao,quantidade })
        .then(() => {
          limparCampos();
          lerMedicamentos();
        })
        .catch(() => {
          alert('Erro ao atualizar dados do medicamento');
        });
    } else {
      api.post('/medicamentos.json',{url,nome, descricao, quantidade })
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
      <View style={{flex: 4,justifyContent: 'space-evenly', paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 15, textAlign: 'center'}}>
          Cadastre um medicamento no estoque
        </Text>
        <TextInput
          placeholder="Endereço da imagem"
          value={url}
          onChangeText={setUrl}
          style={styles.campoCadastro}
        />
        
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
        paddingVertical: 5,
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
        backgroundColor: '#fff',
        borderRadius: 5,
        margin: 15,
        padding: 15,
        alignItems: 'center',
        elevation: 10
      }
})

export { Medicamento };
