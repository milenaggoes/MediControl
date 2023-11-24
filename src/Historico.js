import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://abcd-e8b67-default-rtdb.asia-southeast1.firebasedatabase.app',
});

const Historico = () => {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/historico.json');
        const data = response.data;

        if (data) {
         
          const listaHistorico = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          setHistorico(listaHistorico);
        }
      } catch (error) {
        console.error('Erro ao buscar dados');
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
    
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.historicoItem}>
            <View>
                <Text style={{marginBottom:10}}>Retirada: {item.nomeRemedio}</Text>
                <Text>Por: {item.nomeFuncionario}</Text>
            </View>
            <View >
                <Text style={{textAlign:'right', marginBottom:10}}>{item.quantidadeRetirada} unidades</Text>
                <Text>{item.data} ás {item.hora}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginVertical: 15
  },
  historicoItem: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 25,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
});

export {Historico} ;
