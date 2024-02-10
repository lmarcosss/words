import React, {useCallback, useContext} from 'react';
import {createContext, useState} from 'react';

type DefaultValueType = {
  history: string[];
  addWordToHistory(word: string): void;
};

const defaultValue = {} as DefaultValueType;

const HistoryContext = createContext(defaultValue);

type HistoryContextProviderProps = {
  children: JSX.Element;
};

export function HistoryContextProvider({
  children,
}: HistoryContextProviderProps) {
  const [history, setHistory] = useState<string[]>([]);

  const addWordToHistory = useCallback(
    (newWord: string) => {
      const newHistory = history.filter(item => item !== newWord);
      newHistory.unshift(newWord);

      setHistory(newHistory);
    },
    [history],
  );

  return (
    <HistoryContext.Provider
      value={{
        history,
        addWordToHistory,
      }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistoryContext() {
  const context = useContext(HistoryContext);

  if (!context) {
    throw new Error(
      'useHistoryContext must be used within the scope of HistoryContextProvider',
    );
  }

  return context;
}