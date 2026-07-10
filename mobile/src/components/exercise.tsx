import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  name: string;
  group: string;
  secoundGroup: string;
  thumbnailUrl: string;
  gifUrl: string;
  desc: string;
  isSelected: boolean;
  onSelect?: () => void;
};

function ExerciseContent({
  name,
  group,
  secoundGroup,
  thumbnailUrl,
  gifUrl,
  desc,
  isSelected,
  onSelect,
}: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fallback = "https://placehold.co/112x112/EEF1FF/2B54FF?text=Ex";

  return (
    <>
      <TouchableOpacity 
        style={isSelected ? styles.isSelected : styles.card}
        onPress={onSelect}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: thumbnailUrl || fallback }}
          style={styles.thumbnail}
          contentFit="cover"
          cachePolicy="disk"
          transition={100}
          recyclingKey={thumbnailUrl}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.groupBadge}>
            <Text style={styles.groupBadgeText}>{group}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.questionButton}
          onPress={() => setIsModalVisible(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <AntDesign name="question" size={20} color="#2B54FF" />
        </TouchableOpacity>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsModalVisible(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="x" size={22} color="#1A1A1A" />
            </TouchableOpacity>

            {/* gif animado só existe na árvore quando o modal está aberto */}
            {isModalVisible && (
              <Image
                source={{ uri: gifUrl || fallback }}
                style={styles.expandedGif}
                contentFit="contain"
                cachePolicy="disk"
                transition={150}
              />
            )}

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            
            >
              <Text style={styles.modalName}>{name}</Text>

              <View style={styles.groupRow}>
                <View style={styles.groupBadgeLarge}>
                  <Text style={styles.groupBadgeLargeText}>{group}</Text>
                </View>
                {secoundGroup ? (
                  <View
                    style={[styles.groupBadgeLarge, styles.groupBadgeSecondary]}
                  >
                    <Text
                      style={[
                        styles.groupBadgeLargeText,
                        styles.groupBadgeSecondaryText,
                      ]}
                    >
                      {secoundGroup}
                    </Text>
                  </View>
                ) : null}
              </View>

              <Text style={styles.sectionLabel}>Como executar</Text>
              <Text style={styles.description}>{desc}</Text>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

export default React.memo(ExerciseContent);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 10,
    gap: 12,
    borderWidth: 1,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#E5E7EB",
  },
  isSelected: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF1FF",
    padding: 10,
    gap: 12,
    borderWidth: 3,
    borderColor: "#2B54FF",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
  },
  infoContainer: { flex: 1, gap: 4 },
  name: { fontSize: 14, fontWeight: "700", color: "#1A1A1A" },
  groupBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF1FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  groupBadgeText: { fontSize: 11, fontWeight: "600", color: "#2B54FF" },
  questionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  expandedGif: {
    width: "100%",
    height: 260,
    backgroundColor: "#F5F5F5",
  },
  modalScroll: { padding: 20, flexShrink: 1 },
  modalName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  groupRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  groupBadgeLarge: {
    backgroundColor: "#EEF1FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  groupBadgeLargeText: { fontSize: 13, fontWeight: "600", color: "#2B54FF" },
  groupBadgeSecondary: { backgroundColor: "#F5F5F5" },
  groupBadgeSecondaryText: { color: "#8A8A8A" },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4A4A4A",
    paddingBottom: 20,
    
  },
});
