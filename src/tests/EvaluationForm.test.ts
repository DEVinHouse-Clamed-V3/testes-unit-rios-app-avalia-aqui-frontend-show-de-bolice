import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import FeedbackForm from "../pages/FeedbackForm";
import axios from "axios";
import { Alert } from "react-native";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock de navegação
const mockNavigate = jest.fn();
const mockRoute = { params: { productId: 1 } };

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => mockRoute,
}));

describe("FeedbackForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar os campos corretamente", () => {
    const { getByPlaceholderText, getByText } = render(
      <FeedbackForm navigation={{ navigate: mockNavigate }} route={mockRoute} />
    );

    expect(getByPlaceholderText("Seu nome")).toBeTruthy();
    expect(getByPlaceholderText("Seu e-mail")).toBeTruthy();
    expect(getByPlaceholderText("Descreva sua experiência")).toBeTruthy();
    expect(getByText("Como foi sua experiência?")).toBeTruthy();
    expect(getByText("Recomendaria para outras pessoas?")).toBeTruthy();
  });

  it("deve mostrar alerta se o formulário estiver incompleto", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    const { getByText } = render(
      <FeedbackForm navigation={{ navigate: mockNavigate }} route={mockRoute} />
    );

    fireEvent.press(getByText("Enviar Feedback"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Erro",
        "Preencha todos os campos."
      );
    });
  });

  it("deve enviar o formulário com dados válidos", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");

    mockedAxios.post.mockResolvedValueOnce({ data: {} });

    const { getByPlaceholderText, getByText } = render(
      <FeedbackForm navigation={{ navigate: mockNavigate }} route={mockRoute} />
    );

    fireEvent.changeText(getByPlaceholderText("Seu nome"), "João");
    fireEvent.changeText(getByPlaceholderText("Seu e-mail"), "joao@email.com");
    fireEvent.changeText(
      getByPlaceholderText("Descreva sua experiência"),
      "Foi ótimo!"
    );
    fireEvent.press(getByText("Feliz"));
    fireEvent.press(getByText("Sim"));

    fireEvent.press(getByText("Enviar Feedback"));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith(
        "Sucesso",
        "Feedback enviado com sucesso!"
      );
      expect(mockNavigate).toHaveBeenCalledWith("Home");
    });
  });

  it("deve exibir alerta em caso de erro no envio", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");

    mockedAxios.post.mockRejectedValueOnce(new Error("Erro no envio"));

    const { getByPlaceholderText, getByText } = render(
      <FeedbackForm navigation={{ navigate: mockNavigate }} route={mockRoute} />
    );

    fireEvent.changeText(getByPlaceholderText("Seu nome"), "Maria");
    fireEvent.changeText(getByPlaceholderText("Seu e-mail"), "maria@email.com");
    fireEvent.changeText(
      getByPlaceholderText("Descreva sua experiência"),
      "Foi péssimo!"
    );
    fireEvent.press(getByText("Ruim"));
    fireEvent.press(getByText("Não"));

    fireEvent.press(getByText("Enviar Feedback"));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith(
        "Erro",
        "Ocorreu um erro ao enviar o feedback."
      );
    });
  });
});
