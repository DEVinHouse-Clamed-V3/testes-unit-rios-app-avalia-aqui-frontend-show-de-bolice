import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import ProductList from "../pages/ProductList";
import axios from "axios";

// Mock da navegação
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

// Mock da chamada axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ProductList screen", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir produtos retornados pela API", async () => {
    const mockProducts = [
      {
        id: 1,
        name: "Produto Teste",
        brand: "Marca Teste",
        price: "19.99",
        description: "Descrição teste",
        image: "https://via.placeholder.com/150",
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });

    const { getByText, getByTestId } = render(
      <ProductList navigation={{ navigate: mockNavigate }} />
    );

    await waitFor(() => {
      expect(getByText("Produto Teste")).toBeTruthy();
      expect(getByText("Marca: Marca Teste")).toBeTruthy();
      expect(getByText("Preço: 19.99")).toBeTruthy();
      expect(getByText("Descrição: Descrição teste")).toBeTruthy();
    });

    // aqui simula clique no botão de avaliar
    fireEvent.press(getByText("Avaliar"));
    expect(mockNavigate).toHaveBeenCalledWith("FeedbackForm", { productId: 1 });
  });

  it("deve mostrar indicador de carregamento", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const { getByTestId } = render(
      <ProductList navigation={{ navigate: mockNavigate }} />
    );

    expect(getByTestId("activity-indicator")).toBeTruthy();
    await waitFor(() => {});
  });

  it("deve exibir mensagem quando nenhum produto for encontrado", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const { getByText } = render(
      <ProductList navigation={{ navigate: mockNavigate }} />
    );

    await waitFor(() => {
      expect(getByText("Nenhum produto encontrado")).toBeTruthy();
    });
  });

  it("deve exibir alerta em caso de erro na API", async () => {
    const alertSpy = jest.spyOn(global, "alert").mockImplementation(() => {});
    mockedAxios.get.mockRejectedValueOnce(new Error("Erro na API"));

    render(<ProductList navigation={{ navigate: mockNavigate }} />);
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
    });
  });
});
