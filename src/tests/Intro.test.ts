import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Intro from '../pages/Intro';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

describe('Intro Screen', () => {
  it('deve renderizar título e botão', () => {
    const { getByText, getByTestId } = render(
      <Intro navigation={{ navigate: mockNavigate }} />
    );

    expect(getByText('Bem-vindo ao Avalia Aqui')).toBeTruthy();
    expect(getByText('Avalie produtos de forma simples e rápida!')).toBeTruthy();
    expect(getByTestId('start-button')).toBeTruthy();
  });

  it('deve navegar para a tela de produtos ao clicar em "Começar"', () => {
    const { getByTestId } = render(
      <Intro navigation={{ navigate: mockNavigate }} />
    );

    fireEvent.press(getByTestId('start-button'));

    expect(mockNavigate).toHaveBeenCalledWith('ProductList');
  });
});