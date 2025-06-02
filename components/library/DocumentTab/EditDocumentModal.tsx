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
    TouchableOpacity,
    ActivityIndicator,
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
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity 
                            onPress={onClose}
                            style={styles.closeButton}
                            disabled={isLoading}
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>
                            Chỉnh sửa tài liệu
                        </Text>
                        <View style={styles.placeholder} />
                    </View>

                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContainer}
                    >
                        {/* Title Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Tiêu đề *</Text>
                            <Controller
                                control={control}
                                name="title"
                                rules={{ required: "Tiêu đề là bắt buộc" }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        style={[
                                            styles.input,
                                            errors.title && styles.inputError
                                        ]}
                                        placeholder="Nhập tiêu đề tài liệu"
                                        value={value}
                                        onChangeText={onChange}
                                        placeholderTextColor="#9CA3AF"
                                    />
                                )}
                            />
                            {errors.title && (
                                <Text style={styles.errorText}>
                                    {errors.title.message}
                                </Text>
                            )}
                        </View>

                        {/* Description Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mô tả</Text>
                            <Controller
                                control={control}
                                name="description"
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        placeholder="Nhập mô tả chi tiết (tùy chọn)"
                                        value={value}
                                        onChangeText={onChange}
                                        multiline
                                        numberOfLines={4}
                                        placeholderTextColor="#9CA3AF"
                                    />
                                )}
                            />
                        </View>

                        {/* Access Type Picker */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Quyền truy cập *</Text>
                            <Controller
                                control={control}
                                name="accessType"
                                rules={{ required: "Vui lòng chọn quyền truy cập" }}
                                render={({ field: { onChange, value } }) => (
                                    <View style={[
                                        styles.pickerContainer,
                                        errors.accessType && styles.inputError
                                    ]}>
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
                        </View>

                        {/* Category Picker */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Danh mục *</Text>
                            <Controller
                                control={control}
                                name="categoryId"
                                rules={{ required: "Vui lòng chọn danh mục" }}
                                render={({ field: { onChange, value } }) => (
                                    <View style={[
                                        styles.pickerContainer,
                                        errors.categoryId && styles.inputError
                                    ]}>
                                        <Picker
                                            selectedValue={value}
                                            onValueChange={onChange}
                                            style={styles.picker}
                                        >
                                            <Picker.Item
                                                label="Chọn danh mục..."
                                                value=""
                                                color="#9CA3AF"
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
                        </View>

                        {/* Group Picker - Only show if access type is GROUP */}
                        {watchedAccessType === "GROUP" && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Nhóm *</Text>
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
                                        <View style={[
                                            styles.pickerContainer,
                                            errors.groupId && styles.inputError
                                        ]}>
                                            <Picker
                                                selectedValue={value}
                                                onValueChange={onChange}
                                                style={styles.picker}
                                            >
                                                <Picker.Item
                                                    label="Chọn nhóm..."
                                                    value=""
                                                    color="#9CA3AF"
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
                            </View>
                        )}

                        {/* Tags Selection */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Thẻ</Text>
                            <View style={styles.tagsContainer}>
                                {tags.map((tag) => (
                                    <TouchableOpacity
                                        key={tag.id}
                                        style={[
                                            styles.tagButton,
                                            selectedTags.includes(tag.id) && styles.tagButtonSelected
                                        ]}
                                        onPress={() => handleTagToggle(tag.id)}
                                    >
                                        <Text style={[
                                            styles.tagButtonText,
                                            selectedTags.includes(tag.id) && styles.tagButtonTextSelected
                                        ]}>
                                            {tag.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer Buttons */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            disabled={isLoading}
                        >
                            <Text style={styles.cancelButtonText}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={handleSubmit(handleFormSubmit)}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <Text style={styles.saveButtonText}>Lưu</Text>
                            )}
                        </TouchableOpacity>
                    </View>
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
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        width: "92%",
        maxHeight: "85%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    closeButtonText: {
        fontSize: 16,
        color: "#6B7280",
        fontWeight: "600",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1F2937",
        textAlign: "center",
    },
    placeholder: {
        width: 32,
    },
    scrollContainer: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#374151",
    },
    input: {
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        backgroundColor: "#FAFAFA",
        color: "#1F2937",
    },
    inputError: {
        borderColor: "#EF4444",
        backgroundColor: "#FEF2F2",
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    pickerContainer: {
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        backgroundColor: "#FAFAFA",
        overflow: "hidden",
    },
    picker: {
        height: 54,
        color: "#1F2937",
    },
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    tagButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        backgroundColor: "#FFFFFF",
    },
    tagButtonSelected: {
        backgroundColor: "#3B82F6",
        borderColor: "#3B82F6",
    },
    tagButtonText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#6B7280",
    },
    tagButtonTextSelected: {
        color: "#FFFFFF",
    },
    errorText: {
        color: "#EF4444",
        fontSize: 14,
        marginTop: 4,
        fontWeight: "500",
    },
    footer: {
        flexDirection: "row",
        gap: 12,
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 52,
    },
    cancelButton: {
        backgroundColor: "#F3F4F6",
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
    },
    saveButton: {
        backgroundColor: "#3B82F6",
        shadowColor: "#3B82F6",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#6B7280",
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
    },
});

export default EditDocumentModal;