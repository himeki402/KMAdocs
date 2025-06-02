import { TagService } from "@/services/tagService";

import { Category } from "@/types/category";
import { AccessType, Document } from "@/types/document";
import { Group } from "@/types/group";
import { Tag } from "@/types/tag";

import { CategoryService } from "@/services/categoryService";
import { GroupService } from "@/services/groupService";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Button,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

interface EditFormData {
    title: string;
    description?: string;
    accessType: AccessType;
    categoryId: string;
    tagIds?: string[];
    groupId?: string;
}

interface EditDocumentModalProps {
    visible: boolean;
    document: Document | null;
    onClose: () => void;
    onSubmit: (data: EditFormData) => Promise<void>;
}

const EditDocumentModal = ({
    visible,
    document,
    onClose,
    onSubmit,
}: EditDocumentModalProps) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [tags, setTags] = React.useState<Tag[]>([]);
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [groups, setGroups] = React.useState<Group[]>([]);
    const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<EditFormData>({
        defaultValues: {
            title: "",
            description: "",
            accessType: "PUBLIC" as AccessType,
            categoryId: "",
            tagIds: [],
            groupId: "",
        },
    });

    const watchedAccessType = watch("accessType");

    React.useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [tagResponse, categoryResponse, groupResponse] =
                    await Promise.all([
                        TagService.getTag(),
                        CategoryService.getCategories(),
                        GroupService.getMygroups(),
                    ]);
                setTags(tagResponse.data || []);
                setCategories(categoryResponse.data || []);
                setGroups(groupResponse.data || []);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Cập nhật giá trị mặc định khi document thay đổi
    React.useEffect(() => {
        if (document) {
            const tagIds = document.tags?.map((tag: Tag) => tag.id) || [];
            setSelectedTags(tagIds);

            reset({
                title: document.title,
                description: document.description || "",
                accessType: document.accessType,
                categoryId: document.categoryId,
                tagIds: tagIds,
                groupId: document.groupId || "",
            });
        }
    }, [document, reset]);

    const handleTagToggle = (tagId: string) => {
        const newSelectedTags = selectedTags.includes(tagId)
            ? selectedTags.filter((id) => id !== tagId)
            : [...selectedTags, tagId];

        setSelectedTags(newSelectedTags);
        setValue("tagIds", newSelectedTags);
    };

    const handleFormSubmit = async (data: EditFormData) => {
        setIsLoading(true);
        try {
            await onSubmit(data);
            onClose();
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.modalTitle}>
                            Chỉnh sửa tài liệu
                        </Text>

                        {/* Title Input */}
                        <Controller
                            control={control}
                            name="title"
                            rules={{ required: "Tiêu đề là bắt buộc" }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Tiêu đề"
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                        {errors.title && (
                            <Text style={styles.errorText}>
                                {errors.title.message}
                            </Text>
                        )}

                        {/* Description Input */}
                        <Controller
                            control={control}
                            name="description"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Mô tả (tùy chọn)"
                                    value={value}
                                    onChangeText={onChange}
                                    multiline
                                    numberOfLines={4}
                                />
                            )}
                        />

                        {/* Access Type Picker */}
                        <Text style={styles.label}>Quyền truy cập:</Text>
                        <Controller
                            control={control}
                            name="accessType"
                            rules={{ required: "Vui lòng chọn quyền truy cập" }}
                            render={({ field: { onChange, value } }) => (
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={value}
                                        onValueChange={onChange}
                                        style={styles.picker}
                                    >
                                        <Picker.Item
                                            label="Riêng tư"
                                            value="PRIVATE"
                                        />
                                        <Picker.Item
                                            label="Nhóm"
                                            value="GROUP"
                                        />
                                    </Picker>
                                </View>
                            )}
                        />
                        {errors.accessType && (
                            <Text style={styles.errorText}>
                                {errors.accessType.message}
                            </Text>
                        )}

                        {/* Category Picker */}
                        <Text style={styles.label}>Danh mục:</Text>
                        <Controller
                            control={control}
                            name="categoryId"
                            rules={{ required: "Vui lòng chọn danh mục" }}
                            render={({ field: { onChange, value } }) => (
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={value}
                                        onValueChange={onChange}
                                        style={styles.picker}
                                    >
                                        <Picker.Item
                                            label="Chọn danh mục..."
                                            value=""
                                        />
                                        {categories.map((category) => (
                                            <Picker.Item
                                                key={category.id}
                                                label={category.name}
                                                value={category.id}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            )}
                        />
                        {errors.categoryId && (
                            <Text style={styles.errorText}>
                                {errors.categoryId.message}
                            </Text>
                        )}

                        {/* Group Picker - Only show if access type is GROUP */}
                        {watchedAccessType === "GROUP" && (
                            <>
                                <Text style={styles.label}>Nhóm:</Text>
                                <Controller
                                    control={control}
                                    name="groupId"
                                    rules={{
                                        required:
                                            watchedAccessType === "GROUP"
                                                ? "Vui lòng chọn nhóm"
                                                : false,
                                    }}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <View style={styles.pickerContainer}>
                                            <Picker
                                                selectedValue={value}
                                                onValueChange={onChange}
                                                style={styles.picker}
                                            >
                                                <Picker.Item
                                                    label="Chọn nhóm..."
                                                    value=""
                                                />
                                                {groups.map((group) => (
                                                    <Picker.Item
                                                        key={group.id}
                                                        label={group.name}
                                                        value={group.id}
                                                    />
                                                ))}
                                            </Picker>
                                        </View>
                                    )}
                                />
                                {errors.groupId && (
                                    <Text style={styles.errorText}>
                                        {errors.groupId.message}
                                    </Text>
                                )}
                            </>
                        )}

                        {/* Tags Selection */}
                        <Text style={styles.label}>Thẻ (tùy chọn):</Text>
                        <View style={styles.tagsContainer}>
                            {tags.map((tag) => (
                                <View key={tag.id} style={styles.tagItem}>
                                    <Button
                                        title={tag.name}
                                        onPress={() => handleTagToggle(tag.id)}
                                        color={
                                            selectedTags.includes(tag.id)
                                                ? "#007AFF"
                                                : "#8E8E93"
                                        }
                                    />
                                </View>
                            ))}
                        </View>

                        <View style={styles.buttonContainer}>
                            <Button
                                title="Hủy"
                                onPress={onClose}
                                color="#ff4444"
                                disabled={isLoading}
                            />
                            <Button
                                title={isLoading ? "Đang lưu..." : "Lưu"}
                                onPress={handleSubmit(handleFormSubmit)}
                                disabled={isLoading}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "90%",
        maxHeight: "80%",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 5,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 10,
    },
    picker: {
        height: 50,
    },
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 15,
        gap: 8,
    },
    tagItem: {
        marginRight: 8,
        marginBottom: 8,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
});

export default EditDocumentModal;
