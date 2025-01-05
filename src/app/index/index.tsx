import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  Linking,
} from "react-native";
import { styles } from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { Categories } from "@/components/categories";
import { Link } from "@/components/link";
import { Option } from "@/components/option";
import { useState, useEffect, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { categories } from "@/utils/categories";
import { LinkStorage, linkStorage } from "@/storage/link-storage";

export default function Index() {
  const [links, setLinks] = useState<LinkStorage[]>([]);
  const [modalVisible, setModal] = useState<boolean>(false);
  const [category, setCategory] = useState(categories[0].name);
  const [link, setLink] = useState<LinkStorage>({} as LinkStorage);

  async function getLinks() {
    try {
      const response = await linkStorage.get();

      const filtered = response.filter((link) => link.category === category);
      setLinks(filtered);
      console.log(response);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível listar os links");
    }
  }

  function handleDetails(selected: LinkStorage) {
    setModal(true);
    setLink(selected);
  }

  async function linkRemove() {
    try {
      await linkStorage.remove(link.id);
      getLinks();
      setModal(false);
    } catch (error) {}
  }

  async function handleremove() {
    Alert.alert("Excluir", "Deseja realmente excluir?", [
      {
        style: "cancel",
        text: "Não",
      },
      {
        text: "Sim",
        onPress: linkRemove,
      },
    ]);
  }

  async function handleOpen(){
    try {
      await Linking.canOpenURL(link.url)
      await Linking.openURL(link.url)
     
      setModal(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o Link') 
    }
  }

  useFocusEffect(
    useCallback(() => {
      getLinks();
    }, [category])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("@/assets/logo.png")} style={styles.logo} />
        <TouchableOpacity onPress={() => router.navigate("/add")}>
          <MaterialIcons name="add" size={32} color={colors.green[300]} />
        </TouchableOpacity>
      </View>
      <Categories onChange={setCategory} selected={category} />
      <FlatList
        data={links}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link
            name={item.name}
            url={item.url}
            onDetails={() => handleDetails(item)}
          />
        )}
        style={styles.links}
        contentContainerStyle={styles.linksContent}
        showsVerticalScrollIndicator={false}
      />
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalCategory}>{link.category}</Text>
              <TouchableOpacity onPress={() => setModal(false)}>
                <MaterialIcons
                  name="close"
                  size={20}
                  color={colors.gray[400]}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalLinkName}>{link.name}</Text>
            <Text style={styles.modalUrl}>{link.url}</Text>
            <View style={styles.modalFooter}>
              <Option
                name="Excluir"
                icon="delete"
                variant="secundary"
                onPress={handleremove}
              />
              <Option name="Abrir" icon="language" onPress={handleOpen} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
