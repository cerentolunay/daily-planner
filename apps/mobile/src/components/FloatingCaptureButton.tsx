import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors } from "../constants/colors";

export function FloatingCaptureButton() {
  const [open, setOpen] = useState(false);

  function go(path: string) {
    setOpen(false);
    router.push(path as never);
  }

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      {open ? (
        <View style={styles.menu}>
          <Pressable onPress={() => go("/inbox")} style={styles.menuItem}><Text style={styles.menuText}>Yaz</Text></Pressable>
          <Pressable onPress={() => go("/inbox")} style={styles.menuItem}><Text style={styles.menuText}>Yapıştır</Text></Pressable>
          <Pressable onPress={() => go("/share-capture?mode=url")} style={styles.menuItem}><Text style={styles.menuText}>Link Ekle</Text></Pressable>
          <Pressable onPress={() => go("/inbox")} style={styles.menuItem}><Text style={styles.menuText}>Inbox’a Git</Text></Pressable>
        </View>
      ) : null}
      <Pressable onPress={() => setOpen((value) => !value)} style={styles.button}>
        <Text style={styles.plus}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    right: 18,
    bottom: 88,
    alignItems: "flex-end",
    gap: 10,
  },
  menu: {
    width: 190,
    borderRadius: 24,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderColor: colors.border,
    borderWidth: 1,
    elevation: 4,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  menuText: {
    color: colors.purple,
    fontWeight: "900",
  },
  button: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.yellow,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  plus: {
    color: colors.purple,
    fontSize: 34,
    fontWeight: "900",
    marginTop: -2,
  },
});
