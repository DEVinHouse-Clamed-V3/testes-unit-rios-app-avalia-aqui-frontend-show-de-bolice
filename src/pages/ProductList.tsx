import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";

// Define o tipo Product com base nos dados da API
type Product = {
  id: number;
  name: string;
  brand: string;
  price: string; // O preço é uma string conforme seu db.json
  description: string;
  image: string; // URL da imagem do produto
};

// Define os parâmetros de navegação para o Stack Navigator
type RootStackParamList = {
  Home: undefined;
  ProductList: undefined;
  FeedbackForm: { productId: number };
};

// Define o tipo de navegação para a tela ProductList
type ProductListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ProductList"
>;

// Define as props do componente ProductList
type Props = {
  navigation: ProductListScreenNavigationProp;
};

const ProductList: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]); // Estado para armazenar produtos
  const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento

  // Função para buscar produtos da API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://192.168.3.5:3000/products"); // Atualize com o IP correto da sua máquina
        setProducts(response.data); // Certifique-se de definir os produtos corretamente
        setLoading(false); // Desabilita o estado de carregamento
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os produtos.");
        console.error("Error fetching products:", error); // Log do erro no console
        setLoading(false); // Mesmo com erro, remover o carregamento
      }
    };

    fetchProducts();
  }, []);

  // Função para renderizar cada produto no FlatList
  const renderProduct = ({ item }: { item: Product }) => {
    console.log(item.image); // Verificar se a URL da imagem está correta
    return (
      <View style={styles.productItem}>
        {/* Exibe a imagem do produto */}
        <Image source={{ uri: item.image }} style={styles.productImage} />
        {/* Detalhes do produto */}
        <Text style={styles.productTitle}>{item.name}</Text>
        <Text>Marca: {item.brand}</Text>
        <Text>Preço: {item.price}</Text>
        <Text>Descrição: {item.description}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("FeedbackForm", { productId: item.id })
          }
        >
          <Text style={styles.buttonText}>Avaliar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Exibe um indicador de carregamento enquanto os produtos estão sendo buscados
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1A1A1A" />
      </View>
    );
  }

  // Exibe uma mensagem de fallback caso a lista de produtos esteja vazia
  return (
    <View style={{ flex: 1 }}>
      {products.length === 0 ? (
        <Text style={styles.noProductsText}>Nenhum produto encontrado</Text>
      ) : (
        <FlatList
          data={products} // Dados da FlatList vem do array de produtos
          renderItem={renderProduct} // Função de renderização dos itens
          keyExtractor={(item) => item.id.toString()} // Chave única para cada item
        />
      )}
    </View>
  );
};

// Definindo os estilos usados no componente
const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productItem: {
    backgroundColor: "#1c1c1e", // Dark background similar to the card background in your image
    borderRadius: 15, // Rounded corners for the card
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 10, // Adding some margin on the sides
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5, // Adding shadow on Android devices
  },
  productImage: {
    width: "100%",
    height: 250, // Making the image taller to match the design
    resizeMode: "cover", // Ensuring the image covers the card fully
    borderRadius: 10, // Rounded corners for the image
  },
  productTitle: {
    color: "white", // Text color for the product name
    fontSize: 22, // Slightly larger font for prominence
    fontWeight: "bold",
    marginVertical: 10,
  },
  productDetails: {
    color: "#d1d1d1", // Lighter grey for the product details
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#fbbf24", // Bright yellow for the call-to-action (similar to the "BUY" button color in your design)
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#1c1c1e", // Dark text color for contrast with the button
    fontSize: 18,
    fontWeight: "bold",
  },
  noProductsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#d1d1d1", // Matching the empty state message with a subtle grey color
  },
});

export default ProductList;
