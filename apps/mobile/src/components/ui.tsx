import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { colors } from "../constants/colors";

export function Card({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({
  children,
  onPress,
  variant = "primary",
  disabled,
}: {
  children: ReactNode;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, variant === "secondary" && styles.secondaryButton, variant === "ghost" && styles.ghostButton, disabled && styles.disabled]}
    >
      <Text style={[styles.buttonText, variant === "secondary" && styles.secondaryText]}>{children}</Text>
    </Pressable>
  );
}

export function Input(props: TextInputProps) {
  return <TextInput placeholderTextColor="rgba(93,84,145,0.48)" style={styles.input} {...props} />;
}

export function Textarea(props: TextInputProps) {
  return <TextInput placeholderTextColor="rgba(93,84,145,0.48)" multiline textAlignVertical="top" style={[styles.input, styles.textarea]} {...props} />;
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <Card style={styles.empty}>
      <Text style={styles.emptyIcon}>✨</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </Card>
  );
}

export function LoadingState({ text = "Yükleniyor..." }: { text?: string }) {
  return <Text style={styles.muted}>{text}</Text>;
}

export function ErrorState({ text }: { text: string }) {
  return <Text style={styles.error}>{text}</Text>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 26,
    padding: 18,
    shadowColor: colors.purple,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 3,
  },
  button: {
    backgroundColor: colors.yellow,
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: colors.purple,
  },
  ghostButton: {
    backgroundColor: "rgba(255,255,255,0.62)",
    borderColor: "rgba(93,84,145,0.22)",
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: colors.purple,
    fontWeight: "900",
  },
  secondaryText: {
    color: colors.white,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderColor: "rgba(93,84,145,0.18)",
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.purple,
    fontWeight: "700",
  },
  textarea: {
    minHeight: 130,
  },
  empty: {
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 28,
  },
  emptyTitle: {
    marginTop: 8,
    color: colors.purple,
    fontSize: 18,
    fontWeight: "900",
  },
  emptyText: {
    marginTop: 6,
    color: colors.muted,
    textAlign: "center",
    fontWeight: "700",
    lineHeight: 20,
  },
  muted: {
    color: colors.muted,
    fontWeight: "800",
  },
  error: {
    color: colors.purple,
    backgroundColor: "rgba(255,210,48,0.5)",
    borderRadius: 16,
    padding: 12,
    fontWeight: "800",
  },
});
