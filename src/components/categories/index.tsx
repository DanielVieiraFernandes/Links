import { FlatList } from "react-native";
import { styles } from "./styles";
import { categories } from "@/utils/categories";
import { Category } from "../category";

type Props = {
  selected: string;
  onChange: (category:string) => void; 
}

export function Categories({onChange,selected}:Props) {
  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Category
         name={item.name} 
         icon={item.icon}
         isSelected={item.name === selected}
         onPress={() => onChange(item.name)}
          />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    />
  );
}
