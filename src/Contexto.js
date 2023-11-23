import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const Contexto = createContext();

const api = axios.create({
  baseURL: 'https://medicontrol-2b05c-default-rtdb.firebaseio.com',
});

export const Provider = ({ children }) => {
  const [lista, setLista] = useState([]);


  const lerPaletas = () => {
    api
      .get('/paletas.json')
      .then((resposta) => {
        const listaNova = [];
        for (const chavePaleta in resposta.data) {
          const obj = resposta.data[chavePaleta];
          obj.id = chavePaleta;
          listaNova.push(obj);
        }
        setLista(listaNova);
      })
      .catch(() => {
        alert('Deu erro');
      });
  };

  useEffect(() => {
    lerPaletas();
  }, []);

  const contextValue = { lista, lerPaletas };

  return (
    <Contexto.Provider value={contextValue}>
      {children}
    </Contexto.Provider>
  );
};

export const useContexto = () => {
  return useContext(Contexto);
};
