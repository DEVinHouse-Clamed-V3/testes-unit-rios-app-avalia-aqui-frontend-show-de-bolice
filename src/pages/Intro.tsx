import { View, Text, Button, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Intro: undefined;
  ProductList: undefined;
};

type IntroScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Intro"
>;

type Props = {
  navigation: IntroScreenNavigationProp;
};

const Intro: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Avalia Aqui</Text>
      <Text style={styles.subtitle}>
        Avalie produtos de forma simples e rápida!
      </Text>
      <Button
        title="Começar"
        onPress={() => navigation.navigate("ProductList")}
        testID="start-button"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
});

export default Intro;
