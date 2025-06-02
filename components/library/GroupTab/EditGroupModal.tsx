import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from "react-native";
import { Group } from "@/types/group";

interface EditGroupFormData {
    name: string;
    description?: string;
}

interface EditGroupModalProps {
    visible: boolean;
    group: Group | null;
    onClose: () => void;
    onSubmit: (data: EditGroupFormData) => void;
}

const EditGroupModal: React.FC<EditGroupModalProps> = ({
    visible,
    group,
    onClose,
    onSubmit,
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (group) {
            setName(group.name || "");
            setDescription(group.description || "");
        }
    }, [group]);

    const handleSubmit = () => {
        if (!name.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập tên nhóm");
            return;
        }

        onSubmit({
            name: name.trim(),
            description: description.trim() || undefined,
        });
    };

    const handleClose = () => {
        setName("");
        setDescription("");
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleClose}>
                        <Text style={styles.cancelText}>Hủy</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Chỉnh sửa nhóm</Text>
                    <TouchableOpacity onPress={handleSubmit}>
                        <Text style={styles.saveText}>Lưu</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Tên nhóm *</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Nhập tên nhóm"
                            placeholderTextColor="#999"
                            maxLength={50}
                        />
                        <Text style={styles.characterCount}>{name.length}/50</Text>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Mô tả</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Nhập mô tả nhóm (tùy chọn)"
                            placeholderTextColor="#999"
                            multiline
                            numberOfLines={4}
                            maxLength={200}
                            textAlignVertical="top"
                        />
                        <Text style={styles.characterCount}>{description.length}/200</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#e9ecef",
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#212529",
    },
    cancelText: {
        fontSize: 16,
        color: "#6c757d",
    },
    saveText: {
        fontSize: 16,
        color: "#007bff",
        fontWeight: "600",
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#212529",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#dee2e6",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: "#212529",
        backgroundColor: "#fff",
    },
    textArea: {
        height: 100,
        paddingTop: 12,
    },
    characterCount: {
        fontSize: 12,
        color: "#6c757d",
        textAlign: "right",
        marginTop: 4,
    },
});

export default EditGroupModal;